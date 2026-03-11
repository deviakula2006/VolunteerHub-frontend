import { createClient } from "@supabase/supabase-js";

// Hardcoded for now based on the backend env variables
const supabaseUrl = "https://erocnfjczysayzwrydkd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyb2NuZmpjenlzYXl6d3J5ZGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzc4OTMsImV4cCI6MjA4NzgxMzg5M30.iEUIHVIgsNkC1HGHPY0azXQBg5Wl0jR88BYE9-FlmBw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
