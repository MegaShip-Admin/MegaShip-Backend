import { app, supabase } from "../index.js";
import PDFDocument from "pdfkit-table";

function buildPDF(dataCallback, endCallback) {
    const doc = new PDFDocument();
  
    doc.on("data", dataCallback);
    doc.on("end", endCallback);
  
    doc.fontSize(25).text("Some title from PDF Kit");
    doc.end();
  }
  
  console.log("Hasta aca")
  app.get("/pdf", (req, res) => {
    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
    });
    buildPDF(
      (data) => stream.write(data),
      () => stream.end()
    );
  });