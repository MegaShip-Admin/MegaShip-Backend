import { app, supabase, getData, createCommon } from "../index.js";

/**
 * Crea un nuevo vendedor con el ID y datos proporcionados.
 * @param {number} id - ID del vendedor.
 * @param {object} body - Datos del vendedor.
 * @returns {object|string} - Datos creados o mensaje de error.
 */
async function createVendedor(id, body) {
  try {
    const { data, error } = await supabase
      .from('Vendedor')
      .insert({ id, ...body })
      .select();

    if (error) {
      console.error("Error creating Vendedor:", error);
      return error.message;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in createVendedor:", err);
    return "Error inesperado al crear Vendedor.";
  }
}

/**
 * Actualiza los datos de un vendedor por ID.
 * @param {number} id - ID del vendedor a actualizar.
 * @param {object} body - Nuevos datos del vendedor.
 * @returns {object|string} - Datos actualizados o mensaje de error.
 */
async function updateVendedor(id, body) {
  try {
    const { data, error } = await supabase
      .from('Vendedor')
      .update(body)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating Vendedor:", error);
      return error.message;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in updateVendedor:", err);
    return "Error inesperado al actualizar Vendedor.";
  }
}

/**
 * Obtiene todos los vendedores excluyendo el campo "password".
 * @returns {object[]|null} - Lista de vendedores o null en caso de error.
 */
async function getVendedores() {
  try {
    const { data, error } = await supabase
      .from('Vendedor')
      .select('id, name, email, phone, estado'); // Especifica las columnas que deseas recuperar.

    if (error) {
      console.error("Error fetching vendedores:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error fetching vendedores:", err);
    return null;
  }
}

// Ruta GET: Obtiene todos los vendedores sin incluir el atributo "password".
app.get("/vendedor", async (req, res) => {
  try {
    const data = await getVendedores();
    if (!data) {
      return res.status(500).json({ error: "No se pudieron obtener los vendedores." });
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching vendedores:", err);
    res.status(500).json({ error: "Error al obtener vendedores." });
  }
});

// Ruta POST: Crea un nuevo vendedor.
app.post("/vendedor", async (req, res) => {
  const body = req.body;
  try {
    const id = await createCommon();
    if (!id) {
      return res.status(500).json({ error: "No se pudo crear el registro en Common." });
    }

    const data = await createVendedor(id, body);
    if (!data) {
      return res.status(500).json({ error: "Error al crear vendedor." });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating vendedor:", err);
    res.status(500).json({ error: "Error al crear vendedor." });
  }
});

// Ruta PATCH: Actualiza los datos de un vendedor.
app.patch("/vendedor/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const data = await updateVendedor(id, body);
    if (!data) {
      return res.status(404).json({ error: "Vendedor no encontrado o no actualizado." });
    }
    res.json(data);
  } catch (err) {
    console.error("Error updating vendedor:", err);
    res.status(500).json({ error: "Error al actualizar vendedor." });
  }
});

// Ruta PATCH: Actualiza el estado de un vendedor.
app.patch("/vendedor/estado/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const data = await updateVendedor(id, body);
    if (!data) {
      return res.status(404).json({ error: "Vendedor no encontrado o no actualizado." });
    }
    res.json(data);
  } catch (err) {
    console.error("Error updating vendedor estado:", err);
    res.status(500).json({ error: "Error al actualizar el estado del vendedor." });
  }
});
