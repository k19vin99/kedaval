import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Kedaval</div>
      <button className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </button>
      <div className={`navbar-links ${open ? "open" : ""}`}>
        <Link to="/home/productos">Productos</Link>
        <Link to="/home/usuarios">Usuarios</Link> {/* nueva ruta */}
        <Link to="/home/pos">Punto de Venta</Link>
        <Link to="/home/facturas">Facturas</Link>
        <Link to="/home/stores">Sucursales</Link>
        <Link to="/home/companies">Empresas</Link>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
