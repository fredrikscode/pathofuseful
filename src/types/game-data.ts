// Core game data types based on the JSON files

export type CharacterClass =
  | 'Marauder'
  | 'Witch'
  | 'Scion'
  | 'Ranger'
  | 'Duelist'
  | 'Shadow'
  | 'Templar';

export type GemAttribute = 'strength' | 'dexterity' | 'intelligence';

export interface Gem {
  id: string;
  name: string;
  primary_attribute: GemAttribute;
  required_level: number;
  is_support: boolean;
}

export interface Area {
  id: string;
  name: string;
  map_name: string | null;
  act: number;
  level: number;
  has_waypoint: boolean;
  is_town_area: boolean;
  parent_town_area_id: string;
  connection_ids: string[];
  crafting_recipes: string[];
}

export interface CharacterInfo {
  start_gem_id: string;
  chest_gem_id: string;
}

export interface QuestRewardOffer {
  quest_npc: string;
  quest?: Record<string, {
    classes: CharacterClass[];
  }>;
  vendor?: Record<string, {
    classes: CharacterClass[];
    cost?: number;
  }>;
}

export interface Quest {
  id: string;
  name: string;
  act: string;
  reward_offers: Record<string, QuestRewardOffer>;
}

// Collections (these will be loaded from JSON files)
export type GemsData = Record<string, Gem>;
export type AreasData = Record<string, Area>;
export type CharactersData = Record<CharacterClass, CharacterInfo>;
export type QuestsData = Record<string, Quest>;
