import React from "react";
import "../../assets/styles/Eliminar.css";

const EliminarStorePopup = ({ store, onConfirm, onCancel }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>¿Eliminar sucursal?</h3>
        <p>
          Estás a punto de eliminar la sucursal <strong>{store.nombre_sucursal}</strong>.
        </p>
        <div className="popup-actions">
          <button onClick={() => onConfirm(store.id)} className="btn-danger">
            Sí, eliminar
          </button>
          <button onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarStorePopup;
