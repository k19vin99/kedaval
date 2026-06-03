import React, { useEffect, useState } from "react";
import "../../assets/styles/Drop.css";

const CompanyUsersPopup = ({ empresa, onClose }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
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
    rol_id: null
  });

  // 📌 Cargar usuarios y roles
  useEffect(() => {
    fetch(`http://localhost:3001/api/companies/${empresa.id}/usuarios`)
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al obtener usuarios:", err));

    fetch("http://localhost:3001/api/users/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error("Error al obtener roles:", err));
  }, [empresa.id]);

  // 📌 Guardar usuario nuevo
  const handleAddUsuario = () => {
    const payload = {
      ...nuevoUsuario,
      empresa_id: empresa.id,
      rol_id: parseInt(nuevoUsuario.rol_id) || null,
      fecha_nacimiento: nuevoUsuario.fecha_nacimiento || null
    };

    fetch("http://localhost:3001/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((msg) => { throw new Error(msg); });
        }
        return res.json();
      })
      .then((data) => {
        setUsuarios([...usuarios, data]);
        alert("Usuario agregado correctamente");
        setNuevoUsuario({
          primer_nombre: "",
          segundo_nombre: "",
          primer_apellido: "",
          segundo_apellido: "",
          rut: "",
          direccion: "",
          fecha_nacimiento: "",
          email: "",
          password: "",
          rol_id: null
        });
      })
      .catch((err) => console.error("Error al agregar usuario:", err));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Personal de {empresa.nombre}</h3>

        <ul>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <li key={u.id}>
                <strong>{u.primer_nombre} {u.primer_apellido}</strong> - {u.email} ({u.rol_nombre})
              </li>
            ))
          ) : (
            <p>No hay usuarios registrados</p>
          )}
        </ul>

        <h4>Agregar nuevo usuario</h4>
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
              value={nuevoUsuario[campo] || ""}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, [campo]: e.target.value })
              }
            />
          </div>
        ))}

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

        <div className="modal-actions">
          <button onClick={handleAddUsuario} className="btn-eliminar">Guardar Usuario</button>
          <button onClick={onClose} className="btn-cancelar">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default CompanyUsersPopup;
