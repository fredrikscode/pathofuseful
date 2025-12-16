import type { Fragment } from '../types';
import { getAreaById, getQuestById } from '../data/loader';
import {
  WaypointIcon,
  QuestIcon,
  PortalIcon,
  TownIcon,
  TrialIcon,
  BossIcon,
  ArenaIcon,
  LogoutIcon,
  DirectionArrow,
  EnterAreaIcon,
} from './icons/GameIcons';
import { useProgressStore } from '../store/progress-store';
import { useState, useEffect } from 'react';

// Load gem data
let gemsDataCache: Record<string, { name: string }> | null = null;

async function loadGemsData() {
  if (!gemsDataCache) {
    const response = await fetch('/src/data/gems.json');
    gemsDataCache = await response.json();
  }
  return gemsDataCache;
}

interface Props {
  fragment: Fragment;
  allFragments?: Fragment[]; // All fragments in the step for context
  currentAreaId?: string | null; // Current area from previous enter fragments
}

// Helper to show area with level
function AreaDisplay({ areaId }: { areaId: string }) {
  const area = getAreaById(areaId);
  if (!area) return <span className="text-gray-400">{areaId}</span>;

  const minLevel = area.is_town_area ? null : Math.max(1, area.level - (3 + Math.floor(area.level / 16)));

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold text-theme-area">{area.name}</span>
      {minLevel && (
        <span className="text-xs bg-border-secondary px-1.5 py-0.5 rounded text-text-secondary">
          {minLevel}
        </span>
      )}
      {area.is_town_area && (
        <TownIcon className="text-green-400" size={16} />
      )}
    </span>
  );
}

export function FragmentDisplay({ fragment, allFragments, currentAreaId }: Props) {
  const { type, params } = fragment;
  const { build } = useProgressStore();
  const [gemsData, setGemsData] = useState<Record<string, { name: string }> | null>(null);

  useEffect(() => {
    loadGemsData().then(setGemsData);
  }, []);

  switch (type) {
    case 'enter': {
      return (
        <span className="inline-flex items-center gap-2">
          <EnterAreaIcon className="text-theme-waypoint flex-shrink-0" size={18} />
          <AreaDisplay areaId={params[0]} />
        </span>
      );
    }

    case 'waypoint': {
      // If no params, just show the waypoint icon
      if (params.length === 0) {
        return (
          <span className="inline-flex items-center gap-2">
            <WaypointIcon className="text-theme-waypoint flex-shrink-0" size={18} />
          </span>
        );
      }
      // Otherwise show waypoint to area
      return (
        <span className="inline-flex items-center gap-2">
          <WaypointIcon className="text-theme-waypoint flex-shrink-0" size={18} />
          <span className="text-theme-waypoint">to</span>
          <AreaDisplay areaId={params[0]} />
        </span>
      );
    }

    case 'waypoint_get':
      return (
        <span className="inline-flex items-center gap-2">
          <WaypointIcon className="text-theme-waypoint flex-shrink-0" size={18} />
          <span className="text-theme-waypoint font-semibold">Get Waypoint</span>
        </span>
      );

    case 'kill': {
      const bossName = params[0];
      return (
        <span className="inline-flex items-center gap-2">
          <BossIcon className="text-theme-enemy flex-shrink-0" size={18} />
          <span className="text-theme-enemy font-semibold">{bossName}</span>
        </span>
      );
    }

    case 'quest': {
      const questId = params[0];
      const quest = getQuestById(questId);

      // Get NPC names from reward offers
      const rewardOfferId = params[1] || questId;
      const rewardOffer = quest?.reward_offers[rewardOfferId];
      const npcName = rewardOffer?.quest_npc;

      // Check if this quest has gems from the build
      const availableGems: string[] = [];
      if (build && rewardOffer && gemsData) {
        // Get all gems needed from build
        const neededGems = new Set<string>();
        build.configs.forEach(config => {
          config.gemLinks?.forEach(link => {
            link.gems.forEach(gem => {
              neededGems.add(gem.name.toLowerCase());
            });
          });
        });

        // Check vendor gems (these are purchasable)
        if (rewardOffer.vendor) {
          Object.entries(rewardOffer.vendor as any).forEach(([metadataId, gemInfo]: [string, any]) => {
            if (!gemInfo.classes || gemInfo.classes.length === 0 || gemInfo.classes.includes(build.characterClass)) {
              // Get gem name from gems data
              const gemData = gemsData[metadataId];
              if (gemData && neededGems.has(gemData.name.toLowerCase())) {
                availableGems.push(gemData.name);
              }
            }
          });
        }
      }

      return (
        <span className="inline-flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-2">
            <QuestIcon className="text-theme-quest flex-shrink-0" size={18} />
            <span className="text-theme-quest font-semibold">{quest?.name || questId}</span>
            {npcName && (
              <span className="text-text-tertiary text-sm">- {npcName}</span>
            )}
          </span>
          {availableGems.length > 0 && (
            <span
              className="inline-flex items-center gap-1 text-xs bg-purple-900/30 border border-purple-500/50 px-2 py-0.5 rounded cursor-help"
              title={`Buy from ${npcName || 'vendor'}: ${availableGems.join(', ')}`}
            >
              <span className="text-purple-300">💎 {availableGems.join(', ')}</span>
            </span>
          )}
        </span>
      );
    }

    case 'quest_text': {
      const item = params[0];
      return (
        <span className="text-theme-quest-text font-medium">
          {item}
        </span>
      );
    }

    case 'logout':
      return (
        <span className="inline-flex items-center gap-2">
          <LogoutIcon className="text-gray-400 flex-shrink-0" size={18} />
          <span className="text-gray-300 font-medium">Logout</span>
        </span>
      );

    case 'portal': {
      // If no params, just show the portal icon
      if (params.length === 0) {
        return (
          <span className="inline-flex items-center gap-2">
            <PortalIcon className="text-theme-portal flex-shrink-0" size={18} />
          </span>
        );
      }
      const action = params[0] === 'set' ? 'Set Portal' : 'Use Portal';
      return (
        <span className="inline-flex items-center gap-2">
          <PortalIcon className="text-theme-portal flex-shrink-0" size={18} />
          <span className="text-theme-portal font-semibold">{action}</span>
        </span>
      );
    }

    case 'arena': {
      const arenaName = params[0];
      return (
        <span className="inline-flex items-center gap-2">
          <ArenaIcon className="text-theme-enemy flex-shrink-0" size={18} />
          <span className="text-theme-enemy font-semibold">Enter {arenaName}</span>
        </span>
      );
    }

    case 'trial':
      return (
        <span className="inline-flex items-center gap-2">
          <TrialIcon className="text-theme-trial flex-shrink-0" size={18} />
          <span className="text-theme-trial font-semibold">Complete Trial</span>
        </span>
      );

    case 'dir': {
      const degrees = parseInt(params[0]);
      return (
        <span className="inline-flex items-center gap-1">
          <DirectionArrow degrees={degrees} className="text-amber-400 flex-shrink-0" size={18} />
        </span>
      );
    }

    case 'generic': {
      const text = params[0];
      return <span className="text-gray-300">{text}</span>;
    }

    case 'area': {
      // For when we just want to show an area name
      return <AreaDisplay areaId={params[0]} />;
    }

    case 'crafting': {
      // Look for the area in params, current step's enter fragment, or from currentAreaId context
      const areaId = params[0] || allFragments?.find(f => f.type === 'enter')?.params[0] || currentAreaId;

      if (!areaId) {
        return (
          <span className="inline-flex items-center gap-2">
            <span className="text-orange-400 flex-shrink-0" style={{ fontSize: '18px' }}>🔨</span>
            <span className="text-orange-400 font-medium">Crafting Recipe</span>
          </span>
        );
      }

      const area = getAreaById(areaId);
      const recipes = area?.crafting_recipes || [];

      if (recipes.length === 0) {
        return (
          <span className="inline-flex items-center gap-2">
            <span className="text-orange-400 flex-shrink-0" style={{ fontSize: '18px' }}>🔨</span>
            <span className="text-orange-400 font-medium">Crafting Recipe</span>
          </span>
        );
      }

      return (
        <span className="inline-flex items-center gap-2">
          <span className="text-orange-400 flex-shrink-0" style={{ fontSize: '18px' }}>🔨</span>
          <span className="text-orange-400 font-medium">{recipes.join(', ')}</span>
        </span>
      );
    }

    default:
      return <span className="text-gray-500">{fragment.rawText}</span>;
  }
}
