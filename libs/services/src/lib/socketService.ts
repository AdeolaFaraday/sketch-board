import { io, Socket } from 'socket.io-client';
import { useBoardStore } from '@sketch-battle/hooks';
import { BoardState, Member, Message, DrawingStroke } from '@sketch-battle/types';

class SocketService {
  private socket: Socket | null = null;

  connect(url = 'http://localhost:3000') {
    this.socket = io(url);

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
