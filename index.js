import express from "express";
import bodyParser from "body-parser";
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

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
app.use(bodyParser.json());

/**
 * Obtiene todos los registros de una tabla en Supabase.
 * @param {string} tableName - Nombre de la tabla a consultar.
 * @returns {Array|null} - Registros obtenidos o `null` si hay un error.
 */
async function getData(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select();

    if (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`Unexpected error fetching data from ${tableName}:`, err);
    return null;
  }
}

/**
 * Crea un registro vacío en la tabla `Common` y devuelve su ID.
 * @returns {number|string} - ID del registro creado o un mensaje de error.
 */
async function createCommon() {
  try {
    const { data, error } = await supabase
      .from('Common')
      .insert({})
      .select("id");

    if (error) {
      console.error("Error creating Common record:", error);
      return error.message;
    }

    return data?.[0]?.id || null;
  } catch (err) {
    console.error("Unexpected error in createCommon:", err);
    return "Error inesperado al crear Common.";
  }
}

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
