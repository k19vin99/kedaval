import React from "react";
import "../../assets/styles/Eliminar.css";

const DeleteCompany = ({ company, onConfirm, onCancel }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>¿Eliminar empresa?</h3>
        <p>
          Estás a punto de eliminar la empresa <strong>{company.nombre}</strong>.
        </p>
        <div className="popup-actions">
          <button onClick={() => onConfirm(company.id)} className="btn-danger">
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

export default DeleteCompany;
