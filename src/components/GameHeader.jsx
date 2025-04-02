export default function GameHeader({
  myName,
  role,
  opponentName,
  roomId,
  myCharacter,
  onExitClick,
}) {
  return (
    <div className="flex justify-between  ">
      <div>
        <div className="flex  ">
          <button
            className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
            onClick={() => onExitClick(true)}
          >
            Вийти з гри
          </button>
        </div>
        <h2 className="text-sm text-gray-500 mb-1">
          Код кімнати: <span className="font-mono">{roomId}</span>
        </h2>
        <h2 className="text-xl font-semibold mb-1">Ви — {myName}</h2>
        <h3 className="text-md mb-2 text-gray-600">
          Суперник: {opponentName || "Очікуємо..."}
        </h3>
      </div>

      <div className="flex flex-col items-center ">
        <span className="text-lg font-medium">Твій персонаж:</span>
        <img
          src={myCharacter?.img}
          alt={myCharacter?.name}
          className="h-27 object-contain border rounded"
        />
        <p>{myCharacter?.name}</p>
      </div>
    </div>
  );
}
