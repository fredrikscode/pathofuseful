import { useState, useEffect } from 'react';
import type { RouteSection } from './types';
import { loadRouteFiles } from './utils/route-parser';
import { RouteSectionDisplay } from './components/RouteSectionDisplay';
import { CraftingSidebar } from './components/CraftingSidebar';
import { LevelTracker } from './components/LevelTracker';
import { BuildImport } from './components/BuildImport';
import { VendorRecipes } from './components/VendorRecipes';
import { QuestRewardsTracker } from './components/QuestRewardsTracker';
import { BotIcon } from './components/icons/BotIcon';
import { levelingGearRecommendations } from './data/crafting/base-recommendations';
import { useProgressStore } from './store/progress-store';

function App() {
  const [routes, setRoutes] = useState<RouteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfigIndex, setSelectedConfigIndex] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0])); // Only Act 1 (index 0) expanded by default
  const { setRoutes: setStoreRoutes, getCurrentLevel, setBuild, build, lookaheadSteps, setLookaheadSteps, lookaheadHideSteps, setLookaheadHideSteps, theme, setTheme } = useProgressStore();

  useEffect(() => {
    const banditChoice = build?.banditChoice || 'KILL_ALL';
    loadRouteFiles(banditChoice)
      .then(sections => {
        setRoutes(sections);
        setStoreRoutes(sections); // Also store in Zustand for level calculation
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [setStoreRoutes, build?.banditChoice]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const currentLevel = getCurrentLevel();

  return (
    <div className="min-h-screen text-text-primary" data-theme={theme}>
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border-primary sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <BotIcon size={48} />
              <div>
                <h1 className="text-3xl font-bold">PathOfUseful</h1>
                <p className="text-text-tertiary text-sm mt-1">
                  Forked from <a href="https://github.com/HeartofPhos/exile-leveling">exile-leveling</a> with added goodies
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Build Import - compact */}
              <BuildImport onImport={setBuild} />

              {/* Build info compact display */}
              {build && (
                <div className="flex items-center gap-2 bg-bg-tertiary border border-border-primary rounded px-2 py-1.5">
                  <span className="text-base">⚔️</span>
                  <div className="text-xs">
                    <div className="font-semibold text-blue-300">{build.characterClass}</div>
                    {build.banditChoice && (
                      <div className="text-text-tertiary text-[10px]">
                        {build.banditChoice === 'KILL_ALL' ? 'Kill All' :
                         build.banditChoice === 'ALIRA' ? 'Alira' :
                         build.banditChoice === 'KRAITYN' ? 'Kraityn' :
                         build.banditChoice === 'OAK' ? 'Oak' : 'Kill All'}
                      </div>
                    )}
                  </div>
                  {build.configs.length > 0 && (() => {
                    const autoConfig = build.configs.find(
                      c => currentLevel >= c.minLevel && currentLevel <= c.maxLevel
                    ) || build.configs[build.configs.length - 1];
                    const autoConfigIndex = build.configs.indexOf(autoConfig);

                    return (
                      <select
                        value={selectedConfigIndex ?? autoConfigIndex}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setSelectedConfigIndex(val === autoConfigIndex ? null : val);
                        }}
                        className="bg-bg-primary border border-border-secondary rounded px-2 py-1 text-[10px] text-text-primary focus:border-blue-500 focus:outline-none"
                        title="Build setup"
                      >
                        {build.configs.map((config, idx) => (
                          <option key={idx} value={idx}>
                            {idx === autoConfigIndex && selectedConfigIndex === null ? '🎯 ' : ''}
                            {config.title}
                          </option>
                        ))}
                      </select>
                    );
                  })()}
                </div>
              )}

              <div className="h-8 w-px bg-border-primary"></div>

              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'default' | 'exile-leveling')}
                className="bg-bg-tertiary border border-border-secondary rounded px-2 py-1.5 text-xs text-text-primary focus:border-blue-500 focus:outline-none"
                title="Theme"
              >
                <option value="default">Default</option>
                <option value="exile-leveling">Exile-Leveling</option>
              </select>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-tertiary whitespace-nowrap">Lookahead:</span>
                  <input
                    type="range"
                    min="3"
                    max="50"
                    value={lookaheadSteps ?? 50}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setLookaheadSteps(val === 50 ? null : val);
                    }}
                    className="w-24 h-1.5 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-xs text-text-secondary w-8 text-right">
                    {lookaheadSteps ?? 'All'}
                  </span>
                </div>
                {lookaheadSteps !== null && (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lookaheadHideSteps}
                      onChange={(e) => setLookaheadHideSteps(e.target.checked)}
                      className="w-3 h-3 rounded cursor-pointer accent-blue-500"
                    />
                    <span className="text-[10px] text-text-tertiary">Hide steps beyond</span>
                  </label>
                )}
              </div>

              <LevelTracker />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-400">Loading routes...</div>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-red-400">No routes found</div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Left sidebar - Crafting & Recipes */}
            <aside className="w-72 flex-shrink-0 space-y-4 sticky top-[120px] self-start max-h-[calc(100vh-140px)] overflow-y-auto hide-scrollbar">
              <CraftingSidebar
                recommendations={levelingGearRecommendations}
                currentLevel={currentLevel}
              />
              <VendorRecipes />
            </aside>

            {/* Main leveling route - takes up most of the space */}
            <div className="flex-1 min-w-0 text-text-primary">
              <div className="space-y-4">
                {routes.map((section, index) => (
                  <RouteSectionDisplay
                    key={index}
                    section={section}
                    sectionIndex={index}
                    isExpanded={expandedSections.has(index)}
                    onToggle={() => toggleSection(index)}
                  />
                ))}
              </div>
            </div>

            {/* Right sidebar - Quest Gems */}
            <aside className="w-80 flex-shrink-0 sticky top-[120px] self-start max-h-[calc(100vh-140px)] overflow-y-auto hide-scrollbar">
              <QuestRewardsTracker />
            </aside>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-primary mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-text-tertiary text-sm">
          <p className="mt-1">Inspired by <a href="https://github.com/HeartofPhos/exile-leveling">exile-leveling</a> (MIT License)</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
