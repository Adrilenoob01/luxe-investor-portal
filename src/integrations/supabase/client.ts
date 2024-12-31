import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://yeogwkbyfqwacwfirqce.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb2d3a2J5ZnF3YWN3ZmlycWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNDUzNDIsImV4cCI6MjA0ODkyMTM0Mn0.HOtYGe6C4ZUu7QmyMJuI5_uFNNnq5TjJfLFL0XVxx8k'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)