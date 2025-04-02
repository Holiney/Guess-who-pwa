import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase/config";
import { ref, onValue, set, get, update, remove } from "firebase/database";
import { getCharactersBySet } from "../utils/characters";
import GameHeader from "../components/GameHeader";
import CharacterGrid from "../components/CharacterGrid";
import ExitModal from "../components/ExitModal";
import VictoryModal from "../components/VictoryModal";
import LossModal from "../components/LossModal";

export default function GamePage() {
  const { roomId } = useParams();
  const [myCharacter, setMyCharacter] = useState(null);
  const [excluded, setExcluded] = useState([]);
  const [role, setRole] = useState(null);
  const [turn, setTurn] = useState(null);
  const [status, setStatus] = useState("playing");
  const [winner, setWinner] = useState(null);
  const [myName, setMyName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [isGuessMode, setIsGuessMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [setName, setSetName] = useState("spongebob");
  const isMyTurn = role === turn;

  const [isLossModalOpen, setIsLossModalOpen] = useState(false);

  // Виведення в консоль для перевірки кнопок

  const closeLossModal = () => {
    console.log("Модалка програного закрита");
    setIsLossModalOpen(false); // Закриваємо модалку
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const playerRef = ref(db, `gameRooms/${roomId}/players/${uid}`);
    onValue(playerRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.role) setRole(data.role);
      if (data?.nickname) setMyName(data.nickname);
    });

    const roomRef = ref(db, `gameRooms/${roomId}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.currentTurn) setTurn(data.currentTurn);
      if (data?.status) setStatus(data.status);
      if (data?.winner) setWinner(data.winner);
      if (data?.set) {
        setSetName(data.set); // Оновлюємо набір карток із Firebase
      }

      const players = data?.players || {};
      Object.entries(players).forEach(([_, p]) => {
        if (p.role !== role && p.nickname) {
          setOpponentName(p.nickname);
        }
      });
    });

    const characterList = getCharactersBySet(setName);
    const randomChar =
      characterList[Math.floor(Math.random() * characterList.length)];

    setMyCharacter(randomChar);
    set(
      ref(db, `gameRooms/${roomId}/players/${uid}/character`),
      randomChar.name
    );
  }, [roomId, role, setName]);

  const toggleExcluded = (id) => {
    setExcluded((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const endTurn = async () => {
    const next = role === "player1" ? "player2" : "player1";
    await update(ref(db, `gameRooms/${roomId}`), {
      currentTurn: next,
    });
  };

  const handleGuess = async (guessName) => {
    const snapshot = await get(ref(db, `gameRooms/${roomId}/players`));
    const players = snapshot.val();
    const opponentData = Object.values(players).find(
      (data) => data.role !== role
    );
    if (!opponentData) return;

    if (guessName === opponentData.character) {
      await update(ref(db, `gameRooms/${roomId}`), {
        status: "finished",
        winner: role,
      });
    } else {
      await update(ref(db, `gameRooms/${roomId}`), {
        status: "finished",
        winner: role === "player1" ? "player2" : "player1",
      });

      // Відкриваємо LossModal тільки для програвшого
      setIsLossModalOpen(true);
    }

    setTimeout(() => {
      remove(ref(db, `gameRooms/${roomId}`));
    }, 10000);
  };

  if (status === "finished") {
    const isWinner = winner === role;

    return isWinner ? (
      <VictoryModal
        winnerName={`${myName} (Ти!)`}
        onExit={() => {
          remove(ref(db, `gameRooms/${roomId}`));
          window.location.href = "/";
        }}
      />
    ) : (
      <LossModal
        onExit={() => {
          remove(ref(db, `gameRooms/${roomId}`));
          window.location.href = "/";
        }}
      />
    );
  }

  return (
    <div className="p-4">
      <GameHeader
        myName={myName}
        role={role}
        opponentName={opponentName}
        roomId={roomId}
        myCharacter={myCharacter}
        onExitClick={() => setShowExitConfirm(true)}
      />

      <h4 className="mb-4 text-green-600 font-medium">
        {isMyTurn ? "Твій хід" : "Хід суперника"}
      </h4>

      <CharacterGrid
        characters={getCharactersBySet(setName)} // Передаємо правильний набір карток
        excluded={excluded}
        isGuessMode={isGuessMode}
        isMyTurn={isMyTurn}
        handleGuess={handleGuess}
        toggleExcluded={toggleExcluded}
      />

      {isMyTurn && !isGuessMode && (
        <div className="flex justify-between mt-4">
          <button
            className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={endTurn}
          >
            Завершити хід
          </button>
          <button
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setIsGuessMode(true)}
          >
            Я знаю хто!
          </button>
        </div>
      )}

      {showExitConfirm && (
        <ExitModal
          onCancel={() => setShowExitConfirm(false)}
          onConfirm={() => {
            remove(ref(db, `gameRooms/${roomId}`));
            window.location.href = "/";
          }}
        />
      )}
    </div>
  );
}
