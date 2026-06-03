const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 📌 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.password, u.primer_nombre, u.primer_apellido,
              u.empresa_id, c.nombre AS empresa_nombre, r.nombre AS rol_nombre
       FROM users u
       LEFT JOIN companies c ON u.empresa_id = c.id
       LEFT JOIN roles r ON u.rol_id = r.id
       WHERE u.email=$1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 🔑 Generar token JWT con datos del usuario
    const token = jwt.sign(
      {
        id: user.id,
        rol: user.rol_nombre.toLowerCase(),
        empresa_id: user.empresa_id,
      },
      process.env.JWT_SECRET || "clave_secreta",
      { expiresIn: "8h" }
    );

    // ✅ devolver datos completos + token
    res.json({
      message: "Login exitoso",
      id: user.id,
      email: user.email,
      primer_nombre: user.primer_nombre,
      primer_apellido: user.primer_apellido,
      empresa_nombre: user.empresa_nombre,
      rol: user.rol_nombre.toLowerCase(),
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;
