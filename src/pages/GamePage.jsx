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
  const [guessInput, setGuessInput] = useState("");
  const [status, setStatus] = useState("playing");
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const playerRef = ref(db, `gameRooms/${roomId}/players/${uid}`);
    onValue(playerRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.role) setRole(data.role);
    });

    const roomRef = ref(db, `gameRooms/${roomId}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.currentTurn) setTurn(data.currentTurn);
      if (data?.status) setStatus(data.status);
      if (data?.winner) setWinner(data.winner);
    });

    const randomChar =
      characters[Math.floor(Math.random() * characters.length)];
    setMyCharacter(randomChar);
    set(
      ref(db, `gameRooms/${roomId}/players/${uid}/character`),
      randomChar.name
    );
  }, [roomId]);

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
  const handleGuess = async () => {
    const snapshot = await get(ref(db, `gameRooms/${roomId}/players`));
    const players = snapshot.val();

    // просто працюємо тільки з value
    const opponentData = Object.values(players).find(
      (data) => data.role !== role
    );
    if (!opponentData) return;

    if (
      guessInput.trim().toLowerCase() === opponentData.character.toLowerCase()
    ) {
      await update(ref(db, `gameRooms/${roomId}`), {
        status: "finished",
        winner: role,
      });
    } else {
      alert("Невірно. Продовжуй гру!");
    }
    setGuessInput("");
  };

  if (status === "finished") {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Гра завершена! Переможець:{" "}
          {winner === role ? "Ти! 🎉" : "Твій суперник 😢"}
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
      <h2 className="text-xl font-semibold mb-2">
        {role ? `Ви — ${role}` : "Завантаження ролі..."}
      </h2>
      <h2 className="text-sm text-gray-500 mb-2">
        Код кімнати:{" "}
        <span className="font-mono bg-gray-200 px-2 py-1 rounded">
          {roomId}
        </span>
      </h2>
      <div className="flex flex-col items-center gap-2 mb-4">
        <span className="text-lg font-medium">
          Твій персонаж: {myCharacter?.name}
        </span>
        <img
          src={myCharacter?.img}
          alt={myCharacter?.name}
          className=" h-25 object-contain border rounded"
        />
      </div>

      <h4 className="mb-4 text-green-600 font-medium">
        {isMyTurn ? "Твій хід" : "Хід суперника"}
      </h4>
      <div className="grid grid-cols-4 gap-4">
        {characters.map((char) => (
          <div
            key={char.id}
            className={`border rounded  text-center cursor-pointer transition ${
              excluded.includes(char.id)
                ? "opacity-30 grayscale"
                : "hover:scale-105"
            }`}
            onClick={() => isMyTurn && toggleExcluded(char.id)}
          >
            <img
              src={char.img}
              alt={char.name}
              className="w-full h-30 object-contain "
            />
          </div>
        ))}
      </div>
      {isMyTurn && (
        <>
          <button
            className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={endTurn}
          >
            Завершити хід
          </button>
          <div className="mt-6 flex flex-col items-start">
            <input
              type="text"
              placeholder="Я знаю хто..."
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              className="border p-2 mb-2 w-60"
            />
            <button
              onClick={handleGuess}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Перевірити відповідь
            </button>
          </div>
        </>
      )}
    </div>
  );
}
