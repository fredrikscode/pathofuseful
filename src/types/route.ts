// Route and fragment types for the leveling guide

// Fragment types - these match the {type|param} syntax in route files
export type FragmentType =
  | 'enter'           // Enter an area
  | 'waypoint'        // Use waypoint to travel
  | 'waypoint_get'    // Acquire waypoint
  | 'portal'          // Portal set/use
  | 'logout'          // Logout
  | 'kill'            // Kill a boss
  | 'arena'           // Enter boss arena
  | 'quest'           // Hand in quest
  | 'quest_text'      // Quest objective text
  | 'reward_quest'    // Quest reward item
  | 'reward_vendor'   // Vendor reward item
  | 'dir'             // Direction (compass)
  | 'crafting'        // Crafting recipe
  | 'trial'           // Trial of ascendancy
  | 'ascend'          // Ascend
  | 'area'            // Area display
  | 'generic'         // Generic text
  | 'copy'            // Copyable text
  | 'gem';            // Gem (we'll add this for our crafting feature)

export interface Fragment {
  type: FragmentType;
  params: string[];
  rawText: string;
}

export type StepPart =
  | { type: 'text'; content: string }
  | { type: 'fragment'; content: Fragment };

export interface RouteStep {
  line: string;
  fragments: Fragment[];
  isSubstep: boolean;
  level?: number;
  parts: StepPart[]; // Mixed text and fragments in order
}

export interface RouteSection {
  title: string;
  act: number;
  steps: RouteStep[];
}

// Route state tracking (for validation and context)
export interface RouteState {
  currentAreaId: string;
  lastTownAreaId: string;
  portalAreaId: string | null;
  explicitWaypoints: Set<string>;
  implicitWaypoints: Set<string>;
  usedWaypoints: Set<string>;
  craftingAreas: Set<string>;
  preprocessorDefinitions: Set<string>;
}
