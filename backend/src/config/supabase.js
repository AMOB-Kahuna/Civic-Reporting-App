import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

console.log("supabaseUrl: " + supabaseUrl)

if (!supabaseUrl) console.log("Warning: SUPABASE_URL is missing in env");

export const supabase = createClient(supabaseUrl || '', supabasePublishableKey || '');
