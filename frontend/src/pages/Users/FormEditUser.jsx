import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import "../../assets/styles/FormEdit.css";
import { useParams, useNavigate } from "react-router-dom";

const FormEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [roles, setRoles] = useState([]);

  // Cargar usuario
  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar usuario");
        return res.json();
      })
      .then((data) => setUsuario(data))
      .catch((err) => console.error("Error al cargar usuario:", err));
  }, [id]);

  // Cargar empresas
  useEffect(() => {
    fetch("http://localhost:3001/api/users/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data))
      .catch((err) => console.error("Error al cargar empresas:", err));
  }, []);

  // Cargar roles
  useEffect(() => {
    fetch("http://localhost:3001/api/users/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error("Error al cargar roles:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al editar usuario");
        return res.json();
      })
      .then(() => {
        alert("Usuario actualizado correctamente");
        navigate("/home/users");
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
            {Object.keys(usuario).map((campo) => {
              if (campo === "empresa_nombre") {
                return (
                  <div key={campo} className="form-group">
                    <label>Empresa</label>
                    <select
                      value={usuario.empresa_nombre || ""}
                      onChange={(e) =>
                        setUsuario({
                          ...usuario,
                          empresa_nombre: e.target.value,
                        })
                      }
                    >
                      <option value="">Seleccione empresa</option>
                      {empresas.map((empresa) => (
                        <option key={empresa.id} value={empresa.nombre}>
                          {empresa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (campo === "rol_nombre") {
                return (
                  <div key={campo} className="form-group">
                    <label>Rol</label>
                    <select
                      value={usuario.rol_nombre || ""}
                      onChange={(e) =>
                        setUsuario({
                          ...usuario,
                          rol_nombre: e.target.value,
                        })
                      }
                    >
                      <option value="">Seleccione rol</option>
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.nombre}>
                          {rol.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (
                campo !== "id" &&
                campo !== "fecha_actualizacion" &&
                campo !== "empresa_id" &&
                campo !== "rol_id"
              ) {
                return (
                  <div key={campo} className="form-group">
                    <label>
                      {campo.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                          [campo]:
                            campo === "fecha_nacimiento" && e.target.value === ""
                              ? null
                              : e.target.value,
                        })
                      }
                    />
                  </div>
                );
              }

              return null;
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

export default FormEditUser;
