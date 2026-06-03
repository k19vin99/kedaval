import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles/FormAdd.css"; // 👈 mismo CSS que productos
import { useNavigate } from "react-router-dom";

const FormAddStore = () => {
  const navigate = useNavigate();

  const [nuevaSucursal, setNuevaSucursal] = useState({
    numero_sucursal: "",
    nombre_sucursal: "",
    direccion: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaSucursal),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Sucursal agregada correctamente");
        navigate("/home/stores");
      })
      .catch((err) => console.error("Error al agregar sucursal:", err));
  };

  return (
    <div className="form-container">
      <Navbar />
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Agregar Sucursal</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            {Object.keys(nuevaSucursal).map((campo) => (
              <div key={campo} className="form-group">
                <label>
                  {campo
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  type="text"
                  value={nuevaSucursal[campo]}
                  onChange={(e) =>
                    setNuevaSucursal({
                      ...nuevaSucursal,
                      [campo]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
            <button type="submit" className="btn-guardar">
              Guardar Sucursal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormAddStore;
