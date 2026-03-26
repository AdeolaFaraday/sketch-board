import { io, Socket } from 'socket.io-client';
import { useBoardStore } from '@sketch-battle/hooks';
import { BoardState, Member, Message, DrawingStroke } from '@sketch-battle/types';

class SocketService {
  private socket: Socket | null = null;
  private _connectCallbacks: (() => void)[] = [];

  connect(url?: string) {
    if (this.socket?.connected) return;

    // Dynamic URL handling for deployment
    const envUrl = import.meta.env['VITE_SOCKET_URL'];
    let connectionUrl = url || envUrl;

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

    this.socket.on('connect', () => {
      this._connectCallbacks.forEach((cb) => cb());
      this._connectCallbacks = [];
    });

    this.socket.on('joined', (member: Member) => {
      useBoardStore.getState().setCurrentMember(member);
      useBoardStore.getState().setIsJoined(true);
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

    this.socket.on('stroke_deleted', (strokeId: string) => {
      useBoardStore.getState().deleteStroke(strokeId);
    });

    this.socket.on('board_cleared', () => {
      useBoardStore.getState().clearStrokes();
    });

    this.socket.on('session_started', () => {
      const state = useBoardStore.getState().boardState;
      if (state) {
        useBoardStore.getState().setBoardState({ ...state, status: 'ACTIVE' });
      }
    });
  }

  /** Call `cb` once when connected. Returns an unsubscribe function. */
  onConnect(cb: () => void): () => void {
    if (this.socket?.connected) {
      cb();
      return () => {};
    }
    this._connectCallbacks.push(cb);
    return () => {
      this._connectCallbacks = this._connectCallbacks.filter((fn) => fn !== cb);
    };
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

  deleteStroke(strokeId: string) {
    this.socket?.emit('delete_stroke', strokeId);
  }

  clearBoard() {
    this.socket?.emit('clear_board');
  }

  onDrawEvent(callback: (stroke: DrawingStroke) => void) {
    this.socket?.on('draw_event', callback);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = new SocketService();
