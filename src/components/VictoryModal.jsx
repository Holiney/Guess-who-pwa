import React from "react";
import "./VictoryModal.css"; // Стилі для анімації
import trophy from "../assets/trophy.png";

const VictoryModal = ({ winnerName, onExit }) => {
  return (
    <div className="victory-container">
      <div class="container">
        <img
          className="trophy-icon"
          src={trophy}
          alt="Trophy"
          width="100"
          height="100"
        />

        <div class="container__star">
          <div class="star-eight"></div>
        </div>
      </div>

      <h2 className="victory-message">Переможець: {winnerName}</h2>
      <button className="exit-button" onClick={onExit}>
        Вийти
      </button>
    </div>
  );
};

export default VictoryModal;
