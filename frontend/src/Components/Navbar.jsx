import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">Kedaval</Link>

      <button className="hamburger" onClick={() => setOpen(!open)}>☰</button>
      <div className={`navbar-links ${open ? "open" : ""}`}>
        <Link to="/home/products">Productos</Link>
        <Link to="/home/users">Usuarios</Link>
        <Link to="/home/pos">Punto de Venta</Link>
        <Link to="/home/facturas">Facturas</Link>
        <Link to="/home/stores">Sucursales</Link>

        {/* 👇 Solo visible para rol admin */}
        {user?.rol === "admin" && (
          <Link to="/home/companies">Empresas</Link>
        )}

        {/* 👇 Saludo personalizado siempre visible */}
        {user && (
          <div className="user-info">
            ¡Hola!, {user.primer_nombre} {user.primer_apellido} de {user.empresa_nombre}
          </div>
        )}

        <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
      </div>
    </nav>
  );
}

export default Navbar;
