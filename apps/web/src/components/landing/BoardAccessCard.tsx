import { useBoardForm, Tab } from '../../hooks/useBoardForm';
import { Button, Input, Tabs } from '@sketch-battle/ui';

const tabOptions: { id: Tab; label: string }[] = [
  { id: 'create', label: 'Create Board' },
  { id: 'join', label: 'Join Board' },
];

export function BoardAccessCard() {
  const {
    tab,
    loading,
    errors,
    register,
    handleTabChange,
    handleSubmit,
  } = useBoardForm();

  return (
    <div className="relative z-10 w-full max-w-[420px] bg-[#0a0f1c]/70 backdrop-blur-2xl border border-white/[0.04] rounded-[32px] overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)] mx-auto">
      <Tabs
        options={tabOptions}
        activeTab={tab}
        onTabChange={handleTabChange}
      />

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="px-8 pb-8 pt-2 flex flex-col gap-6">
        <div className="space-y-4">
          <Input
            label="Collaborator Name"
            placeholder="e.g. Alex Rivera"
            error={errors.name?.message}
            {...register('name')}
          />

          {tab === 'join' && (
            <Input
              label="Board Code"
              placeholder="e.g. DESIGN-XP"
              error={errors.roomCode?.message}
              className="font-mono tracking-[0.15em] uppercase"
              {...register('roomCode')}
            />
          )}
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
          className="mt-4"
        >
          {tab === 'create' ? "Launch Board →" : "Connect →"}
        </Button>
      </form>
    </div>
  );
}
