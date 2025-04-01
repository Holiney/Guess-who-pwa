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

  const cardClass = `${styles.flipCard}`;
  const innerClass = `${styles.inner} ${isExcluded ? styles.flipped : ""}`;
  const frontClass = `${styles.front} ${
    isGuessMode && !isExcluded ? styles.glow : ""
  }`;

  return (
    <div className={cardClass} onClick={handleClick}>
      <div className={innerClass}>
        <div className={frontClass}>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${character.img})` }}
          />
          <p className={styles.name}>{character.name}</p>
        </div>

        <div className={styles.back}>
          <span>?</span>
        </div>
      </div>
    </div>
  );
}
