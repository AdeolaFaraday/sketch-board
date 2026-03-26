export type BoardStatus = 'LOBBY' | 'ACTIVE' | 'ARCHIVED';

export interface Member {
  id: string;
  name: string;
  color: string;         // For cursor and avatar mapping
  joinedAt: number;      // Timestamp
  isHost: boolean;
  status: 'IN_LOBBY' | 'ACTIVE' | 'AWAY';
}

export interface Point {
  x: number;
  y: number;
}

export interface DrawingStroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  memberId: string;
}

export interface BoardState {
  id: string;
  name: string;
  status: BoardStatus;
  members: Member[];
  roomCode: string;
  createdAt: number;
  strokes: DrawingStroke[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  type: 'CHAT' | 'SYSTEM' | 'ACTION';
}

export interface JoinBoardPayload {
  roomCode: string;
  memberName: string;
}

export interface SocketEvents {
  // Client to Server
  JOIN_BOARD: 'join_board';
  LEAVE_BOARD: 'leave_board';
  START_SESSION: 'start_session';
  DRAW_EVENT: 'draw_event';
  SEND_MESSAGE: 'send_message';
  
  // Server to Client
  BOARD_UPDATED: 'board_updated';
  MEMBER_LIST_UPDATED: 'member_list_updated';
  NEW_MESSAGE: 'new_message';
  SESSION_STARTED: 'session_started';
  ERROR: 'error';
}
