import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "15px 30px", backgroundColor: "#6a0dad", color: "#fff" }}>
        <h2 style={{ margin: 0 }}>Kedaval POS</h2>
        <Link to="/login" style={{ backgroundColor: "#fff", color: "#6a0dad", padding: "10px 20px", borderRadius: "5px", textDecoration: "none", fontWeight: "bold" }}>
          Iniciar Sesión
        </Link>
      </nav>
      <main style={{ textAlign: "center", padding: "50px 20px" }}>
        <h1 style={{ color: "#6a0dad" }}>Bienvenido a Kedaval</h1>
        <p style={{ fontSize: "18px", maxWidth: "600px", margin: "20px auto" }}>
          Sistema POS e inventario responsivo con integración SII.  
          Diseñado para ser moderno, rápido y accesible desde cualquier dispositivo.
        </p>
      </main>
    </div>
  );
}

export default Landing;
