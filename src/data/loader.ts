// Data loader - imports JSON files from the data directory
import type { GemsData, AreasData, CharactersData, QuestsData } from '../types';

// Import JSON files (Vite handles this automatically)
import gemsJson from '../../data/json/gems.json';
import areasJson from '../../data/json/areas.json';
import charactersJson from '../../data/json/characters.json';
import questsJson from '../../data/json/quests.json';

// Type-safe exports (using assertions for JSON data that's known to be correct at runtime)
export const gems: GemsData = gemsJson as unknown as GemsData;
export const areas: AreasData = areasJson as unknown as AreasData;
export const characters: CharactersData = charactersJson as unknown as CharactersData;
export const quests: QuestsData = questsJson as unknown as QuestsData;

// Helper functions to work with the data

export function getGemByName(name: string) {
  return Object.values(gems).find(gem => gem.name === name);
}

export function getGemById(id: string) {
  return gems[id];
}

export function getAreaById(id: string) {
  return areas[id];
}

export function getQuestById(id: string) {
  return quests[id];
}

export function getAreasByAct(act: number) {
  return Object.values(areas).filter(area => area.act === act);
}

export function getTownAreas() {
  return Object.values(areas).filter(area => area.is_town_area);
}
