import React from "react";
import "../../assets/styles/Drop.css"; // 👈 único CSS

const DropUserPopup = ({ usuario, onConfirm, onCancel }) => {
  if (!usuario) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Eliminar Usuario</h3>
        <p>¿Seguro que deseas eliminar <strong>{usuario.primer_nombre} {usuario.primer_apellido}</strong>?</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-cancelar">
            Cancelar
          </button>
          <button onClick={() => onConfirm(usuario.id)} className="btn-eliminar">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropUserPopup;
