import type { GearRecommendation, CraftingStep } from '../types';

interface CraftingStepProps {
  step: CraftingStep;
}

function CraftingStepDisplay({ step }: CraftingStepProps) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="bg-blue-900 text-blue-200 px-2 py-0.5 rounded font-mono text-xs">
        {step.order}
      </span>
      <div className="flex-1">
        <span className="text-yellow-300">{step.currency}</span>
        <span className="text-gray-400"> → </span>
        <span className="text-gray-300">{step.description}</span>
        <div className="text-green-400 text-xs mt-0.5">✓ {step.result}</div>
      </div>
    </div>
  );
}

interface GearCardProps {
  gear: GearRecommendation;
}

function GearCard({ gear }: GearCardProps) {
  const priorityColors = {
    high: 'border-red-500 bg-red-950',
    medium: 'border-yellow-500 bg-yellow-950',
    low: 'border-gray-500 bg-gray-900'
  };

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
    <div className={`border-l-4 ${priorityColors[gear.priority]} p-4 rounded`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{slotIcons[gear.slot]}</span>
          <div>
            <h4 className="font-semibold capitalize">{gear.slot.replace('_', ' ')}</h4>
            <p className="text-xs text-gray-400">Level {gear.level}+</p>
          </div>
        </div>
        <span className={`
          text-xs px-2 py-1 rounded uppercase font-bold
          ${gear.priority === 'high' ? 'bg-red-600' : ''}
          ${gear.priority === 'medium' ? 'bg-yellow-600' : ''}
          ${gear.priority === 'low' ? 'bg-gray-600' : ''}
        `}>
          {gear.priority}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-blue-300 mb-1">Base: {gear.baseItem}</p>
        <div className="space-y-1">
          {gear.stats.map((stat, idx) => (
            <div key={idx} className="text-sm text-green-400">• {stat}</div>
          ))}
        </div>
      </div>

      {gear.craftingSteps && gear.craftingSteps.length > 0 && (
        <div className="border-t border-gray-700 pt-3 mt-3">
          <p className="text-xs text-gray-400 mb-2 font-semibold">Crafting Steps:</p>
          <div className="space-y-2">
            {gear.craftingSteps.map((step, idx) => (
              <CraftingStepDisplay key={idx} step={step} />
            ))}
          </div>
        </div>
      )}

      {gear.notes && (
        <div className="mt-3 text-xs text-gray-400 italic border-l-2 border-gray-700 pl-2">
          💡 {gear.notes}
        </div>
      )}
    </div>
  );
}

interface Props {
  level: number;
  act: number;
  gearRecommendations: GearRecommendation[];
  currencyPriority: string[];
  notes?: string;
}

export function CraftingPanel({ level, act, gearRecommendations, currencyPriority, notes }: Props) {
  return (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg p-6 mb-6 border border-purple-700">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🔨</span>
        <div>
          <h3 className="text-xl font-bold text-purple-100">
            Crafting Milestone - Level {level}
          </h3>
          <p className="text-sm text-purple-300">Act {act} Gear Upgrades</p>
        </div>
      </div>

      {notes && (
        <div className="bg-purple-950 border border-purple-700 rounded p-3 mb-4">
          <p className="text-sm text-purple-200">📝 {notes}</p>
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-purple-300 mb-2">Currency Priority:</h4>
        <div className="flex flex-wrap gap-2">
          {currencyPriority.map((currency, idx) => (
            <span
              key={idx}
              className="bg-purple-800 text-purple-100 px-3 py-1 rounded-full text-xs font-medium"
            >
              {idx + 1}. {currency}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-purple-300">Recommended Upgrades:</h4>
        {gearRecommendations.map((gear, idx) => (
          <GearCard key={idx} gear={gear} />
        ))}
      </div>
    </div>
  );
}
