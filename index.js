import express from "express";
import bodyParser from "body-parser";
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cyfllxdbwhsnlymltmjk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(bodyParser.json());

async function fetchData() {
    try {
        const { data: Cliente, error } = await supabase
            .from('Cliente')
            .select();

        if (error) {
            console.error("Error fetching data:", error);
            return;
        }

        if (Cliente) {
            console.log("Clientes:", Cliente);
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

// Llama a fetchData para verificar la conexión y los datos
fetchData();

app.get("/", (req, res) => {
    res.send("hola!");
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
