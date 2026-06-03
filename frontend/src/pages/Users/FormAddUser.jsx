import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";

const FormAddUser = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    rut: "",
    direccion: "",
    fecha_nacimiento: "",
    email: "",
    password: "",
    rol_id: null,
    empresa_id: null,
  });

  // Cargar roles desde backend
  useEffect(() => {
    fetch("http://localhost:3001/api/users/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error("Error al obtener roles:", err));
  }, []);

  // Cargar empresas desde backend
  useEffect(() => {
    fetch("http://localhost:3001/api/users/empresas")
      .then((res) => res.json())
      .then((data) => setEmpresas(data))
      .catch((err) => console.error("Error al obtener empresas:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Usuario agregado correctamente");
        navigate("/home/users");
      })
      .catch((err) => console.error("Error al agregar usuario:", err));
  };

  return (
    <div className="form-container">
      <Navbar />
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Añadir Usuario</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            {/* Campos normales */}
            {[
              "primer_nombre",
              "segundo_nombre",
              "primer_apellido",
              "segundo_apellido",
              "rut",
              "direccion",
              "fecha_nacimiento",
              "email",
              "password",
            ].map((campo) => (
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
                  value={nuevoUsuario[campo]}
                  onChange={(e) =>
                    setNuevoUsuario({ ...nuevoUsuario, [campo]: e.target.value })
                  }
                />
              </div>
            ))}

            {/* Campo especial: Rol */}
            <div className="form-group">
              <label>Rol</label>
              <select
                value={nuevoUsuario.rol_id || ""}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, rol_id: parseInt(e.target.value) })
                }
              >
                <option value="">Seleccione un rol</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo especial: Empresa */}
            <div className="form-group">
              <label>Empresa</label>
              <select
                value={nuevoUsuario.empresa_id || ""}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, empresa_id: parseInt(e.target.value) })
                }
              >
                <option value="">Seleccione una empresa</option>
                {empresas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-guardar">
              Guardar Usuario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormAddUser;
