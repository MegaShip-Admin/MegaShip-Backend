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

async function updateData(id, body, tableName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .update({ ...body })
            .eq('id', id)
            .select()
        return (data)
    } catch {
        return ("hola soy mister error jejej")
    }
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

  async function createVariable(id, body) {
    try {
        const { data, error } = await supabase
            .from('Variable')
            .insert({ id, ...body })
            .select()
        return (data)
    } catch {
        return (error)
    }
}

app.get("/variables", async (req, res) => {
    const data = await getData('Variable');
    res.json(data);
});

app.patch('/vendedor/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try {
        const data = await updateData(id, body, 'Vendedor')
        res.json(data)
    } catch {
        res.send("A ocurrido un error en la modificacion")
    }
})

app.post("/variables", async (req, res) => {
    const body = req.body;
    try {
    const id = await createCommon();
    const data = await createVariable(id, body)
    res.json(data);
    } catch {
        res.json("error")
    }
});

app.patch('/variables/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try {
        const data = await updateData(id, body, 'Variable')
        res.json(data)
    } catch {
        res.send("A ocurrido un error en la modificacion")
    }
})

app.patch('/password/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try {
        const data = await updateData(id, body, 'Vendedor')
        res.json(data)
    } catch {
        res.send("A ocurrido un error en la modificacion")
    }
})
