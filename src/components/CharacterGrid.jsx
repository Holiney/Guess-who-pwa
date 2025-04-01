import React from "react";
import CharacterCard from "./CharacterCard";

export default function CharacterGrid({
  characters,
  excluded,
  isGuessMode,
  isMyTurn,
  handleGuess,
  toggleExcluded,
}) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {characters.map((char) => (
        <CharacterCard
          key={char.id}
          character={char}
          isExcluded={excluded.includes(char.id)}
          isGuessMode={isGuessMode}
          isMyTurn={isMyTurn}
          onClick={(action, character) => {
            if (action === "guess") handleGuess(character.name);
            else if (action === "exclude") toggleExcluded(character.id);
          }}
        />
      ))}
    </div>
  );
}
