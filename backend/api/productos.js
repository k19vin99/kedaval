const express = require("express");
const router = express.Router();
const pool = require("../db");

// 📌 Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// 📌 Agregar producto
router.post("/", async (req, res) => {
  const { codigo_barra, nombre, descripcion, categoria, marca, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida, iva, porcentaje_iva, codigo_sii } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO productos 
      (codigo_barra, nombre, descripcion, categoria, marca, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida, iva, porcentaje_iva, codigo_sii) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [codigo_barra, nombre, descripcion, categoria, marca, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida, iva, porcentaje_iva, codigo_sii]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// 📌 Editar producto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    codigo_barra,
    nombre,
    descripcion,
    categoria,
    marca,
    precio_compra,
    precio_venta,
    stock_actual,
    stock_minimo,
    unidad_medida,
    iva,
    porcentaje_iva,
    codigo_sii
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE productos SET 
        codigo_barra = $1,
        nombre = $2,
        descripcion = $3,
        categoria = $4,
        marca = $5,
        precio_compra = $6,
        precio_venta = $7,
        stock_actual = $8,
        stock_minimo = $9,
        unidad_medida = $10,
        iva = $11,
        porcentaje_iva = $12,
        codigo_sii = $13,
        fecha_actualizacion = NOW()
      WHERE id = $14
      RETURNING *`,
      [codigo_barra, nombre, descripcion, categoria, marca, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida, iva, porcentaje_iva, codigo_sii, id]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // logs de verificación (puedes dejar temporalmente)
    console.log("PUT: producto actualizado:", result.rows[0]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al editar producto:", err);
    res.status(500).json({ error: "Error al editar producto" });
  }
});

// 📌 Eliminar producto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM productos WHERE id=$1", [id]);
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});
// 📌 Obtener producto por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM productos WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener producto:", err);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});


module.exports = router;
