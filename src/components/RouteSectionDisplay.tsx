import type { RouteSection } from '../types';
import { RouteStepDisplay } from './RouteStepDisplay';
import { useProgressStore } from '../store/progress-store';

interface Props {
  section: RouteSection;
  sectionIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RouteSectionDisplay({ section, sectionIndex, isExpanded, onToggle }: Props) {
  const { completedSteps, toggleStep, toggleAllSteps, lookaheadSteps, lookaheadHideSteps } = useProgressStore();

  const sectionCompletedSteps = completedSteps.get(sectionIndex) || new Set();

  // Calculate how many uncompleted steps have been seen so far
  const getUncompletedStepsBeforeIndex = (stepIndex: number): number => {
    let count = 0;
    for (let i = 0; i < stepIndex; i++) {
      if (!sectionCompletedSteps.has(i)) {
        count++;
      }
    }
    return count;
  };

  const handleToggle = (stepIndex: number) => {
    toggleStep(sectionIndex, stepIndex, section.steps);
  };

  const handleToggleAll = () => {
    toggleAllSteps(sectionIndex, section.steps.length);
  };

  const completionPercentage = Math.round((sectionCompletedSteps.size / section.steps.length) * 100);
  const allCompleted = sectionCompletedSteps.size === section.steps.length;

  return (
    <div className="bg-bg-secondary rounded-lg mb-2 overflow-hidden border border-border-primary">
      {/* Section Header */}
      <div
        className="w-full px-4 py-2 bg-bg-tertiary hover:bg-border-primary transition flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold">{section.title}</span>
          <span className="text-xs text-text-tertiary">
            {sectionCompletedSteps.size} / {section.steps.length}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleAll();
            }}
            className="text-xs px-2 py-0.5 rounded bg-bg-secondary hover:bg-border-primary transition"
            title={allCompleted ? "Unmark all" : "Mark all"}
          >
            {allCompleted ? '✓' : '☐'} All
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-24 bg-bg-primary rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-text-tertiary text-sm">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Steps List */}
      {isExpanded && (
        <div className="p-2">
          {section.steps.map((step, index) => {
            const isCompleted = sectionCompletedSteps.has(index);
            const uncompletedBefore = getUncompletedStepsBeforeIndex(index);

            // Check if we should hide or dim this step
            const isBeyondLookahead = lookaheadSteps !== null && !isCompleted && uncompletedBefore >= lookaheadSteps;

            // If lookaheadHideSteps is enabled, hide:
            // 1. Steps beyond lookahead
            // 2. Completed steps
            if (lookaheadHideSteps && (isBeyondLookahead || isCompleted)) {
              return null;
            }

            const shouldDim = isBeyondLookahead;

            // Track current area by looking at previous enter fragments
            let currentAreaId: string | null = null;
            for (let i = index; i >= 0; i--) {
              const enterFragment = section.steps[i].fragments.find(f => f.type === 'enter');
              if (enterFragment) {
                currentAreaId = enterFragment.params[0];
                break;
              }
            }

            return (
              <RouteStepDisplay
                key={index}
                step={step}
                sectionIndex={sectionIndex}
                stepIndex={index}
                isCompleted={isCompleted}
                isDimmed={shouldDim}
                currentAreaId={currentAreaId}
                onToggle={() => handleToggle(index)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
