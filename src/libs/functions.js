import PDFDocument from "pdfkit-table";

export function buildPDF(data, dataCallback, endCallback) {
  const doc = new PDFDocument({ margin: 30 });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  // Título principal
  doc.fontSize(20).text("Recibo de Servicio", { align: "center" });
  doc.moveDown(2);

  // Transporte y tipo
  doc.fontSize(14).text("Transporte y Tipo", { underline: true });
  doc.moveDown(0.5);

  const tipoTransporte = data.importacion ? "Importación" : "Exportación";
  const tipoCarga = data.consolidado ? "Consolidado" : "Exclusivo";
  doc.fontSize(12).text(`Tipo: ${tipoTransporte}`);
  doc.text(`Medio: ${data.medio}`);
  doc.text(`Carga: ${tipoCarga}`);
  doc.moveDown(1);

  // Características del trabajo
  doc.fontSize(14).text("Características del Trabajo", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12)
    .text(`Empresa: ${data.empresa}`)
    .text(`Nombre: ${data.nombre}`)
    .text(`Teléfono: ${data.telefono}`)
    .text(`Email: ${data.email}`)
    .text(`Origen: ${data.origen}`)
    .text(`Destino: ${data.destino}`)
    .text(`Incoterm: ${data.incoterm}`);
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
    data.exclusivo.forEach((detalle, index) => {
      doc.text(`  Exclusivo ${index + 1}:`);
      Object.entries(detalle).forEach(([key, value]) => {
        doc.text(`    ${capitalize(key)}: ${value}`);
      });
    });
  }
  doc.moveDown(1);

  // Lista de costos
  doc.fontSize(14).text("Lista de Costos", { underline: true });
  doc.moveDown(0.5);

  // Costos básicos
  const costosBasicos = {
    headers: ["Concepto", "Monto"],
    rows: [
      ["Gastos de Origen", data.gastos_origen],
      ["Tarifa", data.tarifa],
      ["Servicios Administrativos", data.serv_admin],
      ["Handling", data.handling],
      ["Depósito", data.deposito],
    ],
  };

  doc.text("Costos Básicos:");
  doc.table(costosBasicos, { width: 500, columnsSize: [300, 200] });
  doc.moveDown(1);

  // Servicios extras
  const costosExtras = {
    headers: ["Concepto", "Monto"],
    rows: [
      ["Unificación de Factura", data.unif_factura],
      ["TXL", data.txl],
      ["Seguro", data.seguro],
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
