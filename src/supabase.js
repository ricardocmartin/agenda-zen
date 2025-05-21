import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nivvbndswqkjnifvkauf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdnZibmRzd3Fram5pZnZrYXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTAzMzEsImV4cCI6MjA2MzQyNjMzMX0.UocPLAEg1htKV7ZivlqRR3GZhDDCNi1jSseGikVpYv4'

export const supabase = createClient(supabaseUrl, supabaseKey)
