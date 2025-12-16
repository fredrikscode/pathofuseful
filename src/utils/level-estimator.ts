import type { RouteSection } from '../types';

// Level milestones for each act based on typical progression
// These are approximate levels you'd be at different points
export const actLevelMilestones: Record<number, { start: number; end: number }> = {
  1: { start: 1, end: 12 },
  2: { start: 12, end: 22 },
  3: { start: 22, end: 32 },
  4: { start: 32, end: 36 },
  5: { start: 36, end: 45 },
  6: { start: 45, end: 52 },
  7: { start: 52, end: 59 },
  8: { start: 59, end: 63 },
  9: { start: 63, end: 67 },
  10: { start: 67, end: 70 }
};

/**
 * Estimates character level based on route progress
 */
export function estimateLevel(
  routes: RouteSection[],
  completedSteps: Map<number, Set<number>> // Map of sectionIndex -> Set of completed step indices
): number {
  if (completedSteps.size === 0) {
    return 1;
  }

  let estimatedLevel = 1;

  routes.forEach((section, sectionIndex) => {
    const completed = completedSteps.get(sectionIndex) || new Set();
    const totalSteps = section.steps.length;
    const completedCount = completed.size;

    if (completedCount === 0) {
      return; // Skip this act
    }

    const milestone = actLevelMilestones[section.act];
    if (!milestone) return;

    // Calculate progress through this act (0 to 1)
    const progressThroughAct = completedCount / totalSteps;

    // Interpolate level within the act
    const levelRange = milestone.end - milestone.start;
    const levelInAct = milestone.start + (levelRange * progressThroughAct);

    estimatedLevel = Math.floor(levelInAct);
  });

  return estimatedLevel;
}

/**
 * Get the current act based on estimated level
 */
export function getCurrentAct(level: number): number {
  for (const [act, milestone] of Object.entries(actLevelMilestones)) {
    if (level >= milestone.start && level <= milestone.end) {
      return parseInt(act);
    }
  }
  return level <= 1 ? 1 : 10;
}
