import { MemberCard } from '@sketch-battle/ui';
import { Member } from '@sketch-battle/types';

interface CollaboratorsSidebarProps {
  members: Member[];
  currentMemberId?: string;
}

export function CollaboratorsSidebar({ members, currentMemberId }: CollaboratorsSidebarProps) {
  return (
    <aside className="w-60 shrink-0 flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/[0.05] bg-slate-900/50 backdrop-blur-sm p-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-0.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Collaborators
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_theme(colors.emerald.400)]" />
          <span className="text-[10px] tabular-nums font-semibold text-slate-500">{members.length}</span>
        </div>
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
