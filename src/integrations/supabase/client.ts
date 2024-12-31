import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://yeogwkbyfqwacwfirqce.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb2d3a2J5ZnF3YWN3ZmlycWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4NzI5NjAsImV4cCI6MjAyMjQ0ODk2MH0.GgYD1-RaKvNFPXfxGDBF-5zK7JxMeOvHEBqz5kqbXBs'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)