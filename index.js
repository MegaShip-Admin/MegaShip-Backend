import express from "express";
import bodyParser from "body-parser";
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cyfllxdbwhsnlymltmjk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
