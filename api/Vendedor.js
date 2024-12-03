import { app, supabase } from "../index.js";

async function getVendedor() {
    const { data, error } = await supabase
        .from('Vendedor')
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
        return (error)
    }
}

async function createVendedor(id, body) {
    try {
        const { data, error } = await supabase
            .from('Vendedor')
            .insert({ id, ...body })
            .select()
        return (data)
    } catch {
        return (error)
    }
}

app.get("/vendedor", async (req, res) => {
    const data = await getVendedor();
    res.send(data);
});

app.post("/vendedor", async (req, res) => {
    const body = req.body
    try {
        const id = await createCommon()
        const data = await createVendedor(id, body)
        res.json(data)
    } catch {
        res.send("A ocurrido un error")
    }
})