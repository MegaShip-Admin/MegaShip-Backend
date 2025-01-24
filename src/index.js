import express from "express";
import bodyParser from "body-parser";
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { buildPDF, getData, createCommon, createTrabajo, createImportacion, createExportacion, createTable, createExclusivo,
    updateTrabajo, getDataByEmail, updateData, createVariable, createVendedor, updateVendedor, getVendedores, deleteExclusivo } from "./libs/functions.js";

// Configuración de Supabase
const supabaseUrl = 'https://cyfllxdbwhsnlymltmjk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.error("Error: SUPABASE_KEY no está configurada en las variables de entorno.");
  process.exit(1); // Detener la ejecución si no se encuentra la clave.
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de Express
export const app = express();
app.use(bodyParser.json()); // Prefijo de rutas

const pdf = {
  "importacion" : true,
  "medio" : "Maritimo",
  "consolidado" : null,
  "exclusivo" : [
    {
      "Tipo" : "Dry",
      "cantidad" : 2,
      "size" : "20 ft"
    },
    {
      "Tipo" : "Dry",
      "cantidad" : 2,
      "size" : "20 ft"
    },
    {
      "Tipo" : "Dry",
      "cantidad" : 2,
      "size" : "20 ft"
    }
  ],
  "empresa" : "MishiCorp",
  "nombre" : "Mishel Tomas",
  "email" : "mishi@gmail.com",
  "telefono" : "090909090",
  "origen" : "Shangai",
  "destino" : "Montevideo",
  "incoterm" : "FCA",
  "un" : null,
  "gastos_origen" : 95.00,
  "tarifa" : 95.00,
  "serv_admin" : 95.00,
  "handling" : 95.00,
  "deposito" : 95.00,
  "unif_factura" : 0.00,
  "txl" : 0.00,
  "seguro" : 0.00,
  "servicio" : "Directo",
  "tt" : 60,
  "validez_ini" : "20/12/24",
  "validez_fin" : "26/12/24",
  "deposito_local" : "TCL",
  "salida" : 0
}

app.get("/pdf", (req, res) => {
    const body = req.body;

    if (!body || !body.empresa || !body.nombre || !body.origen || !body.destino || !body.validez_fin || !body.incoterm) {
        return res.status(400).send("Datos incompletos para generar el PDF.");
    }

    const getFileName = (data) => {
        const empresa = data.empresa.charAt(0).toUpperCase();
        const nombre = data.nombre.charAt(0).toUpperCase();
        const origen = data.origen.charAt(0).toUpperCase();
        const destino = data.destino.charAt(0).toUpperCase();
        const ultimaFecha = data.validez_fin.replace(/\//g, "-");
        const incoterm = data.incoterm.toUpperCase();

        return `${empresa}${nombre}${origen}${destino}${ultimaFecha}${incoterm}.pdf`;
    };

    const fileName = getFileName(body);

    try {
        const stream = res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${fileName}`,
        });

        buildPDF(body, (data) => stream.write(data), () => stream.end());
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("Error al generar el PDF.");
    }
});

app.get("/trabajos", async (req, res) => {
    try {
        const data = await getData('Trabajo');

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron registros en trabajos." });
        }

        res.json(data);
    } catch (err) {
        console.error("Error fetching trabajo:", err);
        res.status(500).json({ error: "Error al obtener trabajo." });
    }
  });

app.get("/incoterms", async (req, res) => {
    try {
        const data = await getData('Incoterms');

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron registros en incoterms." });
        }

        res.json(data);
    } catch (err) {
        console.error("Error fetching incoterms:", err);
        res.status(500).json({ error: "Error al obtener incoterms." });
    }
});

app.get("/clientes", async (req, res) => {
    try {
        const data = await getData('Cliente');

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron registros en clientes." });
        }

        res.json(data);
    } catch (err) {
        console.error("Error fetching clientes:", err);
        res.status(500).json({ error: "Error al obtener clientes." });
    }
  });

app.post("/variables/:clase", async (req, res) => {
    try {
        const { clase } = req.params; // Nombre de la tabla (clase).
        const body = req.body; // Datos para el nuevo registro.

        // Verifica si el nombre de la tabla es válido.
        if (!clase || typeof clase !== 'string') {
            return res.status(400).json({ error: "Clase no válida." });
        }

        // Crea un registro en la tabla Common y obtiene el ID asociado.
        const id = await createCommon();

        // Verifica si no se pudo generar el ID.
        if (!id) {
            return res.status(500).json({ error: "Error al crear el registro común." });
        }

        // Llama a una función genérica para crear un registro en la tabla específica.
        const result = await createTable(clase, id, body);

        // Verifica si hubo algún error al crear el registro en la tabla específica.
        if (!result) {
            return res.status(500).json({ error: `Error al crear el registro en la tabla ${clase}.` });
        }

        // Devuelve la respuesta exitosa con los datos creados.
        return res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.error("Error en la ruta /variables/:clase:", err);
        return res.status(500).json({ error: "Error inesperado." });
    }
});

app.get("/deposito", async (req, res) => {
    try {
        const data = await getData('Deposito');

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron registros en depósito." });
        }

        res.json(data);
    } catch (err) {
        console.error("Error fetching deposito:", err);
        res.status(500).json({ error: "Error al obtener depósito." });
    }
});

app.get("/servicios", async (req, res) => {
    try {
        const data = await getData('Servicio');

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron servicios." });
        }

        res.json(data);
    } catch (err) {
        console.error("Error fetching servicios:", err);
        res.status(500).json({ error: "Error al obtener servicios." });
    }
});

app.get("/localidad", async (req, res) => {
    try {
        const data = await getData('Localizacion');

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron localidades." });
        }

        res.json(data);
    } catch (err) {
        console.error("Error fetching localidad:", err);
        res.status(500).json({ error: "Error al obtener localidad." });
    }
});

app.post("/trabajos", async (req, res) => {
    const body = req.body;

    // Validar datos del cuerpo de la solicitud
    if (!body || !body.nombre || !body.tipo) {
        return res.status(400).json({ error: "Datos incompletos o inválidos." });
    }

    try {
        // Crear registro en Common
        const id = await createCommon();
        if (!id) {
            return res.status(500).json({ error: "No se pudo crear el registro en Common." });
        }

        // Crear trabajo
        const datat = await createTrabajo(id, body);

        // Manejar importación o exportación
        let dataProceso;
        if (body.importacion) {
            dataProceso = await createImportacion(id, body);
        } else {
            dataProceso = await createExportacion(id, body);
        }

        // Responder con una estructura consistente
        res.json({
            success: true,
            trabajo: datat,
            proceso: dataProceso,
            tipo: body.importacion ? "importacion" : "exportacion",
        });
    } catch (err) {
        console.error("Error duplicating cotizacion:", err);
        res.status(500).json({ error: "Error al duplicar la cotización." });
    }
});

// Ruta PUT para actualizar un trabajo
app.put("/trabajos", async (req, res) => {
    const body = req.body;

    // Validar datos del cuerpo de la solicitud
    if (!body || !body.id || Object.keys(body).length === 1) {
        return res.status(400).json({ error: "Datos incompletos o inválidos." });
    }

    try {
        // Actualizar el trabajo
        const data = await updateTrabajo(body);

        // Verificar si la actualización fue exitosa
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Trabajo no encontrado." });
        }

        // Responder con los datos actualizados
        res.json({
            success: true,
            message: "Trabajo actualizado con éxito.",
            data,
        });
    } catch (err) {
        console.error("Error updating trabajo:", err);

        // Diferenciar errores internos de otros posibles errores
        if (err.message.includes("validation") || err.message.includes("syntax")) {
            return res.status(400).json({ error: "Datos inválidos." });
        }

        res.status(500).json({ error: "Error al actualizar trabajo." });
    }
});

// POST /vendedor: Autentica un vendedor basado en email y contraseña.
app.post("/vendedor/:email", async (req, res) => {
    const { email, password } = req.body; // Desestructuración para mayor claridad.
  
    if (!email || !password) {
      // Verifica si los campos necesarios están presentes.
      return res.status(400).json({ error: "Email y contraseña son requeridos." });
    }
  
    try {
      const vendedor = await getDataByEmail('Vendedor', email);
  
      if (!vendedor) {
        // Retorna un 404 si no se encuentra el vendedor.
        return res.status(404).json({ error: "Vendedor no encontrado." });
      }
  
      if (vendedor.password !== password) {
        // Manejo de autenticación fallida.
        return res.status(401).json({ error: "La contraseña no es correcta." });
      }
  
      // Autenticación exitosa, devuelve los datos del vendedor.
      res.json(vendedor);
    } catch (err) {
      // Manejo de errores inesperados durante la ejecución del endpoint.
      console.error("Error handling /vendedor request:", err);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  });

// GET /variables: Obtiene todas las variables.
app.get("/variables", async (req, res) => {
    try {
        // Llama a la función para obtener los datos de la tabla 'Variable'
        const data = await getData('Variable');

        if (!data || data.length === 0) {
            // Si no se encuentran datos, responde con un estado 404
            return res.status(404).json({ message: "No se encontraron variables." });
        }

        // Responde con los datos obtenidos
        res.status(200).json(data);
    } catch (err) {
        // Manejo de errores inesperados
        console.error("Error al obtener variables:", err);
        res.status(500).json({ error: "Error interno del servidor al obtener variables." });
    }
});

// PATCH /vendedor/:id: Actualiza un vendedor por ID.
app.patch('/vendedor/:id', async (req, res) => {
    const { id } = req.params; // ID del vendedor a actualizar.
    const body = req.body; // Datos para la actualización.

    // Validación básica del ID y el cuerpo de la solicitud.
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: "El cuerpo de la solicitud está vacío." });
    }

    try {
        // Llama a la función para actualizar los datos del vendedor.
        const data = await updateData(id, body, 'Vendedor');

        if (!data || data.length === 0) {
            // Si no se encuentra el vendedor, responde con un código 404.
            return res.status(404).json({ error: "Vendedor no encontrado." });
        }

        // Responde con los datos actualizados.
        res.status(200).json(data);
    } catch (err) {
        // Manejo de errores inesperados.
        console.error("Error al actualizar vendedor:", err);
        res.status(500).json({ error: "Error interno del servidor al actualizar vendedor." });
    }
});

// POST /variables: Crea una nueva variable.
app.post("/variables", async (req, res) => {
    const body = req.body; // Datos proporcionados en el cuerpo de la solicitud.

    // Validación básica del cuerpo de la solicitud.
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: "El cuerpo de la solicitud está vacío." });
    }

    try {
        // Crea un registro común y obtiene su ID.
        const id = await createCommon();
        if (!id) {
            throw new Error("No se pudo crear el registro común.");
        }

        // Usa el ID para crear la nueva variable.
        const data = await createVariable(id, body);

        if (!data || data.length === 0) {
            return res.status(500).json({ error: "No se pudo crear la variable." });
        }

        // Devuelve la variable creada.
        res.status(201).json(data);
    } catch (err) {
        // Manejo de errores inesperados.
        console.error("Error al crear variable:", err);
        res.status(500).json({ error: "Error interno del servidor al crear variable." });
    }
});

// PATCH /variables/:id: Actualiza una variable existente.
app.patch('/variables/:id', async (req, res) => {
    const { id } = req.params; // ID de la variable a actualizar.
    const body = req.body; // Datos actualizados.

    // Validación del cuerpo de la solicitud.
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: "El cuerpo de la solicitud está vacío." });
    }

    try {
        // Actualiza los datos de la variable en la base de datos.
        const data = await updateData(id, body, 'Variable');
        
        // Si no se encuentra la variable, devuelve un error 404.
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Variable no encontrada." });
        }

        // Devuelve los datos actualizados.
        res.json(data);
    } catch (err) {
        // Manejo de errores inesperados.
        console.error("Error al actualizar variable:", err);
        res.status(500).json({ error: "Error interno del servidor al actualizar variable." });
    }
});

// PATCH /vendedor/password/:id: Actualiza la contraseña de un vendedor.
app.patch('/vendedor/password/:id', async (req, res) => {
    const { id } = req.params; // ID del vendedor.
    const { password } = req.body; // Nueva contraseña.

    // Validación del cuerpo de la solicitud.
    if (!password || password.trim() === "") {
        return res.status(400).json({ error: "La contraseña es requerida y no puede estar vacía." });
    }

    try {
        // Actualiza la contraseña del vendedor en la base de datos.
        const data = await updateData(id, { password }, 'Vendedor');

        // Si no se encuentra el vendedor, devuelve un error 404.
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Vendedor no encontrado." });
        }

        // Devuelve los datos actualizados (sin exponer la contraseña).
        res.json({ message: "Contraseña actualizada exitosamente." });
    } catch (err) {
        // Manejo de errores inesperados.
        console.error("Error al actualizar la contraseña del vendedor:", err);
        res.status(500).json({ error: "Error interno del servidor al actualizar la contraseña." });
    }
});

// GET /vendedor: Obtiene todos los vendedores.
app.get("/vendedor", async (req, res) => {
    try {
        // Llama a la función para obtener los vendedores.
        const data = await getVendedores();

        // Verifica si no se obtuvieron datos.
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron vendedores." });
        }

        // Devuelve la lista de vendedores.
        res.json(data);
    } catch (err) {
        // Manejo de errores inesperados.
        console.error("Error al obtener vendedores:", err);
        res.status(500).json({ error: "Error interno del servidor al obtener vendedores." });
    }
});

// POST /vendedor: Crea un nuevo vendedor.
app.post("/vendedor", async (req, res) => {
    const body = req.body;

    try {
        // Crea un registro en la tabla Common y obtiene el ID.
        const id = await createCommon();

        // Verifica si no se pudo generar el ID.
        if (!id) {
            return res.status(500).json({ error: "Error al crear el registro común." });
        }

        // Crea el vendedor con el ID generado y los datos proporcionados.
        const data = await createVendedor(id, body);

        // Verifica si no se pudo crear el vendedor.
        if (!data || data.length === 0) {
            return res.status(500).json({ error: "Error al crear el vendedor." });
        }

        // Devuelve el nuevo vendedor creado con un código 201.
        res.status(201).json(data);
    } catch (err) {
        // Manejo de errores inesperados.
        console.error("Error al crear vendedor:", err);
        res.status(500).json({ error: "Error interno del servidor al crear vendedor." });
    }
});

// PATCH /vendedor/:id: Actualiza los datos de un vendedor.
app.patch("/vendedor/:id", async (req, res) => {
    const { id } = req.params; // Obtiene el ID del vendedor de los parámetros de la ruta.
    const body = req.body; // Obtiene los datos del cuerpo de la solicitud.

    try {
        // Actualiza los datos del vendedor con el ID proporcionado.
        const data = await updateVendedor(id, body);

        // Verifica si no se encontró o actualizó el vendedor.
        if (!data || Object.keys(data).length === 0) {
            return res.status(404).json({ error: "Vendedor no encontrado o no actualizado." });
        }

        // Responde con los datos actualizados del vendedor.
        res.json(data);
    } catch (err) {
        // Manejo de errores inesperados.
        console.error("Error al actualizar vendedor:", err);
        res.status(500).json({ error: "Error interno del servidor al actualizar vendedor." });
    }
});

// PATCH /vendedor/estado/:id: Actualiza el estado de un vendedor.
app.patch("/vendedor/estado/:id", async (req, res) => {
    const { id } = req.params; // Obtiene el ID del vendedor de los parámetros de la ruta.
    const { estado } = req.body; // Extrae el campo 'estado' del cuerpo de la solicitud.

    if (!estado) {
        // Valida que el campo 'estado' esté presente en el cuerpo de la solicitud.
        return res.status(400).json({ error: "El campo 'estado' es requerido." });
    }

    try {
        // Actualiza el estado del vendedor con el ID proporcionado.
        const data = await updateVendedor(id, { estado });

        // Verifica si no se encontró o actualizó el vendedor.
        if (!data || Object.keys(data).length === 0) {
            return res.status(404).json({ error: "Vendedor no encontrado o no actualizado." });
        }

        // Responde con los datos actualizados del vendedor.
        res.json(data);
    } catch (err) {
        // Manejo de errores inesperados.
        console.error("Error al actualizar el estado del vendedor:", err);
        res.status(500).json({ error: "Error interno del servidor al actualizar el estado del vendedor." });
    }
});

/**
 * Ruta para crear un nuevo registro en la tabla 'Exclusivo'.
 * @route POST /exclusivo
 * @param {object} req.body - Datos del nuevo registro.
 * @returns {object} - Datos creados o mensaje de error.
 */
app.post("/exclusivo", async (req, res) => {
    const body = req.body;
    try {
        const id = await createCommon(); // Crea un registro común y obtiene el ID.
        const data = await createExclusivo(id, body); // Crea el registro en la tabla 'Exclusivo'.
        res.json(data); // Devuelve los datos creados.
    } catch (err) {
        console.error("Error in POST /exclusivo:", err);
        res.status(500).send("Error al crear el registro.");
    }
});

/**
 * Ruta para eliminar un registro de la tabla 'Exclusivo' por ID.
 * @route DELETE /exclusivo/:id
 * @param {string} req.params.id - ID del registro a eliminar.
 * @returns {object} - Datos eliminados o mensaje de error.
 */
app.delete("/exclusivo/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await deleteExclusivo(id); // Elimina el registro con el ID proporcionado.
        res.json(data); // Devuelve los datos eliminados.
    } catch (err) {
        console.error("Error in DELETE /exclusivo/:id:", err);
        res.status(500).send("Error al eliminar el registro.");
    }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
