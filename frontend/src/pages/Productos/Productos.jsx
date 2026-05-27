import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import EliminarProductoPopup from "../Productos/EliminarProducto"; 
import "../../assets/styles/TableStyles.css";
import { useNavigate } from "react-router-dom";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [productoEliminar, setProductoEliminar] = useState(null);

  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  const handleDeleteConfirm = (id) => {
    fetch(`http://localhost:3001/api/productos/${id}`, { method: "DELETE" })
      .then(() => {
        setProductos(productos.filter((p) => p.id !== id));
        setProductoEliminar(null);
      })
      .catch((err) => console.error("Error al eliminar producto:", err));
  };

  const filteredProductos = productos.filter((p) =>
    `${p.id} ${p.codigo_barra} ${p.nombre} ${p.descripcion} ${p.categoria} ${p.marca}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentProductos = filteredProductos.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProductos.length / rowsPerPage);

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
        <h2>Listado de Productos</h2>

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
              placeholder="Buscar por ID, Código, Nombre..."
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
                <th>Código Barra</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Precio Compra</th>
                <th>Precio Venta</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Unidad Medida</th>
                <th>IVA</th>
                <th>% IVA</th>
                <th>Código SII</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProductos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.codigo_barra}</td>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.categoria}</td>
                  <td>{p.marca}</td>
                  <td>{p.precio_compra}</td>
                  <td>{p.precio_venta}</td>
                  <td>{p.stock_actual}</td>
                  <td>{p.stock_minimo}</td>
                  <td>{p.unidad_medida}</td>
                  <td>{p.iva ? "Sí" : "No"}</td>
                  <td>{p.porcentaje_iva}</td>
                  <td>{p.codigo_sii}</td>
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => navigate(`/EditarProducto/${p.id}`)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => setProductoEliminar(p)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              {/* 👇 Rellenar filas vacías hasta llegar a 5 */}
              {Array.from({ length: Math.max(0, 5 - currentProductos.length) }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td colSpan="15" style={{ textAlign: "center", color: "#aaa" }}>
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

        {/* Botón Añadir Producto */}
        <div style={{ textAlign: "right" }}>
          <button
            onClick={() => navigate("/AddProducto")}
            className="add-btn"
          >
            <FaPlus /> Añadir Producto
          </button>
        </div>
      </div>

      {/* Popup Eliminar */}
      {productoEliminar && (
        <EliminarProductoPopup
          producto={productoEliminar}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setProductoEliminar(null)}
        />
      )}
    </div>
  );
};

export default Productos;
