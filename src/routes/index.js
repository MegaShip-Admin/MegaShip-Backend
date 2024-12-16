import { Router } from "express";

const router = Router();

console.log("Archivo index.js cargado");

router.get("/pdf", (req, res) => {
  console.log("Ruta /pdf llamada");
  try {
    res.send("pdf");
  } catch (err) {
    console.error("Error al manejar la solicitud:", err);
    res.status(500).json({ error: "Error al obtener." });
  }
});

export default router;
