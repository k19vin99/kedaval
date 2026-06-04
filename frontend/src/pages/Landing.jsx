import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Landing.css";

function Landing() {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          KEDAVAL
        </div>
        <div className="landing-sections">
          <a href="#servicios">Servicios</a>
          <a href="#casos">Casos de éxito</a>
          <a href="#tecnologia">Tecnología compatible</a>
          <a href="#respaldo">Respaldo</a>
          <a href="#contacto">Contacto</a>
        </div>
        <Link to="/login" className="landing-login-btn">
          Iniciar Sesión
        </Link>
      </nav>

      {/* Hero */}
      <section id="hero" className="landing-section landing-hero">
        <h1 className="landing-title">Bienvenido a Kedaval</h1>
        <p className="landing-subtitle">
          Sistema POS e inventario responsivo con integración SII.
        </p>
        
        </section>

      {/* Servicios */}
      <section id="servicios" className="landing-section">
        <h2 className="section-title">Servicios</h2>
        <div className="card-grid">
          <div className="card white-card">
            <h3>Inventario</h3>
            <p>Gestión completa de productos y stock.</p>
          </div>
          <div className="card gray-card">
            <h3>Facturación</h3>
            <p>Integración directa con SII.</p>
          </div>
          <div className="card black-card">
            <h3>Sucursales</h3>
            <p>Administra múltiples locales fácilmente.</p>
          </div>
        </div>
      </section>

      {/* Casos de éxito */}
      <section id="casos" className="landing-section">
        <h2 className="section-title">Casos de Éxito</h2>
        <div className="card-grid">
          <div className="card white-card">
            <p>"Empresa X aumentó sus ventas un 30% con Kedaval."</p>
          </div>
          <div className="card gray-card">
            <p>"Empresa Y redujo tiempos de facturación en un 50%."</p>
          </div>
        </div>
      </section>

      {/* Tecnología compatible */}
      <section id="tecnologia" className="landing-section">
        <h2 className="section-title">Tecnología Compatible</h2>
        <div className="card-grid">
          <div className="card white-card">Windows</div>
          <div className="card gray-card">Android</div>
          <div className="card black-card">Equipos móviles</div>
        </div>
      </section>

      {/* Respaldo */}
      <section id="respaldo" className="landing-section">
        <h2 className="section-title">Respaldo</h2>
        <div className="card-grid">
          <div className="card white-card">SII</div>
          <div className="card gray-card">Transbank</div>
          <div className="card black-card">Empresas asociadas</div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="landing-section">
        <h2 className="section-title">Contacto</h2>
        <form className="contact-form">
          <input type="text" placeholder="Nombre" />
          <input type="email" placeholder="Correo" />
          <textarea placeholder="Mensaje"></textarea>
          <button type="button">Enviar</button>
        </form>
      </section>

      {/* Footer */}
      <footer id="footer" className="landing-footer">
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
