import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Landing.css";

function Landing() {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-navbar">
        <h2 className="landing-logo">Kedaval POS</h2>
        <Link to="/login" className="landing-login-btn">
          Iniciar Sesión
        </Link>
      </nav>

      {/* Hero Slider */}
      <section className="landing-hero">
        <div className="slider">
          <div className="slide active">
            <h1 className="landing-title">Bienvenido a Kedaval</h1>
            <p className="landing-subtitle">
              Sistema POS e inventario responsivo con integración SII.
            </p>
            <Link to="/login" className="landing-cta">Comenzar Ahora</Link>
          </div>
          {/* Aquí puedes añadir más slides con imágenes corporativas */}
        </div>
      </section>

      {/* Casos de éxito */}
      <section className="landing-success">
        <h2 className="section-title">Casos de Éxito</h2>
        <div className="success-slider">
          <div className="success-card">
            <p>"Empresa X aumentó sus ventas un 30% con Kedaval."</p>
          </div>
          <div className="success-card">
            <p>"Empresa Y redujo tiempos de facturación en un 50%."</p>
          </div>
        </div>
      </section>

      {/* Partes del sistema */}
      <section className="landing-features">
        <h2 className="section-title">Partes del Sistema</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📦 Inventario</h3>
            <p>Gestión completa de productos y stock.</p>
          </div>
          <div className="feature-card">
            <h3>🧾 Facturación</h3>
            <p>Integración directa con SII.</p>
          </div>
          <div className="feature-card">
            <h3>🏬 Sucursales</h3>
            <p>Administra múltiples locales fácilmente.</p>
          </div>
          <div className="feature-card">
            <h3>👥 Usuarios</h3>
            <p>Roles y permisos personalizados.</p>
          </div>
        </div>
      </section>

      {/* Trabaja con nosotros */}
      <section className="landing-careers">
        <h2 className="section-title">Trabaja con Nosotros</h2>
        <p>Únete al equipo Kedaval y sé parte de la innovación.</p>
        <Link to="/careers" className="landing-cta">Ver Oportunidades</Link>
      </section>

      {/* Clientes */}
      <section className="landing-clients">
        <h2 className="section-title">Clientes que confían en nosotros</h2>
        <div className="client-logos">
          <div className="client-logo">Logo A</div>
          <div className="client-logo">Logo B</div>
          <div className="client-logo">Logo C</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div>
            <h3>Kedaval POS</h3>
            <p>Dirección: Av. Providencia 1234, Santiago, Chile</p>
            <p>Email: soporte@kedaval.cl</p>
          </div>
          <div>
            <h3>Redes Sociales</h3>
            <p>LinkedIn | Instagram | Facebook</p>
          </div>
          <div>
            <h3>Links Rápidos</h3>
            <p>Soporte | Documentación | Políticas</p>
          </div>
        </div>
        <p className="footer-bottom">© 2026 Kedaval. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Landing;