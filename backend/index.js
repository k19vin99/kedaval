const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Importar rutas
const productosRoutes = require("./api/productos");
const authRoutes = require("./api/auth");
const storesRouter = require("./api/stores");
const companiesRouter = require("./api/companies");
// Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Backend Kedaval funcionando 🚀");
});
const usuariosRouter = require("./routes/usuarios");
// Usar rutas
app.use("/api/productos", productosRoutes);
app.use("/api", authRoutes);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/stores", storesRouter);
app.use("/api/companies", companiesRouter);
// 🚀 Levantar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend Kedaval corriendo en http://localhost:${PORT}`);
});
