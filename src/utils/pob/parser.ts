// Path of Building code parser
// PoB codes are base64-encoded, zlib-compressed XML
import pako from 'pako';

// Load gem data dynamically to avoid Vite JSON parsing issues
let gemsData: Record<string, {
  id: string;
  name: string;
  primary_attribute: string;
  required_level: number;
  is_support: boolean;
}> | null = null;

async function loadGemsData() {
  if (!gemsData) {
    const response = await fetch(`${import.meta.env.BASE_URL}gems.json`);
    gemsData = await response.json();
  }
  return gemsData;
}

export type GemColor = 'red' | 'green' | 'blue' | 'white';

export interface GemInfo {
  name: string;
  color: GemColor;
}

export interface GemLink {
  gems: GemInfo[];
  socketGroup: number;
}

export interface BuildConfig {
  title: string;
  minLevel: number;
  maxLevel: number;
  mainSkill: string | null;
  gems: string[];
  gemLinks: GemLink[]; // Gems organized by socket groups
  damageTypes: string[];
  defenseTypes: string[];
}

export type BanditChoice = 'KILL_ALL' | 'ALIRA' | 'KRAITYN' | 'OAK' | null;

export interface PoBBuild {
  buildName: string;
  characterClass: string;
  level: number;
  mainSkill: string | null;
  gems: string[];
  damageTypes: string[];
  defenseTypes: string[];
  requirements: {
    strength: number;
    dexterity: number;
    intelligence: number;
  };
  configs: BuildConfig[]; // Multiple leveling/endgame setups
  banditChoice: BanditChoice;
}

async function fetchPobbinCode(shortCode: string, username?: string): Promise<string> {
  try {
    // Try user-specific endpoint first if username is provided
    let url = `https://pobb.in/${shortCode}/raw`;
    if (username) {
      // For user builds, try the /u/username/code format
      url = `https://pobb.in/u/${username}/${shortCode}/raw`;
    }

    const response = await fetch(url);

    // If user-specific endpoint fails, try the simple endpoint
    if (!response.ok && username) {
      const fallbackResponse = await fetch(`https://pobb.in/${shortCode}/raw`);
      if (!fallbackResponse.ok) throw new Error('Failed to fetch pobb.in build');
      const text = await fallbackResponse.text();
      return text.trim();
    }

    if (!response.ok) throw new Error('Failed to fetch pobb.in build');
    const text = await response.text();
    return text.trim();
  } catch (err) {
    throw err;
  }
}

export async function parsePoBCode(input: string): Promise<PoBBuild> {
  // Load gem data on first use
  await loadGemsData();

  try {
    let code = input.trim();

    // Handle pobb.in URLs (supports both /shortcode and /u/username/shortcode formats)
    if (code.startsWith('https://pobb.in/') || code.startsWith('http://pobb.in/')) {
      // Extract the path after pobb.in/
      const urlParts = code.replace(/^https?:\/\/pobb\.in\//, '').split('/');

      let shortCode: string;
      let username: string | undefined;

      // If format is /u/username/shortcode
      if (urlParts[0] === 'u' && urlParts.length >= 3) {
        username = urlParts[1];
        shortCode = urlParts[2];
      } else {
        // If format is /shortcode
        shortCode = urlParts[0];
      }

      if (!shortCode) throw new Error('Invalid pobb.in URL');
      code = await fetchPobbinCode(shortCode, username);
    }

    // Remove any URL prefix
    code = code.replace(/^https?:\/\/.*?\//, '').trim();

    // Convert URL-safe base64 to standard base64
    // Replace - with + and _ with /
    code = code.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    while (code.length % 4 !== 0) {
      code += '=';
    }

    // Decode base64
    const binaryString = atob(code);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decompress using pako
    const decompressed = pako.inflate(bytes, { to: 'string' });

    return extractBuildData(decompressed);
  } catch {
    throw new Error('Invalid PoB code or URL');
  }
}

function extractBuildData(xml: string): PoBBuild {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  // Extract character class and build name
  const buildElem = doc.querySelector('Build');
  const characterClass = buildElem?.getAttribute('className') || 'Unknown';
  const level = parseInt(buildElem?.getAttribute('level') || '1');

  // Extract build name from meta tag
  const metaTitleElem = doc.querySelector('meta[name="title"]');
  const buildName = metaTitleElem?.getAttribute('content') || 'Unnamed Build';

  // Extract bandit choice from Config section
  const banditChoice = extractBanditChoice(doc);

  // Parse build configurations (skill sets)
  const configs: BuildConfig[] = [];
  const skillSets = doc.querySelectorAll('SkillSet');

  skillSets.forEach((skillSet, idx) => {
    const title = skillSet.getAttribute('title') || `Setup ${idx + 1}`;

    // Extract gems organized by socket groups
    const setGems: string[] = [];
    const setActiveSkills: string[] = [];
    const gemLinks: GemLink[] = [];

    // Each <Skill> element represents a socket group/link
    const skills = skillSet.querySelectorAll('Skill');
    skills.forEach((skill, skillIdx) => {
      const linkGems: GemInfo[] = [];

      skill.querySelectorAll('Gem').forEach((gem) => {
        const name = gem.getAttribute('nameSpec') || gem.getAttribute('name');
        const gemId = gem.getAttribute('gemId');
        const enabled = gem.getAttribute('enabled');

        if (name && enabled !== 'false') {
          setGems.push(name);
          linkGems.push({
            name,
            color: getGemColor(name, gemId || undefined)
          });

          const supportKeywords = ['support', 'awakened', 'enhance', 'empower', 'enlighten'];
          const isSupport = supportKeywords.some(keyword =>
            name.toLowerCase().includes(keyword)
          );
          if (!isSupport) {
            setActiveSkills.push(name);
          }
        }
      });

      // Add this socket group if it has gems
      if (linkGems.length > 0) {
        gemLinks.push({
          socketGroup: skillIdx,
          gems: linkGems
        });
      }
    });

    // Sort gem links by number of gems (descending - most links first)
    gemLinks.sort((a, b) => b.gems.length - a.gems.length);

    // Parse level range from title (e.g., "Lvl 1 to 12 - Splitting steel")
    const levelMatch = title.match(/(?:lvl?|level)\s*(\d+)(?:\s*(?:to|-)\s*(\d+))?/i);
    let minLevel = 1;
    let maxLevel = 100;

    if (levelMatch) {
      minLevel = parseInt(levelMatch[1]);
      maxLevel = levelMatch[2] ? parseInt(levelMatch[2]) : 100;
    }

    configs.push({
      title,
      minLevel,
      maxLevel,
      mainSkill: setActiveSkills[0] || null,
      gems: setGems,
      gemLinks,
      damageTypes: inferDamageTypes(setGems),
      defenseTypes: inferDefenseTypes(setGems)
    });
  });

  // Use first config as default for main build data
  const defaultConfig = configs[0] || {
    gems: [],
    gemLinks: [],
    mainSkill: null,
    damageTypes: [],
    defenseTypes: []
  };

  // Calculate requirements
  const requirements = calculateRequirements(defaultConfig.gems, characterClass);

  return {
    buildName,
    characterClass,
    level,
    mainSkill: defaultConfig.mainSkill,
    gems: defaultConfig.gems,
    damageTypes: defaultConfig.damageTypes,
    defenseTypes: defaultConfig.defenseTypes,
    requirements,
    configs,
    banditChoice
  };
}

function extractBanditChoice(doc: Document): BanditChoice {
  // PoB stores bandit choice in two places:
  // 1. As an attribute in the Build element: <Build bandit="Alira" ...>
  // 2. As an Input element: <Input string="Alira" name="bandit"/>

  // Try Build element first
  const buildElem = doc.querySelector('Build');
  const buildBandit = buildElem?.getAttribute('bandit');

  if (buildBandit) {
    return parseBanditValue(buildBandit);
  }

  // Try Input elements
  const inputs = doc.querySelectorAll('Input[name="bandit"]');
  for (const input of inputs) {
    const value = input.getAttribute('string');
    if (value) {
      return parseBanditValue(value);
    }
  }

  // Default to kill all if not specified
  return 'KILL_ALL';
}

function parseBanditValue(value: string): BanditChoice {
  const normalized = value.toLowerCase().trim();

  if (!normalized || normalized === 'none') {
    return 'KILL_ALL';
  }
  if (normalized === 'alira') {
    return 'ALIRA';
  }
  if (normalized === 'kraityn') {
    return 'KRAITYN';
  }
  if (normalized === 'oak') {
    return 'OAK';
  }

  // Default to kill all if unrecognized
  return 'KILL_ALL';
}

function inferDamageTypes(gems: string[]): string[] {
  const types = new Set<string>();
  const gemText = gems.join(' ').toLowerCase();

  if (gemText.includes('fire') || gemText.includes('burn') || gemText.includes('ignite')) types.add('fire');
  if (gemText.includes('cold') || gemText.includes('freeze') || gemText.includes('chill')) types.add('cold');
  if (gemText.includes('lightning') || gemText.includes('shock')) types.add('lightning');
  if (gemText.includes('chaos') || gemText.includes('poison')) types.add('chaos');
  if (gemText.includes('physical') || gemText.includes('bleed')) types.add('physical');

  return Array.from(types);
}

function inferDefenseTypes(gems: string[]): string[] {
  const types = new Set<string>();
  const gemText = gems.join(' ').toLowerCase();

  if (gemText.includes('armour') || gemText.includes('molten shell')) types.add('armour');
  if (gemText.includes('evasion') || gemText.includes('grace')) types.add('evasion');
  if (gemText.includes('energy shield') || gemText.includes('discipline')) types.add('energy_shield');

  return Array.from(types);
}

function calculateRequirements(_gems: string[], _characterClass: string): { strength: number; dexterity: number; intelligence: number } {
  // Simplified - in reality would parse gem requirements
  const baseStat = 50;

  return {
    strength: baseStat,
    dexterity: baseStat,
    intelligence: baseStat
  };
}

function getGemColor(gemName: string, gemId?: string): GemColor {
  if (!gemsData) {
    // Data not loaded yet, return white
    return 'white';
  }

  // Try to find gem by metadata ID first (most accurate)
  if (gemId && gemsData[gemId]) {
    const gem = gemsData[gemId];
    const attr = gem.primary_attribute;
    if (attr === 'strength') return 'red';
    if (attr === 'dexterity') return 'green';
    if (attr === 'intelligence') return 'blue';
    return 'white';
  }

  // Fall back to name lookup
  const name = gemName.toLowerCase();
  for (const [, gem] of Object.entries(gemsData)) {
    if (gem.name.toLowerCase() === name) {
      const attr = gem.primary_attribute;
      if (attr === 'strength') return 'red';
      if (attr === 'dexterity') return 'green';
      if (attr === 'intelligence') return 'blue';
      return 'white';
    }
  }

  // Default to white for unknown gems
  return 'white';
}
