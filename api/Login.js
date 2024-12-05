import { app, supabase } from "../index.js";

async function getDataByEmail(tableName, email) {
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .eq('email', email); // Filtra por la columna `id`
  
    if (error) {
      console.error(`Error fetching data from ${tableName} with Email ${email}:`, error);
      return null; // Manejar el error como prefieras
    }
    return data?.[0] || null; // Retorna el primer elemento o null si no hay datos
  } 

    // GET api/vendedores/:email: Trae una cotización por Email
app.post("/vendedor/", async (req, res) => {
    const body = req.body
    const data = await getDataById('Vendedor', body["email"]);
  
    if (!data) {
      return res.status(404).json({ error: "Vendedor no encontrado" }); // Manejo de error si no se encuentra
    }
    if (data["password"] != body["password"]) {
        return res.status(14).json({ error: "La contraseña no es la correcta" })
    }
  
    res.json(data);
  });