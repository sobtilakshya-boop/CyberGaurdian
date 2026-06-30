import fs from 'fs'
import path from 'path'

const MOCK_DB_PATH = path.join(process.cwd(), 'mock_db.json')

export interface MockUser {
  id: string
  full_name: string
  email: string
  phone: string
  password_hash: string
  created_at: string
  is_verified: boolean
  last_login?: string
  login_count?: number
}

// Check if actual Supabase URL/key has been filled in
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return (
    !!url &&
    url.startsWith('http') &&
    !url.includes('your_supabase') &&
    !!key &&
    !key.includes('your_supabase')
  )
}

export function getMockUsers(): MockUser[] {
  if (!fs.existsSync(MOCK_DB_PATH)) {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify([]))
    return []
  }
  try {
    return JSON.parse(fs.readFileSync(MOCK_DB_PATH, 'utf-8'))
  } catch {
    return []
  }
}

export function saveMockUser(user: MockUser) {
  const users = getMockUsers()
  // Ensure email/phone unique constraints locally
  if (users.some((u) => u.email === user.email || u.phone === user.phone)) {
    throw new Error('User already exists')
  }
  users.push(user)
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(users, null, 2))
}

export function findMockUserByEmailOrPhone(email: string, phone: string): MockUser | undefined {
  const users = getMockUsers()
  return users.find((u) => u.email === email || u.phone === phone)
}

export function findMockUserByEmail(email: string): MockUser | undefined {
  const users = getMockUsers()
  return users.find((u) => u.email === email)
}

export function updateMockUser(id: string, updates: Partial<MockUser>) {
  const users = getMockUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates }
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(users, null, 2))
  }
}
