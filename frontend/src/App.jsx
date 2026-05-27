import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";

/* Tablas */
import Productos from "./pages/Productos/Productos";
import Usuarios from "./pages/Usuarios/Usuarios";
import Stores from "./pages/Stores/Stores";
import Companies from "./pages/Companies/Companies";
/* Formularios de Registro */
import FormularioRegistroProducto from "./pages/Productos/FormularioRegistroProducto";
import FormularioRegistroUsuario from "./pages/Usuarios/FormularioRegistroUsuario";
import FormularioRegistroStores from "./pages/Stores/FormularioRegistroStores";
import FormAddCompany from "./pages/Companies/FormAddCompany";
/* Formularios de Edición */
import FormularioEditarProducto from "./pages/Productos/FormularioEditarProducto";
import FormularioEditarUsuario from "./pages/Usuarios/FormularioEditarUsuario";
import FormularioEditarStores from "./pages/Stores/FormularioEditarStore";
import FormEditCompany from "./pages/Companies/FormEditCompany";
function App() {
  return (
    <Router>
      <Routes>
        {/* Landing y Login */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Home principal */}
        <Route path="/home" element={<Home />} />

        {/* Productos */}
        <Route path="/home/productos" element={<Productos />} />
        <Route path="/AddProducto" element={<FormularioRegistroProducto />} />
        <Route path="/EditarProducto/:id" element={<FormularioEditarProducto />} />

        {/* Usuarios */}
        <Route path="/home/usuarios" element={<Usuarios />} />
        <Route path="/AddUsuario" element={<FormularioRegistroUsuario />} />
        <Route path="/EditarUsuario/:id" element={<FormularioEditarUsuario />} />

        {/* Sucursales */}
        <Route path="/home/stores" element={<Stores />} />
        <Route path="/AddStore" element={<FormularioRegistroStores />} />
        <Route path="/EditarStore/:id" element={<FormularioEditarStores />} />

        {/* Companies */}
        <Route path="/home/companies" element={<Companies />} />
        <Route path="/AddCompany" element={<FormAddCompany />} />
        <Route path="/EditarCompany/:id" element={<FormEditCompany />} />
      </Routes>
    </Router>
  );
}

export default App;
