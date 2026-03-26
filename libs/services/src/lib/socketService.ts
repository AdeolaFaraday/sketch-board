import { io, Socket } from 'socket.io-client';
import { useBoardStore } from '@sketch-battle/hooks';
import { BoardState, Member, Message, DrawingStroke } from '@sketch-battle/types';

class SocketService {
  private socket: Socket | null = null;

  connect(url?: string) {
    if (this.socket?.connected) return;
    
    // Default to current host but on port 3000 for the server
    let connectionUrl = url;
    if (!connectionUrl && typeof window !== 'undefined') {
      const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
      connectionUrl = `${window.location.protocol}//${host}:3000`;
    } else if (!connectionUrl) {
      connectionUrl = 'http://127.0.0.1:3000';
    }

    console.log('Connecting to socket at:', connectionUrl);
    this.socket = io(connectionUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('board_updated', (boardState: BoardState) => {
      useBoardStore.getState().setBoardState(boardState);
    });

    this.socket.on('member_list_updated', (members: Member[]) => {
      const state = useBoardStore.getState().boardState;
      if (state) {
        useBoardStore.getState().setBoardState({ ...state, members });
      }
    });

    this.socket.on('new_message', (message: Message) => {
      useBoardStore.getState().addMessage(message);
    });

    this.socket.on('draw_event', (stroke: DrawingStroke) => {
      useBoardStore.getState().addStroke(stroke);
    });

    this.socket.on('session_started', () => {
      const state = useBoardStore.getState().boardState;
      if (state) {
        useBoardStore.getState().setBoardState({ ...state, status: 'ACTIVE' });
      }
    });
  }

  joinBoard(memberName: string, roomCode?: string) {
    this.socket?.emit('join_board', { memberName, roomCode });
    useBoardStore.getState().setIsJoined(true);
  }

  startSession() {
    this.socket?.emit('start_session');
  }

  sendDrawEvent(stroke: DrawingStroke) {
    this.socket?.emit('draw_event', stroke);
  }

  sendMessage(text: string) {
    this.socket?.emit('send_message', text);
  }

  onDrawEvent(callback: (stroke: DrawingStroke) => void) {
    this.socket?.on('draw_event', callback);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = new SocketService();
