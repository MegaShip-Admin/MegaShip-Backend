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

const data = {
  "importacion" : true,
  "medio" : "Maritimo",
  "consolidado" : null,
  "exclusivo" : [
    {
      "Tipo" : "Dry",
      "cantidad" : 2,
      "size" : "20 ft"
    },
    {
      "Tipo" : "Dry",
      "cantidad" : 2,
      "size" : "20 ft"
    },
    {
      "Tipo" : "Dry",
      "cantidad" : 2,
      "size" : "20 ft"
    }
  ],
  "empresa" : "MishiCorp",
  "nombre" : "Mishel Tomas",
  "email" : "mishi@gmail.com",
  "telefono" : "090909090",
  "origen" : "Shangai",
  "destino" : "Montevideo",
  "incoterm" : "FCA",
  "un" : null,
  "gastos_origen" : 95.00,
  "tarifa" : 95.00,
  "serv_admin" : 95.00,
  "handling" : 95.00,
  "deposito" : 95.00,
  "unif_factura" : 0.00,
  "txl" : 0.00,
  "seguro" : 0.00,
  "servicio" : "Directo",
  "tt" : 60,
  "validez_ini" : "20/12/24",
  "validez_fin" : "26/12/24",
  "deposito_local" : "TCL",
  "salida" : 0
}

app.get("/pdf", (req, res) => {
  const body = req.body;
  const getFileName = (data) => {
    const empresa = data.empresa.charAt(0).toUpperCase();
    const nombre = data.nombre.charAt(0).toUpperCase();
    const origen = data.origen.charAt(0).toUpperCase();
    const destino = data.destino.charAt(0).toUpperCase();
    const ultimaFecha = data.validez_fin.replace(/\//g, "-"); // Quitar las barras de la fecha
    const incoterm = data.incoterm.toUpperCase();

    return `${empresa}${nombre}${origen}${destino}${ultimaFecha}${incoterm}.pdf`;
  };

  const fileName = getFileName(data);

  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${fileName}`,
  });

  buildPDF(data, (chunk) => stream.write(chunk), () => stream.end());
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
