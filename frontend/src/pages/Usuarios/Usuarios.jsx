import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import EliminarUsuarioPopup from "../Usuarios/EliminarUsuario"; 
import "../../assets/styles/TableStyles.css";
import { useNavigate } from "react-router-dom";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const tableRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:3001/api/usuarios")
    .then((res) => res.json())
    .then((data) => setUsuarios(data))
    .catch((err) => console.error("Error al obtener usuarios:", err));
  }, []);
  const handleDeleteConfirm = (id) => {
    fetch(`http://localhost:3001/api/usuarios/${id}`, { method: "DELETE" })
    .then(() => {
      setUsuarios(usuarios.filter((u) => u.id !== id));
      setUsuarioEliminar(null);
    })
    .catch((err) => console.error("Error al eliminar usuario:", err));
  };
  const filteredUsuarios = usuarios.filter((u) =>
    `${u.id} ${u.email} ${u.role}`
  .toLowerCase()
  .includes(search.toLowerCase())
);

const indexOfLast = currentPage * rowsPerPage;
const indexOfFirst = indexOfLast - rowsPerPage;
const currentUsuarios = filteredUsuarios.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(filteredUsuarios.length / rowsPerPage);
// Resize columnas
useEffect(() => {
  const table = tableRef.current;
  if (!table) return;
  const cols = table.querySelectorAll("th");
  cols.forEach((col) => {
    const resizer = document.createElement("div");
    resizer.classList.add("resizer");
    col.style.position = "relative";
    col.appendChild(resizer);
    let startX, startWidth;
    
    resizer.addEventListener("mousedown", (e) => {
      startX = e.pageX;
      startWidth = col.offsetWidth;
      resizer.classList.add("active");

      const onMouseMove = (e) => {
        const newWidth = startWidth + (e.pageX - startX);
        col.style.width = `${newWidth}px`;
      };
      
      const onMouseUp = () => {
        resizer.classList.remove("active");
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });
}, []);

return (
  <div className="table-container">
    <Navbar />
    <div style={{ padding: "20px" }}>
      <h2>Listado de Usuarios</h2>
      {/* Fila superior */}
      <div className="table-topbar">
        <div>
          Mostrar:{" "}
          <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} >
            <option value={5}>5</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          </div>
          <div>
            <input type="text" placeholder="Buscar por ID, Email, Rol..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        {/* Tabla */}
        <div className="table-wrapper">
          <table className="main-table" ref={tableRef}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Primer Nombre</th>
                <th>Segundo Nombre</th>
                <th>Primer Apellido</th>
                <th>Segundo Apellido</th>
                <th>RUT</th>
                <th>Dirección</th>
                <th>Fecha Nacimiento</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {currentUsuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.primer_nombre}</td>
                  <td>{u.segundo_nombre}</td>
                  <td>{u.primer_apellido}</td>
                  <td>{u.segundo_apellido}</td>
                  <td>{u.rut}</td>
                  <td>{u.direccion}</td>
                  <td>{u.fecha_nacimiento}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => navigate(`/EditarUsuario/${u.id}`)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => setUsuarioEliminar(u)}>
                      <FaTrash />
                      </button>
                  </td>
                </tr>
                ))
              }

              {/* 👇 Rellenar filas vacías hasta llegar a 5 */}
              {Array.from({ length: Math.max(0, 5 - currentUsuarios.length) }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td colSpan="11" style={{ textAlign: "center", color: "#aaa" }}> — Vacío — </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Botón Añadir Usuario abajo a la derecha */}
        <div style={{ marginTop: "15px" }}>
          <button onClick={() => navigate("/AddUsuario")} className="add-btn" > 
            <FaPlus /> Añadir Usuario
          </button>
        </div>
      </div>
      {/* Popup Eliminar */}
      {usuarioEliminar && (
        <EliminarUsuarioPopup
          usuario={usuarioEliminar}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setUsuarioEliminar(null)}
        />
      )}
    </div>
  );
};

export default Usuarios;