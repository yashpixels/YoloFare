import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vviesiudngzwbvpwfgoh.supabase.co'
// Replace with your actual anon key from Vercel env vars
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2aWVzaXVkbmd6d2J2cHdmZ29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzgxNDAsImV4cCI6MjA5NTQ1NDE0MH0.1g0nJKgGN6JhejqbapdLVxOIdnRAR4RQJ2qIx0jLQQg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInEnv: false,
  },
})
