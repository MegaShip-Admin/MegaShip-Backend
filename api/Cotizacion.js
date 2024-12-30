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

async function createCommon() {
  try {
    const { data, error } = await supabase
      .from('Common')
      .insert({})
      .select("id")
    return (data[0].id)
  } catch {
    return ("exploto we")
  }
}

async function createExclusivo(id, body) {
  try {
    const { data, error } = await supabase
      .from('Exclusivo')
      .insert({id, ...body})
      .select()
      return(data)
  } catch {
    return ("error")
  }
}

async function deleteExclusivo(id) {
  try {
    const { data, error } = await supabase
      .from('Exclusivo')
      .delete()
      .eq('id', id)
      .select()
      return(data)
  } catch {
    return ("error")
  }
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
    return ("importacion exploto!!")
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


async function updateTrabajo(body) {
  let bodyWithoutId = {}
  let id = null
  try {
    for (let i in body) {
      if (i == "id") {
        id = body[i]
      } else {
        bodyWithoutId[i] = body[i]
      }
    }
    const { data, error } = await supabase
      .from('Trabajo')
      .update({ ...bodyWithoutId })
      .eq('id', id)
      .select()
    return (data)
  } catch {
    return ("hola soy mister error jejej")
  }
}

app.get("/trabajos", async (req, res) => {
  const data = await getData('Trabajo');
  res.json(data);
});

app.get("/variables", async (req, res) => {
  const data = await getData('Variable');
  res.json(data);
});

app.get("/deposito", async (req, res) => {
  const data = await getData('Deposito');
  res.json(data);
});

app.get("/servicios", async (req, res) => {
  const data = await getData('Servicio');
  res.json(data);
});

app.get("/localidad", async (req, res) => {
  const data = await getData('Localizacion');
  res.send(data);
});

app.post("/trabajos", async (req, res) => {
  const body = req.body
  try {
    const id = await createCommon()
    const data = await createTrabajo(id, body)
    res.json(data)
  } catch {
    res.send("no we")
  }
})

app.put("/trabajos", async (req, res) => {
  const body = req.body
  try {
    const data = await updateTrabajo(body)
    res.json(data)
  } catch {
    res.send("hola soy error")
  }
})

app.post("/trabajos/importacion", async (req, res) => {
  const body = req.body
  try {
    const id = await createCommon()
    const datat = await createTrabajo(id, body)
    const datai = await createImportacion(id, body)
    const data = { "trabajo": datat, "importacion": datai }
    res.json(data)
  } catch {
    res.send("no we")
  }
})


app.post("/trabajos/exportacion", async (req, res) => {
  const body = req.body
  try {
    const id = await createCommon()
    const datat = await createTrabajo(id, body)
    const datai = await createExportacion(id, body)
    const data = { "trabajo": datat, "Exportacion": datai }
    res.json(data)
  } catch {
    res.send("no we")
  }
})

app.post("/exclusivo", async (req, res) => {
  const body = req.body
  try {
    const id = await createCommon()
    const data = await createExclusivo(id, body)
    res.json(data)
  } catch {
    res.send("hola soy error")
  }
})

app.delete("/exclusivo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteExclusivo(id)
    res.json(data)
  } catch {
    res.send("hola soy error")
  }
})