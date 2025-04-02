import React, { useEffect } from "react";
import "./LossModal.css"; // Підключити стиль

const LossModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Забороняємо скрол під час показу модалки
    } else {
      document.body.style.overflow = "auto"; // Відновлюємо скрол, коли модалка закрита
    }
  }, [isOpen]);

  return (
    <div className={`loss-modal ${isOpen ? "show" : ""}`} onClick={onClose}>
      <div className="modal-content">
        <div className="loss-container">
          <div className="loss"></div>
          <div className="tear"></div>
        </div>
        <p>Ти програв... Але не здавайся!</p>
      </div>
    </div>
  );
};

export default LossModal;
