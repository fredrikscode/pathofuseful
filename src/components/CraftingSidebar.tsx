import { useState } from 'react';
import type { CraftingRecommendation } from '../types';

interface Props {
  recommendations: CraftingRecommendation[];
  currentLevel?: number;
}

export function CraftingSidebar({ recommendations, currentLevel = 1 }: Props) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Find the most relevant recommendation based on current level
  const currentRec = recommendations.find(rec =>
    currentLevel >= rec.level &&
    (recommendations.find(r => r.level > rec.level && currentLevel >= r.level) === undefined)
  ) || recommendations[0];

  const slotIcons: Record<string, string> = {
    weapon: '⚔️',
    offhand: '🛡️',
    helmet: '🪖',
    body_armour: '🦺',
    gloves: '🧤',
    boots: '👢',
    belt: '📿',
    amulet: '📿',
    ring: '💍'
  };

  return (
    <div className="bg-bg-secondary rounded-lg p-3 border border-border-primary">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🔨</span>
          <h2 className="text-sm font-bold">Crafting Guide</h2>
        </div>
        <span className="text-text-tertiary text-sm">{isExpanded ? '−' : '+'}</span>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-border-primary">

      {/* Current Level Indicator */}
      <div className="bg-bg-tertiary rounded p-3 mb-4 border border-border-secondary">
        <div className="text-xs text-text-tertiary mb-1">Current Focus</div>
        <div className="font-bold text-blue-300">Level {currentRec.level} (Act {currentRec.act})</div>
      </div>

      {/* Timeline of all recommendations */}
      <div className="space-y-2">
        {recommendations.map((rec) => {
          const isExpanded = expandedLevel === rec.level;
          const isCurrent = rec.level === currentRec.level;
          const isPast = currentLevel > rec.level;

          return (
            <div
              key={rec.level}
              className={`
                rounded border-l-4 transition
                ${isCurrent ? 'border-blue-500 bg-bg-tertiary' : ''}
                ${isPast ? 'border-green-500 bg-bg-secondary opacity-60' : ''}
                ${!isCurrent && !isPast ? 'border-border-secondary bg-bg-secondary' : ''}
              `}
            >
              <button
                onClick={() => setExpandedLevel(isExpanded ? null : rec.level)}
                className="w-full p-3 text-left hover:bg-border-primary transition rounded"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">Level {rec.level}</span>
                  <span className="text-xs text-text-tertiary">Act {rec.act}</span>
                </div>
                <div className="text-xs text-text-tertiary mb-2">{rec.notes}</div>

                {/* Compact gear list */}
                <div className="flex flex-wrap gap-1">
                  {rec.gearRecommendations.map((gear, idx) => (
                    <span
                      key={idx}
                      className={`
                        text-xs px-1.5 py-0.5 rounded
                        ${gear.priority === 'high' ? 'bg-red-900 text-red-200' : ''}
                        ${gear.priority === 'medium' ? 'bg-yellow-900 text-yellow-200' : ''}
                        ${gear.priority === 'low' ? 'bg-gray-700 text-gray-300' : ''}
                      `}
                      title={gear.slot}
                    >
                      {slotIcons[gear.slot]}
                    </span>
                  ))}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-border-primary mt-2 pt-2">
                  <div className="mb-3">
                    <div className="text-xs text-text-tertiary mb-1">Currency Priority:</div>
                    <div className="flex flex-wrap gap-1">
                      {rec.currencyPriority.map((currency, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-border-primary px-2 py-0.5 rounded"
                        >
                          {idx + 1}. {currency}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {rec.gearRecommendations.map((gear, idx) => (
                      <div key={idx} className="bg-bg-primary rounded p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <span>{slotIcons[gear.slot]}</span>
                          <span className="text-xs font-semibold capitalize">
                            {gear.slot.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-blue-300 mb-1">{gear.baseItem}</div>
                        {gear.craftingSteps && gear.craftingSteps.length > 0 && (
                          <div className="text-xs text-text-tertiary space-y-0.5">
                            {gear.craftingSteps.map((step, sIdx) => (
                              <div key={sIdx}>
                                {step.order}. {step.currency}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
        </div>
      )}
    </div>
  );
}
