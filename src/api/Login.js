import { app, supabase } from "../index.js";

/**
 * Obtiene datos de una tabla de Supabase filtrando por correo electrónico.
 * @param {string} tableName - Nombre de la tabla en Supabase.
 * @param {string} email - Correo electrónico a buscar.
 * @returns {object|null} - Devuelve el primer registro encontrado o null si no hay datos.
 */
async function getDataByEmail(tableName, email) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .eq('email', email); // Filtra por la columna `email`.

    if (error) {
      console.error(`Error fetching data from ${tableName} with Email ${email}:`, error);
      return null; // Manejo de errores.
    }

    return data?.[0] || null; // Retorna el primer elemento o null si no hay datos.
  } catch (err) {
    console.error("Unexpected error fetching data:", err);
    return null; // Manejo de errores inesperados.
  }
}

// POST /vendedor: Autentica un vendedor basado en email y contraseña.
app.post("/vendedor", async (req, res) => {
  const { email, password } = req.body; // Desestructuración para mayor claridad.

  if (!email || !password) {
    // Verifica si los campos necesarios están presentes.
    return res.status(400).json({ error: "Email y contraseña son requeridos." });
  }

  try {
    const vendedor = await getDataByEmail('Vendedor', email);

    if (!vendedor) {
      // Retorna un 404 si no se encuentra el vendedor.
      return res.status(404).json({ error: "Vendedor no encontrado." });
    }

    if (vendedor.password !== password) {
      // Manejo de autenticación fallida.
      return res.status(401).json({ error: "La contraseña no es correcta." });
    }

    // Autenticación exitosa, devuelve los datos del vendedor.
    res.json(vendedor);
  } catch (err) {
    // Manejo de errores inesperados durante la ejecución del endpoint.
    console.error("Error handling /vendedor request:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});
