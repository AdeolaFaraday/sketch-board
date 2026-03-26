import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socketService } from '@sketch-battle/services';
import { useBoardStore } from '@sketch-battle/hooks';
import { BoardHeader } from '../components/board/BoardHeader';
import { CollaboratorsSidebar } from '../components/board/CollaboratorsSidebar';
import { BoardCanvas } from '../components/board/BoardCanvas';
import { BoardToolbar, ActiveTool } from '../components/board/BoardToolbar';
import { ChatSidebar } from '../components/board/ChatSidebar';

export function BoardPage() {
  const { id: urlRoomCode } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boardState, messages, currentMember, isJoined } = useBoardStore();
  const [activeTool, setActiveTool] = useState<ActiveTool>('pen');

  // Auto-rejoin logic on refresh or deep link
  useEffect(() => {
    if (!isJoined && urlRoomCode) {
      const storedName = localStorage.getItem('sketch_board_user_name');
      if (storedName) {
        socketService.joinBoard(storedName, urlRoomCode);
      } else {
        navigate('/');
      }
    }
  }, [isJoined, urlRoomCode, navigate]);

  const members = boardState?.members ?? [];
  const roomCode = boardState?.roomCode ?? urlRoomCode ?? '---';

  const handleClear = () => {
    // TODO: wire up clear via socket when server-side supported
    console.log('Clear board');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <BoardHeader roomCode={roomCode} />

      {/* Main area */}
      <main className="flex-1 flex overflow-hidden p-3 gap-3 min-h-0">
        {/* Left: Collaborators */}
        <CollaboratorsSidebar
          members={members}
          currentMemberId={currentMember?.id}
        />

        {/* Centre: Canvas + Toolbar stacked */}
        <section className="flex-1 flex flex-col gap-0 min-w-0 min-h-0">
          <BoardCanvas
            strokes={boardState?.strokes || []}
            activeTool={activeTool}
            onStrokeEnd={(stroke) => {
              const fullStroke = { ...stroke, memberId: currentMember?.id || '' };
              socketService.sendDrawEvent(fullStroke);
              useBoardStore.getState().addStroke(fullStroke);
            }}
            onDrawSegment={(segment) => {
              const fullSegment = { ...segment, memberId: currentMember?.id || '' };
              socketService.sendDrawEvent(fullSegment);
              useBoardStore.getState().addStroke(fullSegment);
            }}
          />
          <BoardToolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            onClear={handleClear}
          />
        </section>

        {/* Right: Chat */}
        <ChatSidebar
          messages={messages}
          currentMemberId={currentMember?.id}
          onSendMessage={(text) => socketService.sendMessage(text)}
        />
      </main>
    </div>
  );
}
