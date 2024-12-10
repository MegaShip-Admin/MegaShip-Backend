import { app, supabase, getData, createCommon } from "../index.js";

/**
 * Actualiza un registro en una tabla específica de Supabase.
 * @param {string} id - ID del registro a actualizar.
 * @param {Object} body - Datos para actualizar.
 * @param {string} tableName - Nombre de la tabla.
 * @returns {Array|null|string} - Datos actualizados, `null` o un mensaje de error.
 */
async function updateData(id, body, tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update({ ...body })
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error updating data in ${tableName} with ID ${id}:`, error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`Unexpected error updating data in ${tableName}:`, err);
    return "Unexpected error occurred.";
  }
}

/**
 * Crea una nueva variable en la tabla `Variable`.
 * @param {string} id - ID del registro común asociado.
 * @param {Object} body - Datos de la nueva variable.
 * @returns {Array|null|string} - Datos creados, `null` o un mensaje de error.
 */
async function createVariable(id, body) {
  try {
    const { data, error } = await supabase
      .from('Variable')
      .insert({ id, ...body })
      .select();

    if (error) {
      console.error("Error creating Variable:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in createVariable:", err);
    return "Unexpected error occurred.";
  }
}

// Endpoints

// GET /variables: Obtiene todas las variables.
app.get("/variables", async (req, res) => {
  try {
    const data = await getData('Variable');
    res.json(data);
  } catch (err) {
    console.error("Error fetching variables:", err);
    res.status(500).json({ error: "Error fetching variables." });
  }
});

// PATCH /vendedor/:id: Actualiza datos de un vendedor.
app.patch('/vendedor/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const data = await updateData(id, body, 'Vendedor');
    if (!data) {
      res.status(404).json({ error: "Vendedor no encontrado." });
    } else {
      res.json(data);
    }
  } catch (err) {
    console.error("Error updating vendedor:", err);
    res.status(500).json({ error: "Error updating vendedor." });
  }
});

// POST /variables: Crea una nueva variable.
app.post("/variables", async (req, res) => {
  const body = req.body;

  try {
    const id = await createCommon();
    if (!id) {
      throw new Error("Error creating common record.");
    }

    const data = await createVariable(id, body);
    res.json(data);
  } catch (err) {
    console.error("Error creating variable:", err);
    res.status(500).json({ error: "Error creating variable." });
  }
});

// PATCH /variables/:id: Actualiza una variable existente.
app.patch('/variables/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const data = await updateData(id, body, 'Variable');
    if (!data) {
      res.status(404).json({ error: "Variable no encontrada." });
    } else {
      res.json(data);
    }
  } catch (err) {
    console.error("Error updating variable:", err);
    res.status(500).json({ error: "Error updating variable." });
  }
});

// PATCH /vendedor/password/:id: Actualiza la contraseña de un vendedor.
app.patch('/vendedor/password/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const data = await updateData(id, body, 'Vendedor');
    if (!data) {
      res.status(404).json({ error: "Vendedor no encontrado." });
    } else {
      res.json(data);
    }
  } catch (err) {
    console.error("Error updating vendedor password:", err);
    res.status(500).json({ error: "Error updating vendedor password." });
  }
});
