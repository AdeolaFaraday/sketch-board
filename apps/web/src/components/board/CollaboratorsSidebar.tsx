import { MemberCard } from '@sketch-battle/ui';
import { Member } from '@sketch-battle/types';
import { CloseIcon } from '../svg/CloseIcon';

interface CollaboratorsSidebarProps {
  members: Member[];
  currentMemberId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function CollaboratorsSidebar({ 
  members, 
  currentMemberId, 
  isOpen, 
  onClose 
}: CollaboratorsSidebarProps) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 shadow-2xl transition-transform duration-300 transform
      lg:static lg:translate-x-0 lg:w-60 lg:bg-slate-900/50 lg:shadow-none lg:rounded-2xl lg:border lg:border-white/[0.05] lg:backdrop-blur-sm
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      flex flex-col gap-3 overflow-hidden p-3
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-0.5">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Collaborators
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_theme(colors.emerald.400)]" />
            <span className="text-[10px] tabular-nums font-semibold text-slate-500">{members.length}</span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Member list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-0.5">
        {members.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-6">
            <p className="text-[11px] text-slate-600 text-center">No collaborators yet</p>
          </div>
        ) : (
          members.map((member) => (
            <MemberCard
              key={member.id}
              name={member.name}
              color={member.color}
              isHost={member.isHost}
              joinedAt={member.joinedAt}
              status={member.status}
              isCurrentMember={member.id === currentMemberId}
            />
          ))
        )}
      </div>
    </aside>
  );
}
