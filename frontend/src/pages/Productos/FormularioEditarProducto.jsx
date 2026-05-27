import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles/FormularioEditar.css";

import { useParams, useNavigate } from "react-router-dom";

const FormularioEditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/productos/${id}`)
      .then((res) => res.json())
      .then((data) => setProducto(data))
      .catch((err) => console.error("Error al cargar producto:", err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Producto actualizado correctamente");
        navigate("/home/productos");
      })
      .catch((err) => console.error("Error al editar producto:", err));
  };

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="form-container">
      <Navbar />
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Editar Producto</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            {Object.keys(producto).map(
              (campo) =>
                campo !== "id" &&
                campo !== "fecha_actualizacion" && (
                  <div key={campo} className="form-group">
                    <label>
                      {campo
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </label>
                    <input
                      type={campo === "iva" ? "checkbox" : "text"}
                      checked={campo === "iva" ? producto[campo] : undefined}
                      value={campo !== "iva" ? producto[campo] || "" : undefined}
                      onChange={(e) =>
                        setProducto({
                          ...producto,
                          [campo]:
                            campo === "iva"
                              ? e.target.checked
                              : e.target.value,
                        })
                      }
                    />
                  </div>
                )
            )}
            <button type="submit" className="btn-guardar">
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioEditarProducto;