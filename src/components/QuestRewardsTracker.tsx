import { useState, useEffect } from 'react';
import { getRelevantQuestRewards, type QuestReward } from '../utils/quest-rewards';
import { useProgressStore } from '../store/progress-store';

// Load gem data
let gemsData: Record<string, { name: string; primary_attribute: string }> | null = null;

async function loadGemsData() {
  if (!gemsData) {
    const response = await fetch('/src/data/gems.json');
    gemsData = await response.json();
  }
  return gemsData;
}

function getGemColorClass(gemName: string, gemsData: Record<string, { name: string; primary_attribute: string }> | null): string {
  if (!gemsData) return 'text-gray-300';

  const name = gemName.toLowerCase();
  for (const gem of Object.values(gemsData)) {
    if (gem.name.toLowerCase() === name) {
      const attr = gem.primary_attribute;
      if (attr === 'strength') return 'text-red-400';
      if (attr === 'dexterity') return 'text-green-400';
      if (attr === 'intelligence') return 'text-blue-400';
      return 'text-gray-300';
    }
  }

  return 'text-gray-300';
}

export function QuestRewardsTracker() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [questRewards, setQuestRewards] = useState<QuestReward[]>([]);
  const [gemColors, setGemColors] = useState<Record<string, string>>({});
  const { build } = useProgressStore();

  useEffect(() => {
    if (build) {
      getRelevantQuestRewards(build, build.characterClass).then(setQuestRewards);

      // Load gem data and calculate colors
      loadGemsData().then(data => {
        const colors: Record<string, string> = {};
        build.configs.forEach(config => {
          config.gems.forEach(gem => {
            colors[gem] = getGemColorClass(gem, data);
          });
        });
        setGemColors(colors);
      });
    } else {
      setQuestRewards([]);
      setGemColors({});
    }
  }, [build]);

  return (
    <div className="bg-bg-secondary rounded-lg p-3 border border-border-primary">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">💎</span>
          <h3 className="text-sm font-bold">Quest Gem Rewards</h3>
        </div>
        <div className="flex items-center gap-2">
          {questRewards.length > 0 && <span className="text-xs text-text-tertiary">{questRewards.length}</span>}
          <span className="text-text-tertiary text-sm">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>

      {isExpanded && (
        !build || questRewards.length === 0 ? (
          <div className="mt-3 pt-3 border-t border-border-primary text-xs text-text-tertiary text-center py-4">
            {!build ? 'Import a PoB build to see relevant gem rewards' : 'No quest rewards found for your build'}
          </div>
        ) : (
        <div className="mt-3 pt-3 border-t border-border-primary space-y-1">
          {questRewards.map((quest, idx) => {
            // Create gem icon URLs using poewiki.net
            const getGemIconUrl = (gemName: string) => {
              // Replace spaces with underscores for wiki URLs
              const wikiName = gemName.replace(/ /g, '_');
              return `https://www.poewiki.net/wiki/Special:Redirect/file/${wikiName}_inventory_icon.png`;
            };

            const gemIcons = quest.gems.map(gem => ({
              name: gem,
              iconUrl: getGemIconUrl(gem),
              colorClass: gemColors[gem] || 'text-gray-300'
            }));

            return (
              <div
                key={idx}
                className="bg-bg-primary rounded p-2 text-xs hover:bg-bg-secondary transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold text-theme-quest">{quest.questName}</div>
                      <div className="text-text-tertiary text-xs">{quest.act}</div>
                    </div>
                    <div className="text-text-secondary text-xs">
                      <span className="text-yellow-400">{quest.isVendor ? '💰' : '💬'}</span> {quest.npc}
                    </div>
                  </div>

                  {/* Gem Icons */}
                  <div className="flex flex-wrap gap-0.5 max-w-[140px] justify-end">
                    {gemIcons.map((gem, gemIdx) => (
                      <div key={gemIdx} className="relative group">
                        <img
                          src={gem.iconUrl}
                          alt={gem.name}
                          className="w-6 h-6 rounded border border-border-secondary"
                          onError={(e) => {
                            // Fallback to colored dot if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full right-0 mb-1 px-2 py-1 bg-bg-tertiary border border-border-primary rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                          <span className={gem.colorClass}>{gem.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )
      )}
    </div>
  );
}
