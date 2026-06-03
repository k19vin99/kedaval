const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware para verificar rol
function verificarRol(req, res, next) {
  const user = req.user;
  if (!user) return res.status(401).send("No autenticado");
  req.rol = user.rol;
  req.empresa_id = user.empresa_id;
  next();
}

// 📌 Obtener empresas
router.get("/", authMiddleware, verificarRol, async (req, res) => {
  try {
    let result;
    if (req.rol === "admin" && !req.empresa_id) {
      // Admin global → todas las empresas
      result = await pool.query("SELECT * FROM companies ORDER BY id ASC");
    } else {
      // Usuarios normales o admin ligado a empresa → solo su empresa
      result = await pool.query("SELECT * FROM companies WHERE id = $1", [req.empresa_id]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener empresas");
  }
});

// 📌 Obtener empresa por ID
router.get("/:id", authMiddleware, verificarRol, async (req, res) => {
  const { id } = req.params;
  try {
    if (req.rol === "admin" || req.empresa_id == id) {
      const result = await pool.query("SELECT * FROM companies WHERE id = $1", [id]);
      res.json(result.rows[0]);
    } else {
      res.status(403).send("No autorizado");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener empresa");
  }
});

// 📌 Crear nueva empresa (solo admin global)
router.post("/", authMiddleware, verificarRol, async (req, res) => {
  if (req.rol !== "admin" || req.empresa_id) return res.status(403).send("No autorizado");
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

// 📌 Editar empresa (solo admin global)
router.put("/:id", authMiddleware, verificarRol, async (req, res) => {
  if (req.rol !== "admin" || req.empresa_id) return res.status(403).send("No autorizado");
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

// 📌 Eliminar empresa (solo admin global)
router.delete("/:id", authMiddleware, verificarRol, async (req, res) => {
  if (req.rol !== "admin" || req.empresa_id) return res.status(403).send("No autorizado");
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM companies WHERE id=$1", [id]);
    res.json({ message: "Empresa eliminada" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al eliminar empresa");
  }
});

module.exports = router;
