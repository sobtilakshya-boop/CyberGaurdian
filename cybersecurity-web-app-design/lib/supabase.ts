import { createClient } from '@supabase/supabase-js'

// Fallbacks used during Next.js static build to prevent crash on unitialized/placeholder variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : 'https://placeholder-project.supabase.co'

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

/**
 * Public Supabase client — uses the anon key.
 * Safe to use in browser/client components.
 */
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Server-side Supabase client — uses the service role key.
 * MUST only be used in Server Components or API Route Handlers.
 * Never expose this client or its key to the browser.
 */
export function createAdminClient() {
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://placeholder-project.supabase.co'

  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'

  return createClient(adminUrl, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
