import { useState, useRef, useEffect } from 'react';
import { Input, Button, RoomCodeBadge } from '@sketch-battle/ui';
import { UsersIcon } from '../svg/UsersIcon';

interface JoinBoardModalProps {
  roomCode: string;
  onJoin: (name: string) => void;
}

export function JoinBoardModal({ roomCode, onJoin }: JoinBoardModalProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onJoin(name.trim());
  };

  const isValid = name.trim().length > 0;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)' }}
    >
      {/* Card */}
      <div
        className="animate-slide-up relative w-full max-w-sm rounded-3xl overflow-hidden border border-white/[0.08]"
        style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), 0 0 80px rgba(99,102,241,0.08)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-80"
        />

        <div className="p-8">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-white/[0.08] text-blue-500 shadow-2xl"
              >
                <UsersIcon className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Join the Board
            </h1>
            <p className="text-sm text-slate-400 mb-4">
              Collaborate and sketch in real-time
            </p>
            <div className="inline-block">
              <RoomCodeBadge code={roomCode} />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="join-name"
              ref={inputRef}
              label="Your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex, Sam…"
              maxLength={30}
              autoComplete="off"
            />

            <Button
              type="submit"
              disabled={!isValid}
              fullWidth
              variant="primary"
            >
              Join Board
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
