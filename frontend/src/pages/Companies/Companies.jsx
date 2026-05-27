import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { FaTrash, FaEdit, FaPlus, FaList } from "react-icons/fa";
import "../../assets/styles/TableStyles.css";
import { useNavigate } from "react-router-dom";
import StoresPopup from "../Stores/StoresPopup";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error al obtener empresas:", err));
  }, []);

  const filteredCompanies = companies.filter((c) =>
    `${c.id} ${c.rut} ${c.nombre} ${c.razon_social} ${c.direccion}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCompanies.length / rowsPerPage);

  return (
    <div className="table-container">
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Listado de Empresas</h2>

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
              placeholder="Buscar por ID, RUT, Nombre..."
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
                <th>RUT</th>
                <th>Nombre</th>
                <th>Razón Social</th>
                <th>Dirección</th>
                <th>Sucursales</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentCompanies.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.rut}</td>
                  <td>{c.nombre}</td>
                  <td>{c.razon_social}</td>
                  <td>{c.direccion}</td>
                  <td>
                    <button onClick={() => setEmpresaSeleccionada(c)}>
                      <FaList /> Ver Sucursales
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => navigate(`/EditarCompany/${c.id}`)}>
                      <FaEdit />
                    </button>
                    <button>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Rellenar filas vacías */}
              {Array.from({ length: Math.max(0, 5 - currentCompanies.length) }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td colSpan="7" style={{ textAlign: "center", color: "#aaa" }}>
                    — Vacío —
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

        {/* Botón Añadir Empresa */}
        <div style={{ textAlign: "right" }}>
          <button
            onClick={() => navigate("/AddCompany")}
            className="add-btn"
          >
            <FaPlus /> Añadir Empresa
          </button>
        </div>
      </div>

      {/* Popup Sucursales */}
      {empresaSeleccionada && (
        <StoresPopup empresa={empresaSeleccionada} onClose={() => setEmpresaSeleccionada(null)} />
      )}
    </div>
  );
};

export default Companies;