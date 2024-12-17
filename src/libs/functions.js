import PDFDocument from "pdfkit-table";

export function buildPDF(data, dataCallback, endCallback) {
  const doc = new PDFDocument({ margin: 30 });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  // Título del recibo
  doc.fontSize(20).text("Recibo de Servicio", { align: "center" });
  doc.moveDown(2);

  // Información general
  doc.fontSize(12).text("Información del Trabajo:", { underline: true });
  doc.moveDown(0.5);

  // Datos del trabajo
  Object.entries(data.trabajo).forEach(([key, value]) => {
    doc.text(`${capitalize(key)}: ${value !== null ? value : 'N/A'}`);
  });

  doc.moveDown(1);
  doc.text("Información de Importación:", { underline: true });
  doc.moveDown(0.5);

  // Datos de importación
  Object.entries(data.importacion).forEach(([key, value]) => {
    doc.text(`${capitalize(key)}: ${value}`);
  });

  doc.moveDown(2);

  // Tabla resumen
  const table = {
    title: "Resumen de Costos",
    headers: ["Concepto", "Monto"],
    rows: [
      ["Gastos Origen", data.importacion.gastos_origen],
      ["Tarifa", data.importacion.tarifa],
      ["Servicio Administrativo", data.importacion.serv_admin],
      ["Handling", data.importacion.handling],
      ["Depósito", data.importacion.deposito],
      ["Unificación de Factura", data.importacion.unif_factura],
      ["TLX", data.importacion.tlx],
      ["Seguro", data.importacion.seguro],
      ["Depósito Local", data.importacion.deposito_local],
      ["Salida Depósito", data.importacion.salida_depo],
    ],
  };

  doc.text("Tabla de Costos:", { underline: true });
  doc.moveDown(0.5);

  // Renderiza la tabla
  doc.table(table, {
    width: 500,
    columnsSize: [300, 200],
  });

  doc.moveDown(2);
  doc.text("Gracias por confiar en nuestros servicios.", { align: "center" });

  doc.end();
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, " ");
}
