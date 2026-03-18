import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://whdchsxojkhxrcncnayx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZGNoc3hvamtoeHJjbmNuYXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTMwNzUsImV4cCI6MjA4OTQyOTA3NX0.AjNkq33sY0lEWpz8d4cAhJSMBrt5kt7BTmvwkvmrKQ0'

export const supabase = createClient(supabaseUrl, supabaseKey)