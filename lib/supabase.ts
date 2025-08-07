const mockClient = {
  from: () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
    eq: () => mockClient.from(),
    order: () => mockClient.from(),
    range: () => mockClient.from(),
    limit: () => mockClient.from(),
  }),
  auth: {
    signInWithPassword: async () => ({ data: { user: { id: '1', email: 'mock@example.com' } }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    admin: {
      updateUserById: async () => ({ data: { user: null }, error: null }),
      deleteUser: async () => ({ error: null }),
      createUser: async () => ({ data: { user: null }, error: null }),
    },
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

export function createSupabaseBrowserClient() {
  return mockClient as any;
}
export const supabaseBrowser = createSupabaseBrowserClient;
export function createSupabaseServerClient() {
  return mockClient as any;
}
export function createSupabaseAdminClient() {
  return mockClient as any;
}
