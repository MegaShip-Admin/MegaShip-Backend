import express from "express";
import index from "./routes/index.js";

// Configuración de Express
export const app = express();
app.use("/", index); // Prefijo de rutas

// Ruta de prueba
app.get("/test", (req, res) => {
  console.log("Ruta /test llamada");
  res.send("Ruta de prueba funcionando");
});

// Debug: Mostrar rutas activas
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(`Ruta registrada: ${layer.route.path}`);
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
