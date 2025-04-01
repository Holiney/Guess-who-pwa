import React from "react";
import styles from "./CharacterCard.module.css";

export default function CharacterCard({
  character,
  isExcluded,
  isGuessMode,
  isMyTurn,
  onClick,
}) {
  const handleClick = () => {
    if (!isMyTurn || isExcluded) return;

    if (isGuessMode) {
      onClick("guess", character);
    } else {
      onClick("exclude", character);
    }
  };

  return (
    <div className={styles.flipCard} onClick={handleClick}>
      <div className={`${styles.inner} ${isExcluded ? styles.flipped : ""}`}>
        <div className={styles.front}>
          <img
            src={character.img}
            alt={character.name}
            className="w-full h-full object-contain rounded"
          />
        </div>
        <div className={styles.back}>
          <span>?</span>
        </div>
      </div>
    </div>
  );
}
