import type { RouteSection, RouteStep, Fragment } from '../types';
import type { BanditChoice } from './pob/parser';

// Simple regex patterns for fragments
const FRAGMENT_PATTERN = /{([^|}]+)(?:\|([^}]+))?}/g;

export function parseFragment(match: string): Fragment {
  const withoutBraces = match.slice(1, -1); // Remove { and }
  const parts = withoutBraces.split('|');

  // If only one part, check if it's a special standalone type
  if (parts.length === 1) {
    const singleParam = parts[0];
    const standaloneTypes = ['waypoint', 'waypoint_get', 'trial', 'logout', 'portal', 'crafting', 'ascend'];

    if (standaloneTypes.includes(singleParam)) {
      return {
        type: singleParam as any,
        params: [],
        rawText: match
      };
    }

    // Otherwise treat it as a kill fragment (shorthand for boss names)
    return {
      type: 'kill',
      params: [parts[0]],
      rawText: match
    };
  }

  return {
    type: parts[0] as any,
    params: parts.slice(1),
    rawText: match
  };
}

export function parseRouteLine(line: string): RouteStep {
  const isSubstep = line.trim().startsWith('#sub');
  const cleanLine = line.replace(/^\s*#sub\s*/, '').trim();

  const fragments: Fragment[] = [];
  const parts: any[] = [];
  let lastIndex = 0;
  let match;

  // Reset regex state
  FRAGMENT_PATTERN.lastIndex = 0;

  while ((match = FRAGMENT_PATTERN.exec(cleanLine)) !== null) {
    const fragment = parseFragment(match[0]);
    fragments.push(fragment);

    // Add text before this fragment
    if (match.index > lastIndex) {
      const textBefore = cleanLine.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push({ type: 'text', content: textBefore });
      }
    }

    // Add the fragment
    parts.push({ type: 'fragment', content: fragment });
    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text after the last fragment
  if (lastIndex < cleanLine.length) {
    const textAfter = cleanLine.substring(lastIndex);
    if (textAfter.trim()) {
      parts.push({ type: 'text', content: textAfter });
    }
  }

  // If no fragments, treat the entire line as text
  if (parts.length === 0 && cleanLine) {
    parts.push({ type: 'text', content: cleanLine });
  }

  return {
    line: cleanLine,
    fragments,
    isSubstep,
    parts
  };
}

export function parseRouteFile(content: string, banditChoice: BanditChoice = 'KILL_ALL'): RouteSection | null {
  const lines = content.split('\n');

  let sectionTitle = '';
  let act = 0;
  const steps: RouteStep[] = [];

  let skipBlock = false;

  // Map bandit choice to preprocessor directive
  const getBanditDirective = (choice: BanditChoice): string | null => {
    if (choice === 'KILL_ALL') return 'BANDIT_KILL';
    if (choice === 'ALIRA') return 'BANDIT_ALIRA';
    if (choice === 'KRAITYN') return 'BANDIT_KRAITYN';
    if (choice === 'OAK') return 'BANDIT_OAK';
    return 'BANDIT_KILL'; // Default
  };

  const activeBanditDirective = getBanditDirective(banditChoice);

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Parse section header
    if (trimmed.startsWith('#section')) {
      sectionTitle = trimmed.replace('#section', '').trim();
      const actMatch = sectionTitle.match(/Act (\d+)/);
      if (actMatch) {
        act = parseInt(actMatch[1]);
      }
      continue;
    }

    // Handle preprocessor directives
    if (trimmed.startsWith('#ifdef') || trimmed.startsWith('#ifndef')) {
      // Check for bandit directives
      if (trimmed.includes('BANDIT_')) {
        const directive = trimmed.replace(/^#ifdef\s+/, '').trim();
        skipBlock = directive !== activeBanditDirective;
      } else {
        // For other directives, include LEAGUE_START content by default
        skipBlock = trimmed.includes('#ifndef LEAGUE_START');
      }
      continue;
    }

    if (trimmed.startsWith('#endif')) {
      skipBlock = false;
      continue;
    }

    // Skip lines if we're in a skipped block
    if (skipBlock) continue;

    // Skip other comments that aren't #sub
    if (trimmed.startsWith('#') && !trimmed.startsWith('#sub')) continue;

    // Parse the line
    const step = parseRouteLine(line);
    steps.push(step);
  }

  if (!sectionTitle) return null;

  return {
    title: sectionTitle,
    act,
    steps
  };
}

// Load route files (we'll use Vite's import.meta.glob)
export async function loadRouteFiles(banditChoice: BanditChoice = 'KILL_ALL'): Promise<RouteSection[]> {
  const modules = import.meta.glob('/data/routes/*.txt', { query: '?raw', import: 'default' });
  const sections: RouteSection[] = [];

  for (const path in modules) {
    const content = await modules[path]();
    const section = parseRouteFile(content as string, banditChoice);
    if (section) {
      sections.push(section);
    }
  }

  // Sort by act number
  return sections.sort((a, b) => a.act - b.act);
}
