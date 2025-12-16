import { useState } from 'react';
import { useProgressStore } from '../store/progress-store';
import { getCurrentAct } from '../utils/level-estimator';
import { ConfirmModal } from './ConfirmModal';

export function LevelTracker() {
  const { manualLevel, setManualLevel, getEstimatedLevel, getCurrentLevel, resetProgress } = useProgressStore();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  const currentLevel = getCurrentLevel();
  const estimatedLevel = getEstimatedLevel();
  const currentAct = getCurrentAct(currentLevel);
  const isManual = manualLevel !== null;

  const handleEdit = () => {
    setInputValue(currentLevel.toString());
    setIsEditing(true);
  };

  const handleSave = () => {
    const newLevel = parseInt(inputValue);
    if (!isNaN(newLevel) && newLevel >= 1 && newLevel <= 100) {
      setManualLevel(newLevel);
    }
    setIsEditing(false);
  };

  const handleReset = () => {
    setManualLevel(null);
    setIsEditing(false);
  };

  const handleResetAll = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    resetProgress();
    setShowResetModal(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-bg-tertiary border border-border-primary rounded px-3 py-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-base">📊</span>
        <div>
          {isEditing ? (
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleSave}
              className="w-12 bg-bg-primary border border-border-primary rounded px-1 py-0.5 text-xs font-bold"
              autoFocus
              min="1"
              max="100"
            />
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-yellow-400">
                Lv {currentLevel}
              </span>
              <button
                onClick={handleEdit}
                className="text-[10px] text-text-tertiary hover:text-text-secondary"
                title="Edit level"
              >
                ✏️
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-6 w-px bg-border-secondary"></div>

      <div className="text-xs">
        <span className="font-bold text-blue-400">Act {currentAct}</span>
      </div>

      {isManual && (
        <>
          <div className="h-6 w-px bg-border-secondary"></div>
          <button
            onClick={handleReset}
            className="text-[10px] text-blue-400 hover:text-blue-300"
            title={`Auto: ${estimatedLevel}`}
          >
            ↻ Auto
          </button>
        </>
      )}

      <div className="h-6 w-px bg-border-secondary"></div>

      <button
        onClick={handleResetAll}
        className="text-[10px] bg-red-900/50 hover:bg-red-800 text-red-200 px-2 py-1 rounded"
        title="Clear all progress"
      >
        Reset
      </button>

      <ConfirmModal
        isOpen={showResetModal}
        onConfirm={confirmReset}
        onCancel={() => setShowResetModal(false)}
        title="Reset All Progress"
        message="Are you sure you want to reset all progress? This will clear all completed steps and level overrides. This action cannot be undone."
        confirmText="Reset Progress"
        cancelText="Cancel"
      />
    </div>
  );
}
