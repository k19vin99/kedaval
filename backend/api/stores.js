const express = require("express");
const router = express.Router();
const pool = require("../db"); // conexión a PostgreSQL

// Obtener todas las sucursales
// Obtener todas las sucursales con nombre de empresa
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.numero_sucursal, s.nombre_sucursal, s.direccion, s.empresa_id, c.nombre AS empresa_nombre
      FROM stores s
      LEFT JOIN companies c ON s.empresa_id = c.id
      ORDER BY s.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener sucursales");
  }
});


// Obtener una sucursal por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM stores WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener sucursal");
  }
});

// Crear nueva sucursal
router.post("/", async (req, res) => {
  const { numero_sucursal, nombre_sucursal, direccion, empresa_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO stores (numero_sucursal, nombre_sucursal, direccion, empresa_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [numero_sucursal, nombre_sucursal, direccion, empresa_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al crear sucursal");
  }
});



// Editar sucursal
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { numero_sucursal, nombre_sucursal, direccion, empresa_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE stores SET numero_sucursal = $1, nombre_sucursal = $2, direccion = $3, empresa_id = $4 WHERE id = $5 RETURNING *",
      [numero_sucursal, nombre_sucursal, direccion, empresa_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al actualizar sucursal");
  }
});

// Eliminar sucursal
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM stores WHERE id = $1", [id]);
    res.json({ message: "Sucursal eliminada" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al eliminar sucursal");
  }
});
// Obtener sucursales de una empresa
router.get("/byCompany/:empresa_id", async (req, res) => {
  const { empresa_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM stores WHERE empresa_id = $1 ORDER BY id ASC", [empresa_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener sucursales de la empresa");
  }
});


module.exports = router;
