import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import EliminarStorePopup from "./EliminarStore"; 
import "../../assets/styles/TableStyles.css";
import { useNavigate } from "react-router-dom";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [storeEliminar, setStoreEliminar] = useState(null);

  const tableRef = useRef(null);
  const navigate = useNavigate();

  // Obtener datos reales desde backend
  useEffect(() => {
    fetch("http://localhost:3001/api/stores")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Error al obtener sucursales:", err));
  }, []);

  // Confirmar eliminación
  const handleDeleteConfirm = (id) => {
    fetch(`http://localhost:3001/api/stores/${id}`, { method: "DELETE" })
      .then(() => {
        setStores(stores.filter((s) => s.id !== id));
        setStoreEliminar(null);
      })
      .catch((err) => console.error("Error al eliminar sucursal:", err));
  };

  // Filtro búsqueda
  const filteredStores = stores.filter((s) =>
    `${s.id} ${s.numero_sucursal} ${s.nombre_sucursal} ${s.direccion}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Paginación
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentStores = filteredStores.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStores.length / rowsPerPage);

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
        <h2>Listado de Sucursales</h2>

        {/* Fila superior */}
        <div className="table-topbar">
          <div>
            Mostrar:{" "}
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Buscar por ID, Número, Nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="table-wrapper">
          <table className="main-table" ref={tableRef}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Número</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Empresa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentStores.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.numero_sucursal}</td>
                  <td>{s.nombre_sucursal}</td>
                  <td>{s.direccion}</td>
                  <td>{s.empresa_nombre || "—"}</td>
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => navigate(`/EditarStore/${s.id}`)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => setStoreEliminar(s)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Paginación */}
        <div className="table-pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Botón Añadir Sucursal */}
        <div style={{ textAlign: "right" }}>
          <button
            onClick={() => navigate("/AddStore")}
            className="add-btn"
          >
            <FaPlus /> Añadir Sucursal
          </button>
        </div>
      </div>

      {/* Popup Eliminar */}
      {storeEliminar && (
        <EliminarStorePopup
          store={storeEliminar}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setStoreEliminar(null)}
        />
      )}
    </div>
  );
};

export default Stores;
