import { app, supabase } from "../index.js";

async function getData(tableName) {
    const { data, error } = await supabase
      .from(tableName)
      .select();
    
    if (error) {
      console.error("Error fetching data from ${tableName}: ", error);
      return null; // O manejar el error como prefieras
    }
    return data;
  }

  async function getDataById(tableName, id) {
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .eq('id', id); // Filtra por la columna `id`
  
    if (error) {
      console.error(`Error fetching data from ${tableName} with ID ${id}:`, error);
      return null; // Manejar el error como prefieras
    }
    return data?.[0] || null; // Retorna el primer elemento o null si no hay datos
  }  

  // GET api/trabajos/: Trae todas las cotizaciones
  app.get("/trabajos", async (req, res) => {
    const data = await getData('Trabajo');
    res.json(data);
  });

  // GET api/trabajos/:id: Trae una cotización por ID
app.get("/trabajos/:id", async (req, res) => {
    const { id } = req.params; // Obtiene el ID de los parámetros de la URL
    const data = await getDataById('Trabajo', id);
  
    if (!data) {
      return res.status(404).json({ error: "Trabajo no encontrado" }); // Manejo de error si no se encuentra
    }
  
    res.json(data);
  });
  
