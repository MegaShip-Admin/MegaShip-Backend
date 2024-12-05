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


  async function createTrabajo(id, body) {
    try {
      const { data, error } = await supabase
        .from('Trabajo')
        .insert({
          id, "origen": body["origen"],
          "destino": body["destino"],
          "validez_ini": body["validez_ini"],
          "validez_fin": body["validez_fin"],
          "cliente": body["cliente"], "incoterm": body["incoterm"],
          "medio": body["medio"], "costo": body["costo"],
          "Servicio": body["Servicio"], "tt": body["tt"]
        })
        .select()
      return (data)
    } catch {
      return ("exploto we")
    }
  }
  
  async function createImportacion(id, body) {
    try {
      const { data, error } = await supabase
        .from('Importacion')
        .insert({
          id, "exclusivo": body["exclusivo"], "consolidado": body["consolidado"],
          "gastos_origen": body["gastos_origen"], "tarifa": body["tarifa"],
          "serv_admin": body["serv_admin"], "handling": body["handling"],
          "deposito": body["deposito"], "unif_factura": body["unif_factura"],
          "tlx": body["tlx"], "seguro": body["seguro"],
          "deposito_local": body["deposito_local"], "salida_depo": body["salida_depo"]
        })
        .select()
      return (data)
    } catch {
      return("importacion exploto!!")
    }
  }

  async function createExportacion(id, body) {
    try {
      const { data, error } = await supabase
        .from('Exportacion')
        .insert({
          id, "goec": body["goec"], "trasint": body["trasint"],
          "gitp": body["gitp"], "gam": body["gam"],
          "cc": body["cc"], "flete": body["flete"],
        })
        .select()
      return (data)
    } catch {
      return ("Exportacion exploto!!")
    }
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
  
  // POST api/trabajos/:id: Duplica una cotizacion
  app.post("/trabajos/:id", async (req, res) => {
    const body = req.body
  try {
    const id = await createCommon()
    const datat = await createTrabajo(id, body)
    if (body["importacion"] == true) {
        const datai = await createImportacion(id, body)
        const data = {"trabajo" :datat, "importacion" :datai}
    } else {
        const datae = await createExportacion(id, body)
        const data = {"trabajo" :datat, "exportacion" :datae}
    }
    res.json(data)
  } catch {
    res.send("no we")
  }
  })