import { useState } from 'react';
import { useProgressStore } from '../store/progress-store';

interface RecipeItem {
  name: string;
  rarity?: 'normal' | 'magic' | 'rare' | 'unique' | 'currency' | 'gem';
  color?: 'red' | 'green' | 'blue';
}

interface Recipe {
  name: string;
  inputs: (RecipeItem | string)[];
  outputs: (RecipeItem | string)[];
  note?: string;
}

// Component to display an item with icon and tooltip
function RecipeItemDisplay({ item }: { item: RecipeItem | string }) {
  if (typeof item === 'string') {
    return <span className="text-text-secondary">{item}</span>;
  }

  const getItemIconUrl = (name: string) => {
    const wikiName = name.replace(/ /g, '_');
    return `https://www.poewiki.net/wiki/Special:Redirect/file/${wikiName}_inventory_icon.png`;
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'normal': return 'text-white';
      case 'magic': return 'text-blue-400';
      case 'rare': return 'text-yellow-400';
      case 'unique': return 'text-orange-400';
      case 'currency': return 'text-amber-300';
      case 'gem': return item.color === 'red' ? 'text-red-400' : item.color === 'green' ? 'text-green-400' : item.color === 'blue' ? 'text-blue-400' : 'text-white';
      default: return 'text-text-secondary';
    }
  };

  return (
    <span className="relative group inline-flex items-center gap-1">
      <img
        src={getItemIconUrl(item.name)}
        alt={item.name}
        className="w-6 h-6 inline-block rounded border border-border-secondary"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <span className={`${getRarityColor(item.rarity)} font-medium`}>{item.name}</span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-bg-tertiary border border-border-primary rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
        <span className={getRarityColor(item.rarity)}>{item.name}</span>
      </div>
    </span>
  );
}

export function VendorRecipes() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { favoritedRecipes, toggleFavoriteRecipe } = useProgressStore();

  const recipes: Recipe[] = [
    {
      name: "Resistance Rings",
      inputs: [
        { name: "Iron Ring", rarity: 'normal' },
        '+',
        { name: "Any Skill Gem", rarity: 'gem', color: 'red' }
      ],
      outputs: [{ name: "Ring with +Resistance", rarity: 'magic' }],
      note: "Red/Green/Blue gem adds Fire/Cold/Lightning resistance"
    },
    {
      name: "Chromatic Orb",
      inputs: ["Item with R-G-B sockets"],
      outputs: [{ name: "Chromatic Orb", rarity: 'currency' }],
      note: "Sockets can be linked or unlinked"
    },
    {
      name: "6-Socket Item",
      inputs: ["Item with 6 sockets"],
      outputs: [{ name: "Jeweller's Orb", rarity: 'currency' }, "(7x)"],
      note: "Good currency while leveling"
    },
    {
      name: "Movement Speed Boots",
      inputs: [
        { name: "Normal boots", rarity: 'normal' },
        '+',
        { name: "Quicksilver Flask", rarity: 'normal' },
        '+',
        { name: "Orb of Augmentation", rarity: 'currency' }
      ],
      outputs: ["Boots with 10% Movement Speed"],
      note: "Repeatable up to 30% movement speed"
    },
    {
      name: "Minion Helm +1",
      inputs: [
        { name: "Bone Helmet", rarity: 'magic' },
        '+',
        "Life Flask of Animation",
        '+',
        { name: "Orb of Alteration", rarity: 'currency' }
      ],
      outputs: ["Helm with +1 to Level of Socketed Minion Gems"],
      note: "Flask of Animation = Bone Spirit Shield + Greater Life Flask"
    }
  ];

  // Sort recipes: favorites first, then alphabetically
  const sortedRecipes = [...recipes].sort((a, b) => {
    const aFav = favoritedRecipes.has(a.name);
    const bFav = favoritedRecipes.has(b.name);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="bg-bg-secondary rounded-lg p-3 border border-border-primary">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">⚗️</span>
          <h3 className="text-sm font-bold">Vendor Recipes</h3>
        </div>
        <span className="text-text-tertiary text-sm">{isExpanded ? '−' : '+'}</span>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-border-primary space-y-3">
          {sortedRecipes.map((recipe, idx) => {
            const isFavorited = favoritedRecipes.has(recipe.name);
            return (
              <div key={idx} className="bg-bg-primary rounded p-3 text-xs border border-border-primary/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-blue-300">{recipe.name}</div>
                  <button
                    onClick={() => toggleFavoriteRecipe(recipe.name)}
                    className="text-lg hover:scale-110 transition-transform"
                    title={isFavorited ? "Unfavorite" : "Favorite"}
                  >
                    {isFavorited ? '⭐' : '☆'}
                  </button>
                </div>

                {/* Inputs */}
                <div className="mb-2">
                  <div className="text-[10px] text-text-tertiary mb-1">INPUT:</div>
                  <div className="flex flex-wrap items-center gap-1">
                    {recipe.inputs.map((item, i) => (
                      <RecipeItemDisplay key={i} item={item} />
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-center text-text-tertiary my-1">↓</div>

                {/* Outputs */}
                <div className="mb-2">
                  <div className="text-[10px] text-text-tertiary mb-1">OUTPUT:</div>
                  <div className="flex flex-wrap items-center gap-1">
                    {recipe.outputs.map((item, i) => (
                      <RecipeItemDisplay key={i} item={item} />
                    ))}
                  </div>
                </div>

                {/* Note */}
                {recipe.note && (
                  <div className="text-text-tertiary italic text-xs mt-2 pt-2 border-t border-border-secondary/50">
                    💡 {recipe.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
