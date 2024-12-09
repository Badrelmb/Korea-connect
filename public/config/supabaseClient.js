import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.30.0/+esm';

const supabaseUrl = "https://djwbuyirbqrduukiprqg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqd2J1eWlyYnFyZHV1a2lwcnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3Nzc5NTgsImV4cCI6MjA0ODM1Mzk1OH0.KUPmEXfXNCoS2ZRNnuBrZ-Y1YCR5tX5rk5BgVTguhiE";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
