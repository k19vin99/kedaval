import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles/FormEdit.css";
import { useParams, useNavigate } from "react-router-dom";

const FormEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [sucursales, setSucursales] = useState([]);

  // Cargar producto con stock_id incluido
  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProducto(data))
      .catch((err) => console.error("Error al cargar producto:", err));
  }, [id]);

  // Cargar sucursales
  useEffect(() => {
    fetch("http://localhost:3001/api/stores")
      .then((res) => res.json())
      .then((data) => setSucursales(data))
      .catch((err) => console.error("Error al cargar sucursales:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Actualizar datos generales del producto
      await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      // 2. Actualizar stock y sucursal usando stock_id
      if (producto.stock_id) {
        await fetch(`http://localhost:3001/api/products/stock/${producto.stock_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stock_actual: producto.stock_actual,
            stock_minimo: producto.stock_minimo,
            sucursal_id: producto.sucursal_id,
          }),
        });
      }

      alert("Producto actualizado correctamente");
      navigate("/home/products");
    } catch (err) {
      console.error("Error al editar producto:", err);
    }
  };

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="form-container">
      <Navbar />
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Editar Producto</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            {/* Campos generales */}
            {[
              "codigo_barra",
              "nombre",
              "descripcion",
              "categoria",
              "marca",
              "precio_compra",
              "precio_venta",
              "unidad_medida",
              "iva",
              "porcentaje_iva",
              "codigo_sii",
            ].map((campo) => (
              <div key={campo} className="form-group">
                <label>
                  {campo.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  type={campo === "iva" ? "checkbox" : "text"}
                  checked={campo === "iva" ? producto[campo] : undefined}
                  value={campo !== "iva" ? producto[campo] || "" : undefined}
                  onChange={(e) =>
                    setProducto({
                      ...producto,
                      [campo]: campo === "iva" ? e.target.checked : e.target.value,
                    })
                  }
                />
              </div>
            ))}

            {/* Stock y sucursal */}
            <div className="form-group">
              <label>Stock Actual</label>
              <input
                type="number"
                value={producto.stock_actual || ""}
                onChange={(e) =>
                  setProducto({ ...producto, stock_actual: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Stock Mínimo</label>
              <input
                type="number"
                value={producto.stock_minimo || ""}
                onChange={(e) =>
                  setProducto({ ...producto, stock_minimo: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Sucursal</label>
              <select
                value={producto.sucursal_id || ""}
                onChange={(e) =>
                  setProducto({ ...producto, sucursal_id: e.target.value })
                }
              >
                <option value="">Seleccione una sucursal</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre_sucursal}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-guardar">
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEditProduct;
