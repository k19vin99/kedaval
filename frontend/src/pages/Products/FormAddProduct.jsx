import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles/FormAdd.css";
import { useNavigate } from "react-router-dom";

const FormAddProduct = () => {
  const navigate = useNavigate();
  const [sucursales, setSucursales] = useState([]);

  const [nuevoProducto, setNuevoProducto] = useState({
    codigo_barra: "",
    nombre: "",
    descripcion: "",
    categoria: "",
    marca: "",
    precio_compra: "",
    precio_venta: "",
    stock_actual: "",
    stock_minimo: "",
    unidad_medida: "",
    iva: false,
    porcentaje_iva: "",
    codigo_sii: "",
    sucursal_id: "" // 👈 campo necesario para stock_sucursal
  });

  // Cargar sucursales para el select
  useEffect(() => {
    fetch("http://localhost:3001/api/stores")
      .then((res) => res.json())
      .then((data) => setSucursales(data))
      .catch((err) => console.error("Error al cargar sucursales:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Producto agregado correctamente");
        navigate("/home/products");
      })
      .catch((err) => console.error("Error al agregar producto:", err));
  };

  return (
    <div className="form-container">
      <Navbar />
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Agregar Producto</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            {Object.keys(nuevoProducto).map((campo) =>
              campo !== "sucursal_id" ? (
                <div key={campo} className="form-group">
                  <label>
                    {campo.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  <input
                    type={campo === "iva" ? "checkbox" : "text"}
                    checked={campo === "iva" ? nuevoProducto[campo] : undefined}
                    value={campo !== "iva" ? nuevoProducto[campo] : undefined}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        [campo]: campo === "iva" ? e.target.checked : e.target.value,
                      })
                    }
                  />
                </div>
              ) : null
            )}

            {/* Select de sucursal */}
            <div className="form-group">
              <label>Sucursal</label>
              <select
                value={nuevoProducto.sucursal_id}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, sucursal_id: e.target.value })
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
              Guardar Producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormAddProduct;
