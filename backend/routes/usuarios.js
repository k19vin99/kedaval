const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// 📌 Obtener todos los usuarios (con filtro opcional por correo o rol)
router.get("/", async (req, res) => {
  const { search } = req.query;
  try {
    let query;
    let values = [];

    if (search) {
      query = `
        SELECT u.*, r.nombre AS rol_nombre
        FROM users u
        LEFT JOIN roles r ON u.rol_id = r.id
        WHERE u.email ILIKE $1 OR r.nombre ILIKE $1
        ORDER BY u.id ASC
      `;
      values = [`%${search}%`];
    } else {
      query = `
        SELECT u.*, r.nombre AS rol_nombre
        FROM users u
        LEFT JOIN roles r ON u.rol_id = r.id
        ORDER BY u.id ASC
      `;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// 📌 Agregar usuario
router.post("/", async (req, res) => {
  const {
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    rut,
    direccion,
    fecha_nacimiento,
    email,
    password,
    rol_id,
    empresa_id
  } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ error: "La contraseña es obligatoria" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (
        primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
        rut, direccion, fecha_nacimiento, email, password, rol_id, empresa_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [
        primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
        rut, direccion, fecha_nacimiento, email, hashedPassword, rol_id, empresa_id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al agregar usuario:", err);
    res.status(500).json({ error: "Error al agregar usuario" });
  }
});

// 📌 Obtener todos los roles (debe ir antes que /:id)
router.get("/roles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM roles ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener roles:", err);
    res.status(500).json({ error: "Error al obtener roles" });
  }
});

// 📌 Obtener usuario por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT u.*, r.nombre AS rol_nombre
       FROM users u
       LEFT JOIN roles r ON u.rol_id = r.id
       WHERE u.id=$1`,
      [id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// 📌 Editar usuario
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    rut,
    direccion,
    fecha_nacimiento,
    email,
    password,
    rol_id,
    empresa_id
  } = req.body;

  try {
    let hashedPassword = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(
      `UPDATE users SET
        primer_nombre=$1, segundo_nombre=$2, primer_apellido=$3, segundo_apellido=$4,
        rut=$5, direccion=$6, fecha_nacimiento=$7,
        email=$8, password=COALESCE($9, password), rol_id=$10, empresa_id=$11
      WHERE id=$12
      RETURNING *`,
      [
        primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
        rut, direccion, fecha_nacimiento, email,
        hashedPassword,
        rol_id, empresa_id, id
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al editar usuario:", err);
    res.status(500).json({ error: "Error al editar usuario" });
  }
});

// 📌 Eliminar usuario
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

module.exports = router;
