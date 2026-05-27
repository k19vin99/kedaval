import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import "../../assets/styles/FormularioEditar.css"; // 👈 CSS único
import { useParams, useNavigate } from "react-router-dom";

const FormularioEditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/usuarios/${id}`)
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch((err) => console.error("Error al cargar usuario:", err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/api/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Usuario actualizado correctamente");
        navigate("/home/usuarios");
      })
      .catch((err) => console.error("Error al editar usuario:", err));
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div className="form-container">
      <Navbar />
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Editar Usuario</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            {Object.keys(usuario).map(
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
                      type={
                        campo === "fecha_nacimiento"
                          ? "date"
                          : campo === "password"
                          ? "password"
                          : "text"
                      }
                      value={usuario[campo] || ""}
                      onChange={(e) =>
                        setUsuario({
                          ...usuario,
                          [campo]: e.target.value,
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

export default FormularioEditarUsuario;