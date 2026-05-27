import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles/FormularioEditar.css";
import { useParams, useNavigate } from "react-router-dom";

const FormularioEditarStore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [companies, setCompanies] = useState([]);

  // Cargar datos de la sucursal
  useEffect(() => {
    fetch(`http://localhost:3001/api/stores/${id}`)
      .then((res) => res.json())
      .then((data) => setStore(data))
      .catch((err) => console.error("Error al cargar sucursal:", err));
  }, [id]);

  // Cargar listado de empresas
  useEffect(() => {
    fetch("http://localhost:3001/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error al cargar empresas:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/api/stores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(store),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Sucursal actualizada correctamente");
        navigate("/home/stores");
      })
      .catch((err) => console.error("Error al editar sucursal:", err));
  };

  if (!store) return <p>Cargando...</p>;

  return (
    <div className="form-container">
      <Navbar />
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Editar Sucursal</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            {Object.keys(store).map((campo) => {
              if (campo === "id") return null;

              // Campo especial para empresa_id
              if (campo === "empresa_id") {
                return (
                  <div key={campo} className="form-group">
                    <label>Empresa</label>
                    <select
                      value={store.empresa_id || ""}
                      onChange={(e) =>
                        setStore({ ...store, empresa_id: e.target.value })
                      }
                    >
                      <option value="">Seleccione una empresa</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              // Campos normales
              return (
                <div key={campo} className="form-group">
                  <label>
                    {campo
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    value={store[campo] || ""}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        [campo]: e.target.value,
                      })
                    }
                  />
                </div>
              );
            })}
            <button type="submit" className="btn-guardar">
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioEditarStore;