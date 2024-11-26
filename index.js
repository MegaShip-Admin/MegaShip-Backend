import express from "express";
import bodyParser from "body-parser";
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cyfllxdbwhsnlymltmjk.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const app = express();
app.use(bodyParser.json());

try {
    let { data: Cliente, error } = await supabase
        .from('Cliente')
        .select()

    if (Cliente) {
        console.log(Cliente)
    }
} catch {
    console.log(error)
}

app.get("/", (req, res) => {
    res.send("hola!");
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});