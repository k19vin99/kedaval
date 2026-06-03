import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles/FormAdd.css";
import { useNavigate } from "react-router-dom";
import StoresPopup from "../Stores/StoresPopup";

const FormAddCompany = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    rut: "",
    nombre: "",
    razon_social: "",
    direccion: "",
    telefono: "",
    email: "",
    giro: "",
    codigo_sii: ""
  });

  const [empresaCreada, setEmpresaCreada] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Empresa agregada correctamente");
        setEmpresaCreada(data); // guardamos la empresa creada para abrir popup
      })
      .catch((err) => console.error("Error al agregar empresa:", err));
  };

  return (
    <div className="form-container">
      <Navbar />
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Agregar Empresa</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            {Object.keys(company).map((campo) => (
              <div key={campo} className="form-group">
                <label>
                  {campo.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  type="text"
                  value={company[campo]}
                  onChange={(e) =>
                    setCompany({ ...company, [campo]: e.target.value })
                  }
                />
              </div>
            ))}
            <button type="submit" className="btn-guardar">
              Guardar Empresa
            </button>
          </form>

          {/* Botón para gestionar sucursales */}
          {empresaCreada && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                onClick={() => setEmpresaCreada(empresaCreada)}
                className="add-btn"
              >
                Gestionar Sucursales
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup de sucursales */}
      {empresaCreada && (
        <StoresPopup
          empresa={empresaCreada}
          onClose={() => {
            setEmpresaCreada(null);
            navigate("/home/companies");
          }}
        />
      )}
    </div>
  );
};

export default FormAddCompany;