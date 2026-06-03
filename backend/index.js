const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Importar rutas
const productsRoutes = require("./api/products");
const authRoutes = require("./api/auth");
const storesRouter = require("./api/stores");
const companiesRouter = require("./api/companies");
const usersRouter = require("./api/users"); // ✅ ahora en api

// Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Backend Kedaval funcionando 🚀");
});

// Usar rutas
app.use("/api/products", productsRoutes);
app.use("/api", authRoutes);
app.use("/api/users", usersRouter); // ✅ ruta de usuarios
app.use("/api/stores", storesRouter);
app.use("/api/companies", companiesRouter);

// 🚀 Levantar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend Kedaval corriendo en http://localhost:${PORT}`);
});
