import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles/FormularioRegistro.css"; // 👈 CSS único
import { useNavigate } from "react-router-dom";

const FormularioRegistroProducto = () => {
  const navigate = useNavigate();

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
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Producto agregado correctamente");
        navigate("/home/productos");
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
            {Object.keys(nuevoProducto).map((campo) => (
              <div key={campo} className="form-group">
                <label>
                  {campo
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  type={campo === "iva" ? "checkbox" : "text"}
                  checked={campo === "iva" ? nuevoProducto[campo] : undefined}
                  value={campo !== "iva" ? nuevoProducto[campo] : undefined}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      [campo]:
                        campo === "iva" ? e.target.checked : e.target.value,
                    })
                  }
                />
              </div>
            ))}
            <button type="submit" className="btn-guardar">
              Guardar Producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioRegistroProducto;