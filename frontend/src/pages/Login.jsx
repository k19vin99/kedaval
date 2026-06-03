import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";   // 👈 importar contexto
import "../assets/styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);  // 👈 acceder al contexto

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

     if (res.ok) {
        localStorage.setItem("token", data.token); // guardar token
        setUser({
          id: data.id,
          email: data.email,
          primer_nombre: data.primer_nombre,
          primer_apellido: data.primer_apellido,
          empresa_nombre: data.empresa_nombre,
          rol: data.rol,
        });
        navigate("/home");
      }
 else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Error de conexión");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        <label className="login-label">Correo Electrónico</label>
        <input
          type="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <label className="login-label">Contraseña</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button onClick={handleLogin} className="login-button">
          Iniciar Sesión
        </button>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
