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

// 📌 Obtener todos los productos con stock, sucursal y empresa
router.get("/", authMiddleware, verificarRol, async (req, res) => {
  try {
    let result;
    if (req.rol === "admin" && !req.empresa_id) {
      // Admin global → ve todos los productos
      result = await pool.query(`
        SELECT 
          p.id, p.codigo_barra, p.nombre, p.descripcion, p.categoria, p.marca,
          p.precio_compra, p.precio_venta, p.unidad_medida, p.iva, p.porcentaje_iva,
          p.codigo_sii,
          ss.id AS stock_id, ss.stock_actual, ss.stock_minimo, ss.sucursal_id,
          st.nombre_sucursal,
          c.id AS empresa_id, c.nombre AS empresa_nombre, c.razon_social AS empresa_razon_social
        FROM productos p
        LEFT JOIN stock_sucursal ss ON p.id = ss.producto_id
        LEFT JOIN stores st ON ss.sucursal_id = st.id
        LEFT JOIN companies c ON st.empresa_id = c.id
        ORDER BY p.id ASC
      `);
    } else {
      // Usuarios normales o admin ligado a empresa → solo productos de su empresa
      result = await pool.query(`
        SELECT 
          p.id, p.codigo_barra, p.nombre, p.descripcion, p.categoria, p.marca,
          p.precio_compra, p.precio_venta, p.unidad_medida, p.iva, p.porcentaje_iva,
          p.codigo_sii,
          ss.id AS stock_id, ss.stock_actual, ss.stock_minimo, ss.sucursal_id,
          st.nombre_sucursal,
          c.id AS empresa_id, c.nombre AS empresa_nombre, c.razon_social AS empresa_razon_social
        FROM productos p
        LEFT JOIN stock_sucursal ss ON p.id = ss.producto_id
        LEFT JOIN stores st ON ss.sucursal_id = st.id
        LEFT JOIN companies c ON st.empresa_id = c.id
        WHERE c.id = $1
        ORDER BY p.id ASC
      `, [req.empresa_id]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// 📌 Obtener producto por ID con empresa
router.get("/:id", authMiddleware, verificarRol, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        p.id, p.codigo_barra, p.nombre, p.descripcion, p.categoria, p.marca,
        p.precio_compra, p.precio_venta, p.unidad_medida, p.iva, p.porcentaje_iva,
        p.codigo_sii,
        ss.id AS stock_id, ss.stock_actual, ss.stock_minimo, ss.sucursal_id,
        st.nombre_sucursal,
        c.id AS empresa_id, c.nombre AS empresa_nombre, c.razon_social AS empresa_razon_social
      FROM productos p
      LEFT JOIN stock_sucursal ss ON p.id = ss.producto_id
      LEFT JOIN stores st ON ss.sucursal_id = st.id
      LEFT JOIN companies c ON st.empresa_id = c.id
      WHERE p.id = $1
    `, [id]);

    if (!result.rows.length) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Validar acceso: admin global puede ver todo, otros solo su empresa
    const producto = result.rows[0];
    if (req.rol !== "admin" && producto.empresa_id != req.empresa_id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    res.json(producto);
  } catch (err) {
    console.error("Error al obtener producto:", err);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});


// 📌 Obtener producto por ID con stock y sucursal
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.codigo_barra,
        p.nombre,
        p.descripcion,
        p.categoria,
        p.marca,
        p.precio_compra,
        p.precio_venta,
        p.unidad_medida,
        p.iva,
        p.porcentaje_iva,
        p.codigo_sii,
        ss.id AS stock_id,
        ss.stock_actual,
        ss.stock_minimo,
        ss.sucursal_id,
        st.nombre_sucursal
      FROM productos p
      LEFT JOIN stock_sucursal ss ON p.id = ss.producto_id
      LEFT JOIN stores st ON ss.sucursal_id = st.id
      WHERE p.id = $1
    `, [id]);

    if (!result.rows.length) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener producto:", err);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

// 📌 Crear producto con stock inicial
router.post("/", async (req, res) => {
  const {
    codigo_barra,
    nombre,
    descripcion,
    categoria,
    marca,
    precio_compra,
    precio_venta,
    unidad_medida,
    iva,
    porcentaje_iva,
    codigo_sii,
    stock_actual,
    stock_minimo,
    sucursal_id
  } = req.body;

  try {
    // 1. Insertar producto
    const productoResult = await pool.query(
      `INSERT INTO productos (
        codigo_barra, nombre, descripcion, categoria, marca,
        precio_compra, precio_venta, unidad_medida, iva,
        porcentaje_iva, codigo_sii, fecha_creacion, fecha_actualizacion
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())
      RETURNING *`,
      [
        codigo_barra, nombre, descripcion, categoria, marca,
        precio_compra, precio_venta, unidad_medida, iva,
        porcentaje_iva, codigo_sii
      ]
    );

    const productoId = productoResult.rows[0].id;

    // 2. Insertar stock inicial
    const stockResult = await pool.query(
      `INSERT INTO stock_sucursal (
        producto_id, sucursal_id, stock_actual, stock_minimo
      ) VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [productoId, sucursal_id, stock_actual, stock_minimo]
    );

    res.json({
      producto: productoResult.rows[0],
      stock: stockResult.rows[0]
    });
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

// 📌 Editar producto (datos generales)
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
        unidad_medida = $8,
        iva = $9,
        porcentaje_iva = $10,
        codigo_sii = $11,
        fecha_actualizacion = NOW()
      WHERE id = $12
      RETURNING *`,
      [
        codigo_barra, nombre, descripcion, categoria, marca,
        precio_compra, precio_venta, unidad_medida, iva,
        porcentaje_iva, codigo_sii, id
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al editar producto:", err);
    res.status(500).json({ error: "Error al editar producto" });
  }
});

// 📌 Editar stock y sucursal usando stock_id
router.put("/stock/:stockId", async (req, res) => {
  const { stockId } = req.params;
  const { stock_actual, stock_minimo, sucursal_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE stock_sucursal SET
        stock_actual = $1,
        stock_minimo = $2,
        sucursal_id = $3
      WHERE id = $4
      RETURNING *`,
      [stock_actual, stock_minimo, sucursal_id, stockId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Stock no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al editar stock:", err);
    res.status(500).json({ error: "Error al editar stock" });
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

//Obtener las empresas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.codigo_barra,
        p.nombre,
        p.descripcion,
        p.categoria,
        p.marca,
        p.precio_compra,
        p.precio_venta,
        p.unidad_medida,
        p.iva,
        p.porcentaje_iva,
        p.codigo_sii,
        ss.id AS stock_id,
        ss.stock_actual,
        ss.stock_minimo,
        ss.sucursal_id,
        st.nombre_sucursal,
        c.id AS empresa_id,
        c.nombre AS empresa_nombre,
        c.razon_social AS empresa_razon_social
      FROM productos p
      LEFT JOIN stock_sucursal ss ON p.id = ss.producto_id
      LEFT JOIN stores st ON ss.sucursal_id = st.id
      LEFT JOIN companies c ON st.empresa_id = c.id
      ORDER BY p.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos con stock y empresa:", err);
    res.status(500).json({ error: "Error al obtener productos con stock y empresa" });
  }
});

module.exports = router;
