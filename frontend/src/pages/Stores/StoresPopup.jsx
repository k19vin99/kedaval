import React, { useEffect, useState } from "react";
import "../../assets/styles/Eliminar.css";

const StoresPopup = ({ empresa, onClose }) => {
  const [sucursales, setSucursales] = useState([]);
  const [nuevaSucursal, setNuevaSucursal] = useState({
    numero_sucursal: "",
    nombre_sucursal: "",
    direccion: ""
  });

  // Cargar sucursales de la empresa
  useEffect(() => {
    fetch(`http://localhost:3001/api/stores/byCompany/${empresa.id}`)
      .then((res) => res.json())
      .then((data) => setSucursales(data))
      .catch((err) => console.error("Error al obtener sucursales:", err));
  }, [empresa.id]);

  // Agregar nueva sucursal
  const handleAddSucursal = () => {
    fetch("http://localhost:3001/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...nuevaSucursal, empresa_id: empresa.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSucursales([...sucursales, data]);
        setNuevaSucursal({ numero_sucursal: "", nombre_sucursal: "", direccion: "" });
      })
      .catch((err) => console.error("Error al agregar sucursal:", err));
  };

  return (
    <div className="modal-overlay">
        <div className="modal-content">
        <h3>Sucursales de {empresa.nombre}</h3>

        <ul>
            {sucursales.length > 0 ? (
            sucursales.map((s) => (
                <li key={s.id}>
                <strong>{s.numero_sucursal}</strong> - {s.nombre_sucursal} ({s.direccion})
                </li>
            ))
            ) : (
            <p>No hay sucursales registradas</p>
            )}
        </ul>

        <h4>Agregar nueva sucursal</h4>
        <div className="form-group">
            <label>Número de Sucursal</label>
            <input
            type="text"
            value={nuevaSucursal.numero_sucursal}
            onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, numero_sucursal: e.target.value })}
            />
        </div>
        <div className="form-group">
            <label>Nombre de Sucursal</label>
            <input
            type="text"
            value={nuevaSucursal.nombre_sucursal}
            onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, nombre_sucursal: e.target.value })}
            />
        </div>
        <div className="form-group">
            <label>Dirección</label>
            <input
            type="text"
            value={nuevaSucursal.direccion}
            onChange={(e) => setNuevaSucursal({ ...nuevaSucursal, direccion: e.target.value })}
            />
        </div>
        <div className="modal-actions">
            <button onClick={handleAddSucursal} className="btn-eliminar">Guardar Sucursal</button>
            <button onClick={onClose} className="btn-cancelar">Cerrar</button>
        </div>
        </div>
    </div>
    );
};

export default StoresPopup;