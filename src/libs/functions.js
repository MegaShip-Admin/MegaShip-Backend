import PDFDocument from "pdfkit-table";

export function buildPDF(data, dataCallback, endCallback) {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    const pageWidth = doc.page.width; // Ancho total de la página
    const margin = 50; // Margen izquierdo y derecho
    const tableWidth = 350; // Ancho total de las tablas (200 + 150 de las columnas)
    const leftMargin = (pageWidth - tableWidth) / 2; // Cálculo del margen izquierdo para centrar

    // Agregar el logo
    doc.image("./src/img/logo.png", 50, 20, { width: 50 }); // Ajusta el ancho y la posición según sea necesario

    // Título general debajo del logo
    doc.fontSize(16)
        .text("Megaship Soluciones Logísticas", 0, 80, { align: "center" , underline: true }); // Ajusta el valor '80' según la altura del logo

    // Tabla "Transporte y Tipo"
    const transporteTipo = [
        ["Importación", data.importacion ? "Sí" : "No"],
        ["Medio", data.medio],
        ["Consolidado", data.consolidado ? "Sí" : "No"],
        ["Exclusivo", data.exclusivo ? "Sí" : "No"],
    ];

    doc.moveDown();
    doc.fontSize(12).text("Transporte y Tipo", { x: leftMargin , underline: true });
    doc.table(
        { headers: ["Atributo", "Valor"], rows: transporteTipo },
        { columnsSize: [200, 150], x: leftMargin } // Centra la tabla
    );

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

    doc.fontSize(12).text("Características del Trabajo", { x: leftMargin , underline: true });
    doc.table(
        { headers: ["Atributo", "Valor"], rows: caracteristicasTrabajo },
        { columnsSize: [200, 150], x: leftMargin } // Centra la tabla
    );

    if (data.consolidado) {
        const cargaConsolidada = [
            ["Piezas", data.consolidado.piezas],
            ["Peso (kg)", data.consolidado.peso],
            ["CBM", data.consolidado.cbm],
        ];
        doc.table(
            { headers: ["Atributo", "Valor"], rows: cargaConsolidada },
            { columnsSize: [200, 150], x: leftMargin } // Centra la tabla
        );
    }

    if (data.exclusivo) {
        doc.fontSize(12).text("Cargas Exclusivas", { x: leftMargin , underline: true });
        const cargasExclusivas = data.exclusivo.map((carga) => [
            carga.Tipo,
            `${carga.cantidad} x ${carga.size}`,
        ]);
        doc.table(
            { headers: ["Tipo", "Descripción"], rows: cargasExclusivas },
            { columnsSize: [200, 150], x: leftMargin } // Centra la tabla
        );
    }

    // Costos (alineado a la izquierda)
    doc.fontSize(12).text("Costos", { x: leftMargin , underline: true });

    const costos = [
        ["Gastos de Origen", `$${data.gastos_origen.toFixed(2)}`],
        ["Tarifa", `$${data.tarifa.toFixed(2)}`],
        ["Servicios Administrativos", `$${data.serv_admin.toFixed(2)}`],
        ["Handling", `$${data.handling.toFixed(2)}`],
        ["Depósito", `$${data.deposito.toFixed(2)}`],
    ];

    doc.table(
        { headers: ["Descripción", "Costo"], rows: costos },
        { columnsSize: [200, 150], x: leftMargin } // Centra la tabla
    );

    const serviciosExtras = [
        ["Unificación de Factura", `$${data.unif_factura.toFixed(2)}`],
        ["TXL", `$${data.txl.toFixed(2)}`],
        ["Seguro", `$${data.seguro.toFixed(2)}`],
    ];

    doc.table(
        { headers: ["Extras", "Costo"], rows: serviciosExtras },
        { columnsSize: [200, 150], x: leftMargin } // Centra la tabla
    );

    // Datos del servicio y depósito (alineado a la izquierda)
    doc.fontSize(12).text("Datos del Servicio y Depósito", { x: leftMargin , underline: true });

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
        { columnsSize: [200, 150], x: leftMargin } // Centra la tabla
    );

    doc.end();
}
