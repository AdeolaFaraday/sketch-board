import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { socketService } from '@sketch-battle/services';

export type Tab = 'create' | 'join';

// Validation schemas
const joinSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(20, 'Name is too long'),
  roomCode: z.string().min(4, 'Enter a valid board code').max(12).toUpperCase(),
});

const createSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(20, 'Name is too long'),
  roomCode: z.string().optional(),
});

type FormData = z.infer<typeof joinSchema> | z.infer<typeof createSchema>;

export function useBoardForm() {
  const [tab, setTab] = useState<Tab>('create');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(tab === 'create' ? createSchema : joinSchema),
    defaultValues: {
      name: '',
      roomCode: '',
    },
  });

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    reset();
  };

  const onSubmit = (data: FormData) => {
    setLoading(true);
    const name = data.name.trim();
    const roomCode = tab === 'join' ? data.roomCode?.trim() : undefined;

    // Persist name for auto-rejoin
    localStorage.setItem('sketch_board_user_name', name);
    
    socketService.joinBoard(name, roomCode);
    // Safety timeout
    setTimeout(() => setLoading(false), 3000);
  };

  return {
    tab,
    loading,
    errors,
    register,
    handleTabChange,
    handleSubmit: handleSubmit(onSubmit),
  };
}
