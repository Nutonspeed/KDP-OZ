export interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  role: string | null
  app_metadata: Record<string, any>
  user_metadata: { role?: string; [key: string]: any }
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'alice@example.com',
    created_at: new Date().toISOString(),
    last_sign_in_at: null,
    email_confirmed_at: null,
    role: 'authenticated',
    app_metadata: {},
    user_metadata: { role: 'admin', segment: 'returning' },
  },
  {
    id: '2',
    email: 'bob@example.com',
    created_at: new Date().toISOString(),
    last_sign_in_at: null,
    email_confirmed_at: null,
    role: 'authenticated',
    app_metadata: {},
    user_metadata: { role: 'viewer', segment: 'new' },
  },
]
