import PDFDocument from "pdfkit-table";

export function buildPDF(data, dataCallback, endCallback) {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    // Título general
    doc.fontSize(14).text("Reporte de Servicio", { align: "center", underline: true });
    doc.moveDown(2);

    // Secciones paralelas: "Transporte y Tipo" y "Características del Trabajo"
    const transporteYTipo = [
        ["Importación", data.importacion ? "Sí" : "No"],
        ["Medio", data.medio],
        ["Consolidado", data.consolidado ? "Sí" : "No"],
        ["Exclusivo", data.exclusivo ? "Sí" : "No"],
    ];

    const caracteristicasTrabajo = [
        ["Empresa", data.empresa],
        ["Nombre", data.nombre],
        ["Teléfono", data.telefono],
        ["Email", data.email],
        ["Origen", data.origen],
        ["Destino", data.destino],
        ["Incoterm", data.incoterm],
    ];

    // Diseño en paralelo
    const startX = doc.x;
    const colWidth = 250;

    doc.text("Transporte y Tipo", startX, doc.y, { underline: true });
    doc.table(
        { headers: ["Atributo", "Valor"], rows: transporteYTipo },
        { columnsSize: [150, 200], x: startX, y: doc.y + 15 }
    );

    const col2X = startX + colWidth + 30;
    const currentY = doc.y;

    doc.text("Características del Trabajo", col2X, currentY, { underline: true });
    doc.table(
        { headers: ["Atributo", "Valor"], rows: caracteristicasTrabajo },
        { columnsSize: [150, 200], x: col2X, y: currentY + 15 }
    );

    // Continuar con otras secciones después de un salto
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
