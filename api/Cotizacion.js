import { app, supabase } from "../index.js";

const { data, error } = await supabase
  .from('Trabajo')
  .select()

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
    .insert({ id, ...body})
    .select()
  return (data)
  } catch {
    return ("exploto we")
  }
}

app.get("/trabajos", (req, res) => {
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
}
)