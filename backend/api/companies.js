const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtener todas las empresas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM companies ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener empresas");
  }
});

// Obtener empresa por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM companies WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener empresa");
  }
});

// Crear nueva empresa
router.post("/", async (req, res) => {
  const { rut, nombre, razon_social, direccion, telefono, email, giro, codigo_sii } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO companies (rut, nombre, razon_social, direccion, telefono, email, giro, codigo_sii, fecha_creacion, estado) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),'activo') RETURNING *`,
      [rut, nombre, razon_social, direccion, telefono, email, giro, codigo_sii]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al crear empresa");
  }
});

// Editar empresa
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { rut, nombre, razon_social, direccion, telefono, email, giro, codigo_sii, estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE companies SET rut=$1, nombre=$2, razon_social=$3, direccion=$4, telefono=$5, email=$6, giro=$7, codigo_sii=$8, estado=$9 
       WHERE id=$10 RETURNING *`,
      [rut, nombre, razon_social, direccion, telefono, email, giro, codigo_sii, estado, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al actualizar empresa");
  }
});

// Eliminar empresa
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM companies WHERE id=$1", [id]);
    res.json({ message: "Empresa eliminada" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al eliminar empresa");
  }
});
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
