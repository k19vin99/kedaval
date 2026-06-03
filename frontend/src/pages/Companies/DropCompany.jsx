import React from "react";
import "../../assets/styles/Drop.css"; // mismo CSS compartido

const DropCompany = ({ company, onConfirm, onCancel }) => {
  if (!company) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Eliminar Empresa</h3>
        <p>
          ¿Seguro que deseas eliminar la empresa <strong>{company.nombre}</strong>?
        </p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-cancelar">
            Cancelar
          </button>
          <button onClick={() => onConfirm(company.id)} className="btn-eliminar">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropCompany;
