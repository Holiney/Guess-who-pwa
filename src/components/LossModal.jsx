import React from "react";
import "./LossModal.css";
import sadFace from "../assets/loss.png";
import tear from "../assets/tear.png";

export default function LossModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div class="overlay">
      <div class="modal">
        <div class="faceWrapper">
          <img src={sadFace} alt="loss" class="face" />
          <img src={tear} alt="Tear" class="tear" />
        </div>
        <h2 class="title">Ти програв...</h2>
        <button class="button" onClick={onClose}>
          Спробувати ще
        </button>
      </div>
    </div>
  );
}
