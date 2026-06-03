import React from "react";
import "../../assets/styles/Drop.css"; // mismo CSS compartido

const DropStorePopup = ({ store, onConfirm, onCancel }) => {
  if (!store) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Eliminar Sucursal</h3>
        <p>¿Seguro que deseas eliminar la sucursal <strong>{store.nombre_sucursal}</strong>?</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-cancelar">
            Cancelar
          </button>
          <button onClick={() => onConfirm(store.id)} className="btn-eliminar">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropStorePopup;
