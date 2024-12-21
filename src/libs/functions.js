import PDFDocument from "pdfkit-table";

/**
 * Construye un documento PDF basado en los datos proporcionados.
 * @param {object} data - Datos utilizados para construir el PDF.
 * @param {function} dataCallback - Callback para los datos generados.
 * @param {function} endCallback - Callback para el final del proceso.
 */
export function buildPDF(data, dataCallback, endCallback) {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Configurar eventos del documento
    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    // Bandera para controlar la recursividad en pageAdded
    let skipHeaders = false;

    // Agregar encabezado y pie de página en cada página
    doc.on("pageAdded", () => {
        if (!skipHeaders) {
            skipHeaders = true;
            agregarEncabezado(doc);
            agregarPieDePagina(doc);
            skipHeaders = false;
        }
    });

    // Agregar encabezado a la primera página
    agregarEncabezado(doc);

    const pageWidth = doc.page.width;
    const margin = 50;
    const tableWidth = 350;
    const leftMargin = (pageWidth - tableWidth) / 2;

    // Agregar el logo
    doc.image("./src/img/logo.png", 50, 20, { width: 50 });

    // Título principal
    doc.fontSize(16).text("Megaship Soluciones Logísticas", 0, 80, {
        align: "center",
        underline: true,
    });

    // Tabla "Transporte y Tipo"
    const transporteTipo = [
        ["Importación", data.importacion ? "Sí" : "No"],
        ["Medio", data.medio],
        ["Consolidado", data.consolidado ? "Sí" : "No"],
        ["Exclusivo", data.exclusivo ? "Sí" : "No"],
    ];

    agregarTabla(doc, "Transporte y Tipo", transporteTipo, leftMargin);

    // Tabla "Características del Trabajo"
    const caracteristicasTrabajo = [
        ["Empresa", data.empresa],
        ["Nombre", data.nombre],
        ["Teléfono", data.telefono],
        ["Email", data.email],
        ["Origen", data.origen],
        ["Destino", data.destino],
        ["Incoterm", data.incoterm],
    ];

    agregarTabla(doc, "Características del Trabajo", caracteristicasTrabajo, leftMargin);

    // Tabla "Carga Consolidada"
    if (data.consolidado) {
        const cargaConsolidada = [
            ["Piezas", data.consolidado.piezas],
            ["Peso (kg)", data.consolidado.peso],
            ["CBM", data.consolidado.cbm],
        ];
        agregarTabla(doc, "Carga Consolidada", cargaConsolidada, leftMargin);
    }

    // Tabla "Cargas Exclusivas"
    if (data.exclusivo) {
        const cargasExclusivas = data.exclusivo.map((carga) => [
            carga.Tipo,
            `${carga.cantidad} x ${carga.size}`,
        ]);
        agregarTabla(doc, "Cargas Exclusivas", cargasExclusivas, leftMargin);
    }

    // Tabla "Costos"
    const costos = [
        ["Gastos de Origen", formatearMoneda(data.gastos_origen)],
        ["Tarifa", formatearMoneda(data.tarifa)],
        ["Servicios Administrativos", formatearMoneda(data.serv_admin)],
        ["Handling", formatearMoneda(data.handling)],
        ["Depósito", formatearMoneda(data.deposito)],
    ];
    agregarTabla(doc, "Costos", costos, leftMargin);

    const serviciosExtras = [
        ["Unificación de Factura", formatearMoneda(data.unif_factura)],
        ["TXL", formatearMoneda(data.txl)],
        ["Seguro", formatearMoneda(data.seguro)],
    ];
    agregarTabla(doc, "Extras", serviciosExtras, leftMargin);

    // Tabla "Datos del Servicio y Depósito"
    const servicioYDeposito = [
        ["Servicio", data.servicio],
        ["Tiempo de Tránsito", `${data.tt} días`],
        ["Validez Inicial", data.validez_ini],
        ["Validez Final", data.validez_fin],
        ["Depósito Local", data.deposito_local],
        ["Salida", formatearMoneda(data.salida)],
    ];
    agregarTabla(doc, "Datos del Servicio y Depósito", servicioYDeposito, leftMargin);

    // Agregar hipervínculo
    doc.moveDown(2);
    doc.font("Helvetica-Bold")
        .fillColor("blue")
        .text("Visítanos en nuestro sitio web", leftMargin, doc.y, {
            link: "https://megaship.com",
            underline: true,
        });

    doc.end();
}

/**
 * Agrega una tabla al documento PDF con un título.
 * @param {PDFKit.PDFDocument} doc - Documento PDF.
 * @param {string} titulo - Título de la tabla.
 * @param {Array} filas - Datos de la tabla.
 * @param {number} margenIzquierdo - Posición horizontal para centrar la tabla.
 */
function agregarTabla(doc, titulo, filas, margenIzquierdo) {
    doc.moveDown();
    doc.fontSize(12).fillColor("#1433C3").text(titulo, { x: margenIzquierdo, underline: true });
    doc.table(
        { headers: ["Descripción", "Valor"], rows: filas },
        {
            columnsSize: [200, 150],
            x: margenIzquierdo,
            prepareHeader: () => {
                doc.font("Helvetica-Bold").fontSize(11).fillColor("#1433C3");
            },
            prepareRow: (row, i) => {
                doc.font("Helvetica").fontSize(10).fillColor(i % 2 === 0 ? "#000" : "#555");
            },
            rowBorderWidth: 0.5,
            rowBorderColor: "#1433C3",
        }
    );
}

/**
 * Agrega un encabezado al documento PDF.
 * @param {PDFKit.PDFDocument} doc - Documento PDF.
 */
function agregarEncabezado(doc) {
    doc.font("Helvetica-Bold")
        .fontSize(10)
        .text("Megaship Soluciones Logísticas", 50, 20);
    doc.fontSize(8)
        .text(`Fecha: ${new Date().toLocaleDateString()}`, doc.page.width - 100, 20, { align: "right" });
}

/**
 * Agrega un pie de página al documento PDF.
 * @param {PDFKit.PDFDocument} doc - Documento PDF.
 */
function agregarPieDePagina(doc) {
    doc.font("Helvetica")
        .fontSize(8)
        .text("Contacto: info@megaship.com | Teléfono: +1 234 567 890", 50, doc.page.height - 40, { align: "center" });
    doc.text(`Página ${doc.pageNumber}`, doc.page.width - 50, doc.page.height - 40, { align: "right" });
}

/**
 * Formatea un número como moneda.
 * @param {number} valor - Valor a formatear.
 * @returns {string} - Valor formateado como moneda.
 */
function formatearMoneda(valor) {
    return `$${valor.toFixed(2)}`;
}

/**
 * Obtiene todos los registros de una tabla en Supabase.
 * @param {string} tableName - Nombre de la tabla a consultar.
 * @returns {Array|null} - Registros obtenidos o `null` si hay un error.
 */
export async function getData(tableName) {
    try {
        const { data, error } = await supabase.from(tableName).select();
        if (error) {
            console.error(`Error fetching data from ${tableName}:`, error);
            return null;
        }
        return data;
    } catch (err) {
        console.error(`Unexpected error fetching data from ${tableName}:`, err);
        return null;
    }
}

/**
 * Crea un registro vacío en la tabla `Common` y devuelve su ID.
 * @returns {number|string} - ID del registro creado o un mensaje de error.
 */
export async function createCommon() {
    try {
        const { data, error } = await supabase.from("Common").insert({}).select("id");
        if (error) {
            console.error("Error creating Common record:", error);
            return error.message;
        }
        return data?.[0]?.id || null;
    } catch (err) {
        console.error("Unexpected error in createCommon:", err);
        return "Error inesperado al crear Common.";
    }
}

/**
 * Crea un registro en la tabla `Trabajo`.
 * @param {number} id - ID del trabajo.
 * @param {object} body - Datos del trabajo.
 * @returns {object|string} - Datos creados o mensaje de error.
 */
export async function createTrabajo(id, body) {
    try {
        const { data, error } = await supabase.from("Trabajo").insert({
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
            tt: body.tt,
        }).select();
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
export async function createImportacion(id, body) {
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
export async function createExportacion(id, body) {
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
export async function updateTrabajo(body) {
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

/**
 * Obtiene datos de una tabla de Supabase filtrando por correo electrónico.
 * @param {string} tableName - Nombre de la tabla en Supabase.
 * @param {string} email - Correo electrónico a buscar.
 * @returns {object|null} - Devuelve el primer registro encontrado o null si no hay datos.
 */
export async function getDataByEmail(tableName, email) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select()
            .eq('email', email); // Filtra por la columna `email`.

        if (error) {
            console.error(`Error fetching data from ${tableName} with Email ${email}:`, error);
            return null; // Manejo de errores.
        }

        return data?.[0] || null; // Retorna el primer elemento o null si no hay datos.
    } catch (err) {
        console.error("Unexpected error fetching data:", err);
        return null; // Manejo de errores inesperados.
    }
}

/**
 * Actualiza un registro en una tabla específica de Supabase.
 * @param {string} id - ID del registro a actualizar.
 * @param {Object} body - Datos para actualizar.
 * @param {string} tableName - Nombre de la tabla.
 * @returns {Array|null|string} - Datos actualizados, `null` o un mensaje de error.
 */
export async function updateData(id, body, tableName) {
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
export async function createVariable(id, body) {
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

/**
 * Crea un nuevo vendedor con el ID y datos proporcionados.
 * @param {number} id - ID del vendedor.
 * @param {object} body - Datos del vendedor.
 * @returns {object|string} - Datos creados o mensaje de error.
 */
export async function createVendedor(id, body) {
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
export async function updateVendedor(id, body) {
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
export async function getVendedores() {
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
