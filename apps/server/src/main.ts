import * as express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { BoardState, Member, Message, DrawingStroke } from '@sketch-battle/types';
import { generateRoomCode } from '@sketch-battle/utils';
import { createInitialBoardState } from '@sketch-battle/board-logic';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ["GET", "POST"]
  },
});

const boards: Record<string, BoardState> = {};
const memberBoards: Record<string, string> = {};

// Helper to assign a random color to a member
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_board', ({ roomCode, memberName }: { roomCode: string; memberName: string }) => {
    let code = roomCode?.toUpperCase();

    if (!code) {
      code = generateRoomCode();
    }

    if (!boards[code]) {
      boards[code] = createInitialBoardState(code);
    }

    const member: Member = {
      id: socket.id,
      name: memberName,
      color: COLORS[boards[code].members.length % COLORS.length],
      joinedAt: Date.now(),
      isHost: boards[code].members.length === 0,
      status: 'IN_LOBBY',
    };

    boards[code].members.push(member);
    memberBoards[socket.id] = code;
    socket.join(code);

    io.to(code).emit('board_updated', boards[code]);
    io.to(code).emit('member_list_updated', boards[code].members);

    // System message
    const joinMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'system',
      senderName: 'System',
      text: `${memberName} joined the board`,
      timestamp: Date.now(),
      type: 'SYSTEM',
    };
    io.to(code).emit('new_message', joinMessage);

    console.log(`Member ${memberName} joined board ${code}`);
  });

  socket.on('start_session', () => {
    const code = memberBoards[socket.id];
    const board = boards[code];

    if (board && board.status === 'LOBBY') {
      const member = board.members.find(m => m.id === socket.id);
      if (member?.isHost) {
        board.status = 'ACTIVE';
        io.to(code).emit('board_updated', board);
        io.to(code).emit('session_started');
      }
    }
  });

  socket.on('draw_event', (stroke: DrawingStroke) => {
    const code = memberBoards[socket.id];
    if (code && boards[code]) {
      // Persist the stroke in the server state
      boards[code].strokes.push(stroke);
      // Broadcast to other members
      socket.to(code).emit('draw_event', stroke);
    }
  });

  socket.on('send_message', (text: string) => {
    const code = memberBoards[socket.id];
    const board = boards[code];
    const member = board?.members.find(m => m.id === socket.id);

    if (board && member) {
      const message: Message = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: socket.id,
        senderName: member.name,
        text,
        timestamp: Date.now(),
        type: 'CHAT',
      };
      io.to(code).emit('new_message', message);
    }
  });

  socket.on('disconnect', () => {
    const code = memberBoards[socket.id];
    if (code && boards[code]) {
      const member = boards[code].members.find(m => m.id === socket.id);
      boards[code].members = boards[code].members.filter(m => m.id !== socket.id);
      delete memberBoards[socket.id];

      if (boards[code].members.length === 0) {
        delete boards[code];
      } else {
        // If host left, assign new host
        if (member?.isHost && boards[code].members.length > 0) {
          boards[code].members[0].isHost = true;
        }

        io.to(code).emit('board_updated', boards[code]);
        io.to(code).emit('member_list_updated', boards[code].members);

        const leaveMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: 'system',
          senderName: 'System',
          text: `${member?.name || 'A user'} left the board`,
          timestamp: Date.now(),
          type: 'SYSTEM',
        };
        io.to(code).emit('new_message', leaveMessage);
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
