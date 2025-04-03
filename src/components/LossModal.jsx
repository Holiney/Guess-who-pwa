import React from "react";
import "./LossModal.css";
import sadFace from "../assets/loss.png";
import tear from "../assets/tear.png";

export default function LossModal({ onExit }) {
  return (
    <div className="overlay">
      <div className="modal">
        <div className="faceWrapper">
          <img src={sadFace} alt="loss" className="face" />
          <img src={tear} alt="Tear" className="tear" />
        </div>
        <h2 className="title">Ти програв...</h2>
        <button className="button" onClick={onExit}>
          Спробувати ще
        </button>
      </div>
    </div>
  );
}
