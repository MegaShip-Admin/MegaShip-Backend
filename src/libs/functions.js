export function buildPDF(data, dataCallback, endCallback) {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
  
    doc.on("data", dataCallback);
    doc.on("end", endCallback);
  
    // Títulos y secciones
    doc.fontSize(14).text("Transporte y Tipo", { align: "left", underline: true });
    doc.moveDown();
  
    // Transporte y tipo
    const transporteYTipo = [
      ["Importación", data.importacion ? "Sí" : "No"],
      ["Medio", data.medio],
      ["Consolidado", data.consolidado ? "Sí" : "No"],
      ["Exclusivo", data.exclusivo ? "Sí" : "No"],
    ];
    doc.table(
      { headers: ["Atributo", "Valor"], rows: transporteYTipo },
      { columnsSize: [150, 200] }
    );
  
    doc.moveDown(2);
  
    // Características del trabajo
    doc.fontSize(14).text("Características del Trabajo", { align: "left", underline: true });
    doc.moveDown();
  
    const caracteristicasTrabajo = [
      ["Empresa", data.empresa],
      ["Nombre", data.nombre],
      ["Teléfono", data.telefono],
      ["Email", data.email],
      ["Origen", data.origen],
      ["Destino", data.destino],
      ["Incoterm", data.incoterm],
    ];
    doc.table(
      { headers: ["Atributo", "Valor"], rows: caracteristicasTrabajo },
      { columnsSize: [150, 300] }
    );
  
    // Ajustar espacio para siguientes secciones
    doc.moveDown(3);
  
    // Continúan las otras secciones (Carga, Costos, etc.)
    doc.fontSize(14).text("Características de la Carga", { align: "left", underline: true });
    doc.moveDown();
  
    // Si es consolidado
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
  
    // Si es exclusivo
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
  
    // Ajustar espacio y continuar con Costos y Servicios
    doc.moveDown(2);
  
    doc.fontSize(14).text("Costos", { align: "left", underline: true });
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
  
    doc.moveDown(2);
  
    // Datos del servicio y depósito
    doc.fontSize(14).text("Datos del Servicio y Depósito", { align: "left", underline: true });
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
  