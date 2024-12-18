import PDFDocument from "pdfkit-table";

export function buildPDF(data, dataCallback, endCallback) {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    // Título general
    doc.fontSize(14).text("Reporte de Servicio", { align: "center", underline: true });
    doc.moveDown(2);

    // Ajustes para transporte y tipo
    const startX = doc.x; // Inicio de la página
    const colWidth = 250; // Ancho de columna para los dos bloques
    const spacing = 30; // Espaciado entre columnas

    // Bloque "Transporte y Tipo" (quedará a la izquierda)
    doc.fontSize(12).text("Transporte y Tipo", startX, doc.y, { underline: true });
    doc.moveDown();
    doc.text(`Importación: ${data.importacion ? "Sí" : "No"}`);
    doc.text(`Medio: ${data.medio}`);
    doc.text(`Consolidado: ${data.consolidado ? "Sí" : "No"}`);
    doc.text(`Exclusivo: ${data.exclusivo ? "Sí" : "No"}`);

    // Bloque "Características del Trabajo" (se moverá a la derecha)
    const col2X = startX + colWidth + spacing;
    const currentY = doc.y - 60; // Ajustar para alinear ambas columnas
    doc.fontSize(12).text("Características del Trabajo", col2X, currentY, { underline: true });
    doc.moveDown();
    doc.text(`Empresa: ${data.empresa}`, col2X);
    doc.text(`Nombre: ${data.nombre}`, col2X);
    doc.text(`Teléfono: ${data.telefono}`, col2X);
    doc.text(`Email: ${data.email}`, col2X);
    doc.text(`Origen: ${data.origen}`, col2X);
    doc.text(`Destino: ${data.destino}`, col2X);
    doc.text(`Incoterm: ${data.incoterm}`, col2X);

    // Salto de línea después de los bloques
    doc.moveDown(2);

    // Características de la Carga
    doc.fontSize(14).text("Características de la Carga", { underline: true });
    doc.moveDown();

    if (data.consolidado) {
        const cargaConsolidada = [
            ["Piezas", data.consolidado.piezas],
            ["Peso (kg)", data.consolidado.peso],
            ["CBM", data.consolidado.cbm],
        ];
        doc.table(
            { headers: ["Atributo", "Valor"], rows: cargaConsolidada },
            { columnsSize: [150, 200] }
        );
    }

    if (data.exclusivo) {
        doc.text("Cargas Exclusivas", { underline: true }).moveDown();
        const cargasExclusivas = data.exclusivo.map((carga) => [
            carga.Tipo,
            `${carga.cantidad} x ${carga.size}`,
        ]);
        doc.table(
            { headers: ["Tipo", "Descripción"], rows: cargasExclusivas },
            { columnsSize: [150, 300] }
        );
    }

    // Costos
    doc.moveDown(2);
    doc.fontSize(14).text("Costos", { underline: true });
    doc.moveDown();

    const costos = [
        ["Gastos de Origen", `$${data.gastos_origen.toFixed(2)}`],
        ["Tarifa", `$${data.tarifa.toFixed(2)}`],
        ["Servicios Administrativos", `$${data.serv_admin.toFixed(2)}`],
        ["Handling", `$${data.handling.toFixed(2)}`],
        ["Depósito", `$${data.deposito.toFixed(2)}`],
    ];

    doc.table(
        { headers: ["Descripción", "Costo"], rows: costos },
        { columnsSize: [250, 100] }
    );

    doc.moveDown();
    const serviciosExtras = [
        ["Unificación de Factura", `$${data.unif_factura.toFixed(2)}`],
        ["TXL", `$${data.txl.toFixed(2)}`],
        ["Seguro", `$${data.seguro.toFixed(2)}`],
    ];

    doc.table(
        { headers: ["Descripción", "Costo"], rows: serviciosExtras },
        { columnsSize: [250, 100] }
    );

    // Datos del servicio y depósito
    doc.moveDown(2);
    doc.fontSize(14).text("Datos del Servicio y Depósito", { underline: true });

    const servicioYDeposito = [
        ["Servicio", data.servicio],
        ["Tiempo de Tránsito", `${data.tt} días`],
        ["Validez Inicial", data.validez_ini],
        ["Validez Final", data.validez_fin],
        ["Depósito Local", data.deposito_local],
        ["Salida", `$${data.salida.toFixed(2)}`],
    ];

    doc.table(
        { headers: ["Descripción", "Valor"], rows: servicioYDeposito },
        { columnsSize: [250, 200] }
    );

    doc.end();
}
