import { useState } from 'react';
import type { RouteStep } from '../types';
import { FragmentDisplay } from './FragmentDisplay';
import { useProgressStore } from '../store/progress-store';

interface Props {
  step: RouteStep;
  sectionIndex: number;
  stepIndex: number;
  onToggle?: () => void;
  isCompleted?: boolean;
  isDimmed?: boolean;
  currentAreaId?: string | null;
}

export function RouteStepDisplay({ step, sectionIndex, stepIndex, onToggle, isCompleted = false, isDimmed = false, currentAreaId = null }: Props) {
  const { stepNotes, setStepNote } = useProgressStore();
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const noteKey = `${sectionIndex}-${stepIndex}`;
  const note = stepNotes.get(noteKey) || '';
  return (
    <div
      className={`
        py-1 px-3 rounded cursor-pointer
        ${step.isSubstep ? 'ml-4 text-xs text-text-tertiary' : 'text-sm'}
        ${isCompleted ? 'opacity-50 line-through' : ''}
        ${isDimmed ? 'opacity-30' : ''}
        hover:bg-bg-tertiary transition
      `}
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1 items-center">
            {step.parts.map((part, idx) => (
              part.type === 'text' ? (
                <span key={idx}>{part.content}</span>
              ) : (
                <FragmentDisplay key={idx} fragment={part.content} allFragments={step.fragments} currentAreaId={currentAreaId} />
              )
            ))}

            {/* Note button - only for main steps, only show if note exists or on hover */}
            {!step.isSubstep && (note || isHovered) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingNote(!isEditingNote);
                }}
                className={`text-xs px-1 rounded ${note ? 'text-yellow-400' : 'text-gray-500'} hover:text-yellow-300 transition-opacity ${!note && !isEditingNote ? 'opacity-50' : 'opacity-100'}`}
                title={note || "Add note"}
              >
                📝
              </button>
            )}
          </div>

          {/* Note display/edit */}
          {!step.isSubstep && (isEditingNote || note) && (
            <div className="mt-1" onClick={(e) => e.stopPropagation()}>
              {isEditingNote ? (
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setStepNote(sectionIndex, stepIndex, e.target.value)}
                  onBlur={() => setIsEditingNote(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingNote(false)}
                  placeholder="Add note..."
                  className="w-full text-xs bg-bg-tertiary border border-border-secondary rounded px-2 py-1 focus:border-yellow-500 focus:outline-none"
                  autoFocus
                />
              ) : note ? (
                <div className="text-xs text-yellow-300 italic">📝 {note}</div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
