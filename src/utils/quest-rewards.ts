import type { PoBBuild } from './pob/parser';

export interface QuestReward {
  questId: string;
  questName: string;
  act: string;
  npc: string;
  gems: string[]; // Gem names that match the build
  isVendor?: boolean; // True if from vendor, false if from quest reward
}

// Load quest data
let questData: any = null;
let gemData: any = null;

async function loadData() {
  if (!questData) {
    const [questResponse, gemResponse] = await Promise.all([
      fetch('/data/json/quests.json'),
      fetch('/src/data/gems.json')
    ]);
    questData = await questResponse.json();
    gemData = await gemResponse.json();
  }
  return { questData, gemData };
}

// Get gem name from metadata ID
function getGemName(metadataId: string, gems: any): string | null {
  const gem = Object.values(gems).find((g: any) => g.id === metadataId);
  return gem ? (gem as any).name : null;
}

// Get all gems needed from the build (from all configs)
function getGemsFromBuild(build: PoBBuild): Set<string> {
  const gems = new Set<string>();

  // Collect gems from ALL configs, not just the current one
  build.configs.forEach(config => {
    config.gemLinks?.forEach(link => {
      link.gems.forEach(gem => {
        gems.add(gem.name.toLowerCase());
      });
    });
  });

  return gems;
}

// Find quests that reward gems the player needs
export async function getRelevantQuestRewards(build: PoBBuild | null, characterClass: string): Promise<QuestReward[]> {
  if (!build) return [];

  const { questData, gemData } = await loadData();
  const neededGems = getGemsFromBuild(build);
  const relevantQuests: QuestReward[] = [];
  const shownGems = new Set<string>(); // Track gems already shown globally

  Object.entries(questData).forEach(([questId, quest]: [string, any]) => {
    Object.entries(quest.reward_offers || {}).forEach(([, offer]: [string, any]) => {
      const questGems: string[] = [];
      const vendorOnlyGems: string[] = [];
      const questGemSet = new Set<string>();

      // Check quest rewards first
      Object.entries(offer.quest || {}).forEach(([metadataId, gemInfo]: [string, any]) => {
        // Check if this gem is available for the character class
        if (gemInfo.classes && !gemInfo.classes.includes(characterClass)) {
          return;
        }

        const gemName = getGemName(metadataId, gemData);
        const gemNameLower = gemName?.toLowerCase();
        if (gemName && gemNameLower && neededGems.has(gemNameLower) && !shownGems.has(gemNameLower)) {
          questGems.push(gemName);
          questGemSet.add(gemNameLower);
          shownGems.add(gemNameLower);
        }
      });

      // Check vendor rewards - only add if not already in quest rewards or shown before
      Object.entries(offer.vendor || {}).forEach(([metadataId, gemInfo]: [string, any]) => {
        // Check if this gem is available for the character class
        if (gemInfo.classes && gemInfo.classes.length > 0 && !gemInfo.classes.includes(characterClass)) {
          return;
        }

        const gemName = getGemName(metadataId, gemData);
        const gemNameLower = gemName?.toLowerCase();
        if (gemName && gemNameLower && neededGems.has(gemNameLower) && !questGemSet.has(gemNameLower) && !shownGems.has(gemNameLower)) {
          vendorOnlyGems.push(gemName);
          shownGems.add(gemNameLower);
        }
      });

      // Add quest rewards
      if (questGems.length > 0) {
        relevantQuests.push({
          questId,
          questName: quest.name,
          act: quest.act,
          npc: offer.quest_npc || 'Unknown',
          gems: questGems,
          isVendor: false
        });
      }

      // Add vendor-only rewards (gems not available as quest rewards)
      if (vendorOnlyGems.length > 0) {
        relevantQuests.push({
          questId,
          questName: quest.name,
          act: quest.act,
          npc: offer.quest_npc || 'Unknown',
          gems: vendorOnlyGems,
          isVendor: true
        });
      }
    });
  });

  return relevantQuests;
}
