import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://djwbuyirbqrduukiprqg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqd2J1eWlyYnFyZHV1a2lwcnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3Nzc5NTgsImV4cCI6MjA0ODM1Mzk1OH0.KUPmEXfXNCoS2ZRNnuBrZ-Y1YCR5tX5rk5BgVTguhiE";


if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or anon key. Check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;




