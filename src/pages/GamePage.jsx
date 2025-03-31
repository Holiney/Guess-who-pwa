import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase/config";
import { ref, onValue, set, get, update } from "firebase/database";
import { characters } from "../utils/characters";

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

      const players = data?.players || {};
      Object.entries(players).forEach(([key, p]) => {
        if (p.role !== role && p.nickname) {
          setOpponentName(p.nickname);
        }
      });
    });

    const randomChar =
      characters[Math.floor(Math.random() * characters.length)];
    setMyCharacter(randomChar);
    set(
      ref(db, `gameRooms/${roomId}/players/${uid}/character`),
      randomChar.name
    );
  }, [roomId, role]);

  const toggleExcluded = (id) => {
    setExcluded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const endTurn = async () => {
    const next = role === "player1" ? "player2" : "player1";
    await update(ref(db, `gameRooms/${roomId}`), {
      currentTurn: next,
    });
  };

  const isMyTurn = role === turn;

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
      alert("Невірно. Ти програв.");
      await update(ref(db, `gameRooms/${roomId}`), {
        status: "finished",
        winner: role === "player1" ? "player2" : "player1",
      });
    }
  };

  if (status === "finished") {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Гра завершена!
          <br />
          Переможець: {winner === role ? `${myName} (Ти!)` : opponentName}
        </h2>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          На головну
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-sm text-gray-500 mb-1">
        Код кімнати: <span className="font-mono">{roomId}</span>
      </h2>
      <h2 className="text-xl font-semibold mb-1">
        Ви — {myName} ({role})
      </h2>
      <h3 className="text-md mb-2 text-gray-600">
        Суперник: {opponentName || "Очікуємо..."}
      </h3>

      <div className="flex items-center gap-2 mb-4">
        <img
          src={myCharacter?.img}
          alt={myCharacter?.name}
          className="w-12 h-12 object-contain border rounded"
        />
        <span className="text-lg font-medium">
          Твій персонаж: {myCharacter?.name}
        </span>
      </div>

      <h4 className="mb-4 text-green-600 font-medium">
        {isMyTurn ? "Твій хід" : "Хід суперника"}
      </h4>

      <div className="grid grid-cols-4 gap-4">
        {characters.map((char) => (
          <div
            key={char.id}
            className={`border rounded p-2 text-center cursor-pointer transition ${
              excluded.includes(char.id)
                ? "opacity-30 grayscale"
                : isGuessMode
                ? "ring-2 ring-green-500 scale-105"
                : "hover:scale-105"
            }`}
            onClick={() => {
              if (!isMyTurn) return;

              if (isGuessMode) {
                if (!excluded.includes(char.id)) {
                  handleGuess(char.name);
                }
              } else {
                toggleExcluded(char.id);
              }
            }}
          >
            <img
              src={char.img}
              alt={char.name}
              className="w-full h-24 object-contain mb-1"
            />
            <p className="text-sm font-medium">{char.name}</p>
          </div>
        ))}
      </div>

      {isMyTurn && !isGuessMode && (
        <>
          <button
            className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={endTurn}
          >
            Завершити хід
          </button>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setIsGuessMode(true)}
          >
            Я знаю хто!
          </button>
        </>
      )}
    </div>
  );
}
