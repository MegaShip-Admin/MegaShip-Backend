import { app, supabase, getData, createCommon } from "../index.js";

/**
 * Crea un registro en la tabla `Trabajo`.
 * @param {number} id - ID del trabajo.
 * @param {object} body - Datos del trabajo.
 * @returns {object|string} - Datos creados o mensaje de error.
 */
async function createTrabajo(id, body) {
  try {
    const { data, error } = await supabase
      .from('Trabajo')
      .insert({
        id,
        origen: body.origen,
        destino: body.destino,
        validez_ini: body.validez_ini,
        validez_fin: body.validez_fin,
        cliente: body.cliente,
        incoterm: body.incoterm,
        medio: body.medio,
        costo: body.costo,
        Servicio: body.Servicio,
        tt: body.tt
      })
      .select();

    if (error) {
      console.error("Error creating Trabajo:", error);
      return error.message;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in createTrabajo:", err);
    return "Error inesperado al crear Trabajo.";
  }
}

/**
 * Crea un registro en la tabla `Importacion`.
 * @param {number} id - ID de la importación.
 * @param {object} body - Datos de la importación.
 * @returns {object|string} - Datos creados o mensaje de error.
 */
async function createImportacion(id, body) {
  try {
    const { data, error } = await supabase
      .from('Importacion')
      .insert({
        id,
        exclusivo: body.exclusivo,
        consolidado: body.consolidado,
        gastos_origen: body.gastos_origen,
        tarifa: body.tarifa,
        serv_admin: body.serv_admin,
        handling: body.handling,
        deposito: body.deposito,
        unif_factura: body.unif_factura,
        tlx: body.tlx,
        seguro: body.seguro,
        deposito_local: body.deposito_local,
        salida_depo: body.salida_depo
      })
      .select();

    if (error) {
      console.error("Error creating Importacion:", error);
      return error.message;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in createImportacion:", err);
    return "Error inesperado al crear Importacion.";
  }
}

/**
 * Crea un registro en la tabla `Exportacion`.
 * @param {number} id - ID de la exportación.
 * @param {object} body - Datos de la exportación.
 * @returns {object|string} - Datos creados o mensaje de error.
 */
async function createExportacion(id, body) {
  try {
    const { data, error } = await supabase
      .from('Exportacion')
      .insert({
        id,
        goec: body.goec,
        trasint: body.trasint,
        gitp: body.gitp,
        gam: body.gam,
        cc: body.cc,
        flete: body.flete
      })
      .select();

    if (error) {
      console.error("Error creating Exportacion:", error);
      return error.message;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in createExportacion:", err);
    return "Error inesperado al crear Exportacion.";
  }
}

/**
 * Actualiza un registro en la tabla `Trabajo`.
 * @param {object} body - Datos a actualizar (incluyendo el ID).
 * @returns {object|string} - Datos actualizados o mensaje de error.
 */
async function updateTrabajo(body) {
  const { id, ...bodyWithoutId } = body;

  try {
    const { data, error } = await supabase
      .from('Trabajo')
      .update(bodyWithoutId)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating Trabajo:", error);
      return error.message;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in updateTrabajo:", err);
    return "Error inesperado al actualizar Trabajo.";
  }
}

app.get("/variables", async (req, res) => {
  try {
    const data = await getData('Variable');
    res.json(data);
  } catch (err) {
    console.error("Error fetching variables:", err);
    res.status(500).json({ error: "Error al obtener variables." });
  }
});

app.get("/deposito", async (req, res) => {
  try {
    const data = await getData('Deposito');
    res.json(data);
  } catch (err) {
    console.error("Error fetching deposito:", err);
    res.status(500).json({ error: "Error al obtener depósito." });
  }
});

app.get("/servicios", async (req, res) => {
  try {
    const data = await getData('Servicio');
    res.json(data);
  } catch (err) {
    console.error("Error fetching servicios:", err);
    res.status(500).json({ error: "Error al obtener servicios." });
  }
});

app.get("/localidad", async (req, res) => {
  try {
    const data = await getData('Localizacion');
    res.json(data);
  } catch (err) {
    console.error("Error fetching localidad:", err);
    res.status(500).json({ error: "Error al obtener localidad." });
  }
});

// Ruta POST para duplicar una cotización.
app.post("/trabajos", async (req, res) => {
  const body = req.body;
  try {
    const id = await createCommon();
    if (!id) {
      return res.status(500).json({ error: "No se pudo crear el registro en Common." });
    }

    const datat = await createTrabajo(id, body);

    if (body.importacion) {
      const datai = await createImportacion(id, body);
      return res.json({ trabajo: datat, importacion: datai });
    } else {
      const datae = await createExportacion(id, body);
      return res.json({ trabajo: datat, exportacion: datae });
    }
  } catch (err) {
    console.error("Error duplicating cotizacion:", err);
    res.status(500).json({ error: "Error al duplicar la cotización." });
  }
});

// Ruta PUT para actualizar un trabajo.
app.put("/trabajos", async (req, res) => {
  const body = req.body;
  try {
    const data = await updateTrabajo(body);
    res.json(data);
  } catch (err) {
    console.error("Error updating trabajo:", err);
    res.status(500).json({ error: "Error al actualizar trabajo." });
  }
});
