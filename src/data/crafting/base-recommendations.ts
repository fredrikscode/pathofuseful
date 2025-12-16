import type { CraftingRecommendation } from '../../types';

// Base gear recommendations that work for most builds
// We'll make this smarter and build-specific later

export const levelingGearRecommendations: CraftingRecommendation[] = [
  {
    level: 1,
    act: 1,
    currencyPriority: ['Orb of Transmutation', 'Orb of Augmentation'],
    notes: 'Focus on movement speed boots and life on gear',
    gearRecommendations: [
      {
        slot: 'weapon',
        level: 1,
        baseItem: 'Any weapon matching your skill',
        priority: 'high',
        stats: ['+# to Physical Damage', 'Increased Physical Damage'],
        notes: 'Use whatever drops with good damage'
      },
      {
        slot: 'boots',
        level: 1,
        baseItem: 'Any boots',
        priority: 'high',
        stats: ['Movement Speed'],
        craftingSteps: [
          { order: 1, currency: 'Orb of Transmutation', description: 'Make magic', result: 'Blue boots' },
          { order: 2, currency: 'Orb of Augmentation', description: 'Add second mod', result: 'Hopefully movement speed' }
        ],
        notes: 'Movement speed is crucial for leveling speed'
      }
    ]
  },
  {
    level: 8,
    act: 1,
    currencyPriority: ['Orb of Transmutation', 'Orb of Augmentation', 'Quicksilver Flask'],
    notes: 'Start looking for life on all gear pieces',
    gearRecommendations: [
      {
        slot: 'helmet',
        level: 8,
        baseItem: 'Any helmet',
        priority: 'medium',
        stats: ['+# to maximum Life', 'Resistances'],
        craftingSteps: [
          { order: 1, currency: 'Orb of Transmutation', description: 'Make magic', result: 'Blue helmet' },
          { order: 2, currency: 'Orb of Augmentation', description: 'Add life or resist', result: 'Useful helmet' }
        ]
      },
      {
        slot: 'body_armour',
        level: 8,
        baseItem: 'Any body armour',
        priority: 'high',
        stats: ['+# to maximum Life', 'Resistances'],
        craftingSteps: [
          { order: 1, currency: 'Orb of Transmutation', description: 'Make magic', result: 'Blue chest' }
        ],
        notes: 'Look for 3-link or 4-link'
      }
    ]
  },
  {
    level: 12,
    act: 1,
    currencyPriority: ['Jeweller\'s Orb', 'Orb of Alchemy'],
    notes: 'Upgrade to better weapon bases, start caring about links',
    gearRecommendations: [
      {
        slot: 'weapon',
        level: 12,
        baseItem: 'Upgraded weapon base',
        priority: 'high',
        stats: ['+# to Physical Damage', 'Increased Attack Speed'],
        craftingSteps: [
          { order: 1, currency: 'Orb of Alchemy', description: 'Make rare', result: 'Yellow weapon with random mods' },
          { order: 2, currency: 'Vendor recipe', description: 'If bad mods, vendor + Orb of Alteration', result: 'Try again' }
        ],
        notes: 'Consider using vendor recipe: Magic weapon + Blacksmith\'s Whetstone + Rustic Sash = weapon with % increased physical'
      },
      {
        slot: 'gloves',
        level: 12,
        baseItem: 'Any gloves',
        priority: 'medium',
        stats: ['+# to maximum Life', 'Resistances', 'Attack Speed'],
        craftingSteps: [
          { order: 1, currency: 'Orb of Transmutation', description: 'Make magic', result: 'Blue gloves' }
        ]
      }
    ]
  },
  {
    level: 18,
    act: 2,
    currencyPriority: ['Essence of Greed (Life)', 'Orb of Alchemy', 'Chromatic Orb'],
    notes: 'Focus on capping resistances and getting life on every piece',
    gearRecommendations: [
      {
        slot: 'belt',
        level: 18,
        baseItem: 'Heavy Belt or Rustic Sash',
        priority: 'high',
        stats: ['+# to maximum Life', 'Resistances'],
        craftingSteps: [
          { order: 1, currency: 'Essence of Greed', description: 'Guarantees life mod', result: 'Belt with guaranteed life' }
        ],
        notes: 'Belts are very important for life'
      },
      {
        slot: 'ring',
        level: 18,
        baseItem: 'Any rings (2x)',
        priority: 'high',
        stats: ['+# to maximum Life', 'Resistances'],
        notes: 'Look for resist rings to cap your resistances'
      }
    ]
  },
  {
    level: 28,
    act: 3,
    currencyPriority: ['Orb of Fusing', 'Jeweller\'s Orb', 'Essence of Greed'],
    notes: 'Aim for 4-link setup, upgrade all gear slots',
    gearRecommendations: [
      {
        slot: 'body_armour',
        level: 28,
        baseItem: 'Good base with right colors',
        priority: 'high',
        stats: ['+# to maximum Life', 'Resistances', '4-Link'],
        craftingSteps: [
          { order: 1, currency: 'Jeweller\'s Orb', description: 'Get 4 sockets', result: '4 socket chest' },
          { order: 2, currency: 'Orb of Fusing', description: 'Link them', result: '4-link chest' },
          { order: 3, currency: 'Chromatic Orb', description: 'Color to match gems', result: 'Right colored 4-link' },
          { order: 4, currency: 'Essence of Greed', description: 'Craft life on it', result: 'Good rare 4-link' }
        ],
        notes: 'This will be your main setup until much later'
      }
    ]
  },
  {
    level: 38,
    act: 4,
    currencyPriority: ['Essences (any tier 3+)', 'Orb of Alchemy'],
    notes: 'Refresh all gear pieces with higher item level bases',
    gearRecommendations: [
      {
        slot: 'weapon',
        level: 38,
        baseItem: 'Better weapon base',
        priority: 'high',
        stats: ['+# to Physical/Elemental Damage', 'Increased Damage', 'Attack/Cast Speed'],
        craftingSteps: [
          { order: 1, currency: 'Essence', description: 'Use essence matching your damage type', result: 'Guaranteed damage mod' }
        ]
      },
      {
        slot: 'helmet',
        level: 38,
        baseItem: 'Better helmet base',
        priority: 'medium',
        stats: ['+# to maximum Life', 'Resistances'],
        craftingSteps: [
          { order: 1, currency: 'Essence of Greed', description: 'Craft life', result: 'Good rare helmet' }
        ]
      }
    ]
  },
  {
    level: 50,
    act: 5,
    currencyPriority: ['Essences (tier 4+)', 'Orb of Scouring + Alchemy'],
    notes: 'Start thinking about endgame gear bases',
    gearRecommendations: [
      {
        slot: 'amulet',
        level: 50,
        baseItem: 'Any amulet',
        priority: 'high',
        stats: ['+# to maximum Life', 'Damage mods', 'Resistances'],
        craftingSteps: [
          { order: 1, currency: 'Essence', description: 'Craft with relevant essence', result: 'Good amulet' }
        ],
        notes: 'Amulets can have powerful damage mods'
      }
    ]
  },
  {
    level: 60,
    act: 7,
    currencyPriority: ['Essences (tier 5+)', 'Chaos Orb for rerolling'],
    notes: 'Finalize your leveling gear, prepare for maps',
    gearRecommendations: [
      {
        slot: 'body_armour',
        level: 60,
        baseItem: '5-link or 6-socket',
        priority: 'high',
        stats: ['+# to maximum Life', 'Resistances'],
        craftingSteps: [
          { order: 1, currency: 'Jeweller\'s Orb', description: 'Get 5-6 sockets', result: 'Many sockets' },
          { order: 2, currency: 'Orb of Fusing', description: 'Try for 5-link', result: '5-link (or buy one)' },
          { order: 3, currency: 'Essence of Greed', description: 'Craft good mods', result: 'Endgame-ready chest' }
        ],
        notes: '5-link will carry you into maps. 6-link is luxury.'
      },
      {
        slot: 'weapon',
        level: 60,
        baseItem: 'Endgame weapon base',
        priority: 'high',
        stats: ['High damage mods matching your build'],
        notes: 'Consider buying a good weapon from trade at this point'
      }
    ]
  }
];
