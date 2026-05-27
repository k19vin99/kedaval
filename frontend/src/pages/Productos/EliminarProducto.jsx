import React from "react";
import "../../assets/styles/Eliminar.css"; // 👈 único CSS

const EliminarProductoPopup = ({ producto, onConfirm, onCancel }) => {
  if (!producto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Eliminar Producto</h3>
        <p>¿Seguro que deseas eliminar <strong>{producto.nombre}</strong>?</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-cancelar">
            Cancelar
          </button>
          <button onClick={() => onConfirm(producto.id)} className="btn-eliminar">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarProductoPopup;
