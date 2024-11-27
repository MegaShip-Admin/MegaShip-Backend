import { app, supabase } from "../index.js";

const { data, error } = await supabase
  .from('Importacion')
  .select()
  .match()

app.get("/hola", (req, res) => {
    res.send(data);
});
