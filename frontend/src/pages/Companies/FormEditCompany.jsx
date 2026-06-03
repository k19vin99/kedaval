import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles/FormEdit.css";
import { useParams, useNavigate } from "react-router-dom";

const FormEditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/companies/${id}`)
      .then((res) => res.json())
      .then((data) => setCompany(data))
      .catch((err) => console.error("Error al cargar empresa:", err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/api/companies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Empresa actualizada correctamente");
        navigate("/home/companies");
      })
      .catch((err) => console.error("Error al editar empresa:", err));
  };

  if (!company) return <p>Cargando...</p>;

  return (
    <div className="form-container">
      <Navbar />
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Editar Empresa</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            {Object.keys(company).map(
              (campo) =>
                campo !== "id" &&
                campo !== "fecha_creacion" && (
                  <div key={campo} className="form-group">
                    <label>
                      {campo.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      value={company[campo] || ""}
                      onChange={(e) =>
                        setCompany({ ...company, [campo]: e.target.value })
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

export default FormEditCompany;
