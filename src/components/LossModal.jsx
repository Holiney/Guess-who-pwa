import React from "react";
import styles from "./LossModal.module.css";
import sadFace from "../assets/loss.png";
import tear from "../assets/tear.png";

export default function LossModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.faceWrapper}>
          <img src={sadFace} alt="loss" className={styles.face} />
          <img src={tear} alt="Tear" className={styles.tear} />
        </div>
        <h2 className={styles.title}>Ти програв...</h2>
        <button className={styles.button} onClick={onClose}>
          Спробувати ще
        </button>
      </div>
    </div>
  );
}
