import PDFDocument from "pdfkit-table";

export function buildPDF(data, dataCallback, endCallback) {
  const doc = new PDFDocument({ margin: 30 });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  // Título principal
  doc.fontSize(20).text("Recibo de Servicio", { align: "center" });
  doc.moveDown(2);

  // Transporte y Características del Trabajo en columnas
  doc.fontSize(14).text("Transporte y Tipo / Características del Trabajo", { underline: true });
  doc.moveDown(0.5);

  const columnWidth = 250; // Ancho de cada columna
  const startX = doc.x; // Posición inicial en X
  const columnGap = 20; // Espacio entre columnas

  // Primera columna: Transporte y Tipo
  doc.fontSize(12)
    .text(`Tipo: ${data.importacion ? "Importación" : "Exportación"}`, startX, doc.y)
    .text(`Medio: ${data.medio}`)
    .text(`Carga: ${data.consolidado ? "Consolidado" : "Exclusivo"}`, startX, doc.y)
    .moveDown(1);

  // Segunda columna: Características del Trabajo
  const secondColumnX = startX + columnWidth + columnGap;
  doc
    .text(`Empresa: ${data.empresa}`, secondColumnX, doc.y - 60)
    .text(`Nombre: ${data.nombre}`)
    .text(`Teléfono: ${data.telefono}`)
    .text(`Email: ${data.email}`)
    .text(`Origen: ${data.origen}`)
    .text(`Destino: ${data.destino}`)
    .text(`Incoterm: ${data.incoterm}`)
    .text(`Validez: Del ${data.validez_ini} al ${data.validez_fin}`);
  doc.moveDown(1);

  // Características de la carga
  doc.fontSize(14).text("Características de la Carga", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12).text(`Carga peligrosa: ${data.un ? "Sí" : "No"}`);

  if (data.consolidado) {
    doc.text("Detalles de Carga Consolidada:");
    Object.entries(data.consolidado).forEach(([key, value]) => {
      doc.text(`  ${capitalize(key)}: ${value}`);
    });
  }

  if (data.exclusivo) {
    doc.text("Detalles de Carga Exclusiva:");
    const rows = data.exclusivo.map((item) =>
      Object.values(item).map((value) => `${value}`)
    );

    const exclusivoTable = {
      headers: Object.keys(data.exclusivo[0]).map((key) => capitalize(key)),
      rows: rows,
    };

    // Crear tabla para cargas exclusivas
    doc.table(exclusivoTable, { width: 500, columnsSize: [150, 150, 150] });
  }
  doc.moveDown(1);

  // Lista de costos
  doc.fontSize(14).text("Lista de Costos", { underline: true });
  doc.moveDown(0.5);

  // Costos básicos
  const costosBasicos = {
    headers: ["Concepto", "Monto"],
    rows: [
      ["Gastos de Origen", data.gastos_origen.toFixed(2)],
      ["Tarifa", data.tarifa.toFixed(2)],
      ["Servicios Administrativos", data.serv_admin.toFixed(2)],
      ["Handling", data.handling.toFixed(2)],
      ["Depósito", data.deposito.toFixed(2)],
    ],
  };

  doc.text("Costos Básicos:");
  doc.table(costosBasicos, { width: 500, columnsSize: [300, 200] });
  doc.moveDown(1);

  // Servicios extras
  const costosExtras = {
    headers: ["Concepto", "Monto"],
    rows: [
      ["Unificación de Factura", data.unif_factura.toFixed(2)],
      ["TXL", data.txl.toFixed(2)],
      ["Seguro", data.seguro.toFixed(2)],
    ],
  };

  doc.text("Servicios Extras:");
  doc.table(costosExtras, { width: 500, columnsSize: [300, 200] });
  doc.moveDown(1);

  // Datos del servicio y depósito
  doc.fontSize(14).text("Datos del Servicio y Depósito", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12)
    .text(`Servicio: ${data.servicio}`)
    .text(`Tiempo de Tránsito (TT): ${data.tt} días`)
    .text(`Depósito Local: ${data.deposito_local}`)
    .text(`Salida: ${data.salida}`);
  doc.moveDown(2);

  // Mensaje final
  doc.text("Gracias por confiar en nuestros servicios.", { align: "center" });

  doc.end();
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, " ");
}
