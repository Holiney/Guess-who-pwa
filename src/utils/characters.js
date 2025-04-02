import { spongebobCharacters } from "./spongeBob";
import { harryPotterCharacters } from "./harryPotter.js";

export const characterSets = {
  spongebob: spongebobCharacters,
  harrypotter: harryPotterCharacters,
};

// функція для отримання потрібного набору
export function getCharactersBySet(setName) {
  return characterSets[setName] || characterSets["spongebob"];
}
