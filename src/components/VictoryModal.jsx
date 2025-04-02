// import React from "react";
// import styles from "./VictoryModal.module.css"; // Стилі для анімації
// import trophy from "../assets/trophy.png";

// const VictoryModal = ({ winnerName, onExit }) => {
//   return (
//     <div className="victory-container">
//       <div class="container">
//         <img
//           className="trophy-icon"
//           src={trophy}
//           alt="Trophy"
//           width="100"
//           height="100"
//         />

//         <div class="container__star">
//           <div class="star-eight"></div>
//         </div>
//       </div>

//       <h2 className="victory-message">Переможець: {winnerName}</h2>
//       <button className="exit-button" onClick={onExit}>
//         Вийти
//       </button>
//     </div>
//   );
// };

// export default VictoryModal;
import React from "react";
import styles from "./VictoryModal.module.css";
import trophy from "../assets/trophy.png";

const VictoryModal = ({ winnerName, onExit }) => {
  return (
    <div className={styles.victoryContainer}>
      <div className={styles.container}>
        <img
          className={styles.trophyIcon}
          src={trophy}
          alt="Trophy"
          width="100"
          height="100"
        />

        <div className={styles.containerStar}>
          <div className={styles.starEight}></div>
        </div>
      </div>

      <h2 className={styles.victoryMessage}>Переможець: {winnerName}</h2>

      <button className={styles.exitButton} onClick={onExit}>
        Вийти
      </button>
    </div>
  );
};

export default VictoryModal;
