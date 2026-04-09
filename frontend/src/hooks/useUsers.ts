import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User } from '@/types/api';

const USERS_KEY = ['users'] as const;

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: () => api.get<User[]>('/users').then((r) => r.data),
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => api.get<User>('/users/me').then((r) => r.data),
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Pick<User, 'name' | 'email'>>) =>
      api.patch<User>(`/users/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: USERS_KEY });
      void qc.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}
