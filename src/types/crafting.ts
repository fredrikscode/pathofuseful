// Crafting and gear recommendation types
// These are NEW types we're adding (not in the original project)

export type ItemSlot =
  | 'weapon'
  | 'offhand'
  | 'helmet'
  | 'body_armour'
  | 'gloves'
  | 'boots'
  | 'belt'
  | 'amulet'
  | 'ring';

export type DamageType =
  | 'physical'
  | 'fire'
  | 'cold'
  | 'lightning'
  | 'chaos';

export type DefenseType =
  | 'armour'
  | 'evasion'
  | 'energy_shield'
  | 'life'
  | 'mana';

export interface CraftingStep {
  order: number;
  currency: string;
  description: string;
  result: string;
}

export interface GearRecommendation {
  slot: ItemSlot;
  level: number;
  baseItem: string;
  priority: 'high' | 'medium' | 'low';
  stats: string[];
  craftingSteps?: CraftingStep[];
  notes?: string;
}

export interface BuildRequirements {
  damageTypes: DamageType[];
  defenseTypes: DefenseType[];
  mainStat: 'strength' | 'dexterity' | 'intelligence';
  secondaryStat?: 'strength' | 'dexterity' | 'intelligence';
  keywords: string[]; // spell, attack, minion, totem, etc.
}

export interface CraftingRecommendation {
  level: number;
  act: number;
  gearRecommendations: GearRecommendation[];
  currencyPriority: string[];
  notes: string;
}
