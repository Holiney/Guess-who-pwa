import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, signIn } from "../firebase/config";
import { ref, set, get, child, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

export default function WelcomePage() {
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!nickname.trim()) {
      alert("Введіть ваш нікнейм");
      return;
    }
    const authUser = await signIn();
    const roomId = uuidv4().slice(0, 4).toUpperCase();
    await set(ref(db, `gameRooms/${roomId}`), {
      createdAt: Date.now(),
      currentTurn: "player1",
      status: "playing",
      players: {
        [authUser.user.uid]: {
          role: "player1",
          nickname: nickname.trim(),
        },
      },
    });
    navigate(`/game/${roomId}`);
  };

  const handleJoin = async () => {
    if (!nickname.trim()) {
      alert("Введіть ваш нікнейм");
      return;
    }
    const authUser = await signIn();
    const uid = authUser.user.uid;
    const snapshot = await get(child(ref(db), `gameRooms/${roomCode}`));
    if (snapshot.exists()) {
      await update(ref(db, `gameRooms/${roomCode}/players/${uid}`), {
        role: "player2",
        nickname: nickname.trim(),
      });
      navigate(`/game/${roomCode}`);
    } else {
      alert("Кімната не знайдена");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Вгадай хто — Guess Who</h1>

      <input
        className="border p-2 mb-2 w-64 text-center"
        placeholder="Ваш нікнейм"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-6 py-2 rounded mb-4"
        onClick={handleCreate}
      >
        Створити гру
      </button>

      <div className="flex gap-2">
        <input
          className="border p-2 w-40 text-center"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          placeholder="Код кімнати"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleJoin}
        >
          Приєднатися
        </button>
      </div>
      <p className="fixed bottom-0 mb-5">v0.24</p>
    </div>
  );
}
