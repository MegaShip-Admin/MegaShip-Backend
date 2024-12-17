import express from "express";
import bodyParser from "body-parser";
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { buildPDF } from "./libs/functions.js";

// Configuración de Supabase
const supabaseUrl = 'https://cyfllxdbwhsnlymltmjk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.error("Error: SUPABASE_KEY no está configurada en las variables de entorno.");
  process.exit(1); // Detener la ejecución si no se encuentra la clave.
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de Express
export const app = express();
app.use(bodyParser.json()); // Prefijo de rutas

const datai = {
  "id" : 7,
  "gastos_origen" : 250,
  "tarifa" : 25,
  "serv_admin" : 20,
  "handling" : 102,
  "deposito" : 24,
  "unif_factura" : 102,
  "tlx" : 104,
  "seguro" : 42,
  "deposito_local" : 12,
  "salida_depo" : 200
  }
const datat = {
  "id" : 7,
  "origen" : 18,
  "destino" : 17,
  "validez_ini" : "20/12/24",
  "validez_fin" : "26/12/24",
  "cliente" : 10,
  "incoterm" : 2,
  "medio" : 3,
  "costo" : 250,
  "Servicio" : 6,
  "tt" : 20,
  "Vendedor" : null,
  "consolidado" : null,
  "exclusivo" : null
}
const data = { "trabajo" : datat, "importacion" : datai}

app.get("/pdf", (req, res) => {
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=recibo.pdf",
  });

  buildPDF(data, (chunk) => stream.write(chunk), () => stream.end());
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
