import { socketService } from '@sketch-battle/services';
import { useBoardPage } from '../hooks/useBoardPage';
import { BoardHeader } from '../components/board/BoardHeader';
import { CollaboratorsSidebar } from '../components/board/CollaboratorsSidebar';
import { BoardCanvas } from '../components/board/BoardCanvas';
import { BoardToolbar } from '../components/board/BoardToolbar';
import { ChatSidebar } from '../components/board/ChatSidebar';
import { JoinBoardModal } from '../components/board/JoinBoardModal';

export function BoardPage() {
  const {
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
  } = useBoardPage();

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      {/* Join modal for shared-link visitors */}
      {showJoinModal && (
        <JoinBoardModal roomCode={roomCode} onJoin={handleJoin} />
      )}

      {/* Header */}
      <BoardHeader 
        roomCode={roomCode} 
        onToggleMembers={toggleMembers}
        onToggleChat={toggleChat}
        hasNewMessages={false} // Could be wired to message count later
      />

      {/* Main area */}
      <main className="flex-1 flex overflow-hidden lg:p-3 lg:gap-3 min-h-0 relative">
        {/* Mobile Backdrop Overlay */}
        {(isMembersOpen || isChatOpen) && (
          <div 
            className="lg:hidden absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => {
              setIsMembersOpen(false);
              setIsChatOpen(false);
            }}
          />
        )}

        {/* Left: Collaborators */}
        <CollaboratorsSidebar
          members={members}
          currentMemberId={currentMember?.id}
          isOpen={isMembersOpen}
          onClose={() => setIsMembersOpen(false)}
        />

        {/* Centre: Canvas + Toolbar stacked */}
        <section className="flex-1 flex flex-col gap-0 min-w-0 min-h-0">
          <BoardCanvas
            strokes={boardState?.strokes || []}
            activeTool={activeTool}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            onStrokeEnd={handleDraw}
            onDrawSegment={handleDrawSegment}
            onStrokeDelete={(strokeId) => socketService.deleteStroke(strokeId)}
          />
          <BoardToolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            strokeColor={strokeColor}
            onColorChange={setStrokeColor}
            strokeWidth={strokeWidth}
            onWidthChange={setStrokeWidth}
            onClear={() => {
              if (window.confirm('Are you sure you want to clear the entire board? This cannot be undone.')) {
                socketService.clearBoard();
              }
            }}
          />
        </section>

        {/* Right: Chat */}
        <ChatSidebar
          messages={messages}
          currentMemberId={currentMember?.id}
          onSendMessage={(text) => socketService.sendMessage(text)}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </main>
    </div>
  );
}
