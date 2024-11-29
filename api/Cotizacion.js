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
  return (Object.values(data[0]))
  } catch {
    return ("exploto we")
  }
}

async function createTrabajo(id, body) {
  try {
  const { data, error } = await supabase
    .from('Trabajo')
    .insert({ "id": id, ...body })
    .select()
  return (id)
  } catch {
    return ("explote yo amigo mishel")
  }
}

app.get("/trabajos", (req, res) => {
  res.send(data);
});

app.post("/trabajos", async (req, res) => {
  const body = req.body
  try {
    const id = await createCommon()
    let trueid = 1
    for (let x of id) {
      trueid = x
    }
    ///const data = await createTrabajo(trueid, body)
    res.send(trueid)
  } catch {
    res.send("no we")
  }
}
)