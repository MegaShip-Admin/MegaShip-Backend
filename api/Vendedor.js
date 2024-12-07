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

async function updateVendedor(body) {
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
            .from('Vendedor')
            .update({ ...bodyWithoutId })
            .eq('id', id)
            .select()
        return (data)
    } catch {
        return ("hola soy mister error jejej")
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


app.patch("/vendedor/{id}", async (req, res) => {
    const body = req.body
    try {
        const data = await updateVendedor(body)
        res.json(data)
    } catch {
        res.send("A ocurrido un error en la modificacion")
    }
})

app.patch("/vendedor/estado/{id}", async (req, res) => {
    const body = req.body
    try {
        const data = await updateVendedor(body)
        res.json(data)
    } catch {
        res.send("A ocurrido un error en la modificacion")
    }
})