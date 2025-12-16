import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RouteSection } from '../types';
import { estimateLevel } from '../utils/level-estimator';
import type { PoBBuild } from '../utils/pob/parser';

interface ProgressState {
  // Map of sectionIndex -> Set of completed step indices
  completedSteps: Map<number, Set<number>>;

  // Map of "sectionIndex-stepIndex" -> note text
  stepNotes: Map<string, string>;

  // Manual level override (null means use auto-estimate)
  manualLevel: number | null;

  // Cached routes for level calculation
  routes: RouteSection[];

  // Imported build data
  build: PoBBuild | null;

  // Lookahead steps (null means show all)
  lookaheadSteps: number | null;

  // Hide steps beyond lookahead (instead of dimming them)
  lookaheadHideSteps: boolean;

  // Favorited vendor recipes (set of recipe names)
  favoritedRecipes: Set<string>;

  // Theme
  theme: 'default' | 'exile-leveling';

  // Actions
  toggleStep: (sectionIndex: number, stepIndex: number, steps?: RouteSection['steps']) => void;
  toggleAllSteps: (sectionIndex: number, totalSteps: number) => void;
  setStepNote: (sectionIndex: number, stepIndex: number, note: string) => void;
  setManualLevel: (level: number | null) => void;
  setRoutes: (routes: RouteSection[]) => void;
  setBuild: (build: PoBBuild | null) => void;
  setLookaheadSteps: (steps: number | null) => void;
  setLookaheadHideSteps: (value: boolean) => void;
  toggleFavoriteRecipe: (recipeName: string) => void;
  setTheme: (theme: 'default' | 'exile-leveling') => void;
  getEstimatedLevel: () => number;
  getCurrentLevel: () => number;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedSteps: new Map(),
      stepNotes: new Map(),
      manualLevel: null,
      routes: [],
      build: null,
      lookaheadSteps: null,
      lookaheadHideSteps: false,
      favoritedRecipes: new Set(),
      theme: 'default',

      toggleStep: (sectionIndex, stepIndex, steps) => {
        set((state) => {
          const newCompleted = new Map(state.completedSteps);
          const sectionSteps = newCompleted.get(sectionIndex) || new Set();
          const newSectionSteps = new Set(sectionSteps);

          const isCurrentlyCompleted = newSectionSteps.has(stepIndex);
          const isSubstep = steps && steps[stepIndex].isSubstep;

          if (isCurrentlyCompleted) {
            // Uncompleting - remove this step and all its substeps
            newSectionSteps.delete(stepIndex);

            // If steps array is provided and this is not a substep, also remove all following substeps
            if (steps && !isSubstep) {
              for (let i = stepIndex + 1; i < steps.length; i++) {
                if (steps[i].isSubstep) {
                  newSectionSteps.delete(i);
                } else {
                  // Stop when we hit the next main step
                  break;
                }
              }
            }
          } else {
            // Completing - mark this step
            newSectionSteps.add(stepIndex);

            // If this is a substep being checked, find and check its parent too
            if (steps && isSubstep) {
              // Find the parent step by going backwards
              for (let i = stepIndex - 1; i >= 0; i--) {
                if (!steps[i].isSubstep) {
                  newSectionSteps.add(i);
                  break;
                }
              }
            }

            // If this is a main step, mark all following substeps
            if (steps && !isSubstep) {
              for (let i = stepIndex + 1; i < steps.length; i++) {
                if (steps[i].isSubstep) {
                  newSectionSteps.add(i);
                } else {
                  // Stop when we hit the next main step
                  break;
                }
              }
            }
          }

          // If unchecking a substep, also uncheck the parent if it was checked
          if (steps && isSubstep && isCurrentlyCompleted) {
            // Find the parent step
            for (let i = stepIndex - 1; i >= 0; i--) {
              if (!steps[i].isSubstep) {
                newSectionSteps.delete(i);
                break;
              }
            }
          }

          newCompleted.set(sectionIndex, newSectionSteps);

          return { completedSteps: newCompleted };
        });
      },

      toggleAllSteps: (sectionIndex, totalSteps) => {
        set((state) => {
          const newCompleted = new Map(state.completedSteps);
          const sectionSteps = newCompleted.get(sectionIndex) || new Set();

          // If all steps are completed, unmark all. Otherwise, mark all
          if (sectionSteps.size === totalSteps) {
            newCompleted.set(sectionIndex, new Set());
          } else {
            const allSteps = new Set(Array.from({ length: totalSteps }, (_, i) => i));
            newCompleted.set(sectionIndex, allSteps);
          }

          return { completedSteps: newCompleted };
        });
      },

      setStepNote: (sectionIndex, stepIndex, note) => {
        set((state) => {
          const newNotes = new Map(state.stepNotes);
          const key = `${sectionIndex}-${stepIndex}`;

          if (note.trim()) {
            newNotes.set(key, note);
          } else {
            newNotes.delete(key);
          }

          return { stepNotes: newNotes };
        });
      },

      setManualLevel: (level) => {
        set({ manualLevel: level });
      },

      setRoutes: (routes) => {
        set({ routes });
      },

      setBuild: (build) => {
        set({ build });
      },

      setLookaheadSteps: (steps) => {
        set({ lookaheadSteps: steps });
      },

      setLookaheadHideSteps: (value) => {
        set({ lookaheadHideSteps: value });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      toggleFavoriteRecipe: (recipeName) => {
        set((state) => {
          const newFavorites = new Set(state.favoritedRecipes);
          if (newFavorites.has(recipeName)) {
            newFavorites.delete(recipeName);
          } else {
            newFavorites.add(recipeName);
          }
          return { favoritedRecipes: newFavorites };
        });
      },

      getEstimatedLevel: () => {
        const state = get();
        return estimateLevel(state.routes, state.completedSteps);
      },

      getCurrentLevel: () => {
        const state = get();
        return state.manualLevel ?? state.getEstimatedLevel();
      },

      resetProgress: () => {
        set({ completedSteps: new Map(), manualLevel: null });
      }
    }),
    {
      name: 'pathofuseful-progress',
      // Custom storage to handle Map serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          const { state } = JSON.parse(str);

          // Convert completed steps back to Map
          if (state.completedSteps) {
            const map = new Map();
            Object.entries(state.completedSteps).forEach(([key, value]) => {
              map.set(parseInt(key), new Set(value as number[]));
            });
            state.completedSteps = map;
          }

          // Convert step notes back to Map
          if (state.stepNotes) {
            const map = new Map();
            Object.entries(state.stepNotes).forEach(([key, value]) => {
              map.set(key, value as string);
            });
            state.stepNotes = map;
          } else {
            state.stepNotes = new Map();
          }

          // Convert favorited recipes back to Set
          if (state.favoritedRecipes) {
            state.favoritedRecipes = new Set(state.favoritedRecipes as string[]);
          } else {
            state.favoritedRecipes = new Set();
          }

          return { state };
        },
        setItem: (name, value) => {
          const { state } = value as { state: ProgressState };

          // Convert Map to object for serialization
          const completedStepsArray: [number, number[]][] = Array.from(state.completedSteps.entries()).map(([key, val]) => [
            key,
            Array.from(val)
          ]);

          const serialized = {
            ...state,
            completedSteps: Object.fromEntries(completedStepsArray),
            stepNotes: Object.fromEntries(state.stepNotes.entries()),
            favoritedRecipes: Array.from(state.favoritedRecipes)
          };

          localStorage.setItem(name, JSON.stringify({ state: serialized }));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);
