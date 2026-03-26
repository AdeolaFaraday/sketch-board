import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socketService } from '@sketch-battle/services';
import { useBoardStore } from '@sketch-battle/hooks';
import { DrawingStroke } from '@sketch-battle/types';
import type { ActiveTool } from '../components/board/BoardToolbar';

const USER_NAME_KEY = 'sketch_board_user_name';

export function useBoardPage() {
  const { id: urlRoomCode } = useParams<{ id: string }>();
  const { boardState, messages, currentMember, isJoined } = useBoardStore();
  const [activeTool, setActiveTool] = useState<ActiveTool>('pen');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  // Mobile drawer states
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Auto-close other drawer when one opens on mobile
  const toggleMembers = () => {
    setIsMembersOpen(!isMembersOpen);
    if (!isMembersOpen) setIsChatOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) setIsMembersOpen(false);
  };

  // On load: wait for socket connection, then auto-rejoin or show modal
  useEffect(() => {
    if (isJoined || !urlRoomCode) return;

    const unsub = socketService.onConnect(() => {
      const storedName = localStorage.getItem(USER_NAME_KEY);
      if (storedName) {
        socketService.joinBoard(storedName, urlRoomCode);
      } else {
        setShowJoinModal(true);
      }
    });

    return unsub;
  }, [isJoined, urlRoomCode]);

  // After joining, close the modal
  useEffect(() => {
    if (isJoined) {
      setShowJoinModal(false);
    }
  }, [isJoined]);

  const handleJoin = (name: string) => {
    if (!name.trim() || !urlRoomCode) return;
    localStorage.setItem(USER_NAME_KEY, name.trim());
    socketService.joinBoard(name.trim(), urlRoomCode);
  };

  const handleDraw = (stroke: DrawingStroke) => {
    const fullStroke = { ...stroke, memberId: currentMember?.id || 'local' };
    socketService.sendDrawEvent(fullStroke);
    useBoardStore.getState().addStroke(fullStroke);
  };

  const handleDrawSegment = (segment: DrawingStroke) => {
    // Segments are ONLY broadcast for remote real-time preview.
    // They are NOT added to the local store because the canvas
    // already renders the in-progress stroke via currentStrokePoints.ref.
    // Storing them would cause the eraser (which filters by ID) to
    // delete many tiny same-ID entries, appearing to clear everything.
    const fullSegment = { ...segment, memberId: currentMember?.id || 'local' };
    socketService.sendDrawEvent(fullSegment);
  };

  const members = boardState?.members ?? [];
  const roomCode = boardState?.roomCode ?? urlRoomCode ?? '---';

  return {
    activeTool,
    setActiveTool,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    showJoinModal,
    handleJoin,
    handleDraw,
    handleDrawSegment,
    boardState,
    messages,
    currentMember,
    members,
    roomCode,
    isMembersOpen,
    setIsMembersOpen,
    isChatOpen,
    setIsChatOpen,
    toggleMembers,
    toggleChat,
  };
}
