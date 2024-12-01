import { app, supabase } from "../index.js";

async function getTrabajo() {
  const { data, error } = await supabase
    .from('Trabajo')
    .select()
  return (data)
}

async function getVariables() {
  const { data, error } = await supabase
    .from('Variable')
    .select()
  return (data)
}

async function getDeposito() {
  const { data, error } = await supabase
    .from('Deposito')
    .select()
  return (data)
}

async function getServicios() {
  const { data, error } = await supabase
    .from('Servicio')
    .select()
  return (data)
}

async function getLocalidad() {
  const { data, error } = await supabase
    .from('Localizacion')
    .select()
  return (data)
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

async function createTrabajo(id, body) {
  try {
    const { data, error } = await supabase
      .from('Trabajo')
      .insert({ id, ...body })
      .select()
    return (data)
  } catch {
    return ("exploto we")
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
    .update({...bodyWithoutId})
    .eq('id', id)
    .select()
  return (data)
  } catch {
    return ("hola soy mister error jejej")
  }
}

app.get("/trabajos", async (req, res) => {
  const data = await getTrabajo();
  res.json(data);
});

app.get("/variables", async (req, res) => {
  const data = await getVariables();
  res.json(data);
});

app.get("/deposito", async (req, res) => {
  const data = await getDeposito();
  res.json(data);
});

app.get("/servicios", async (req, res) => {
  const data = await getServicios();
  res.json(data);
});

app.get("/localidad", async (req, res) => {
  const data = await getLocalidad();
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