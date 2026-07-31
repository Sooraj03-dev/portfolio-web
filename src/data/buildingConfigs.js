// Building configuration for the Night City skyline
// 3 rows: far, mid (key buildings), near

export const farBuildings = Array.from({ length: 14 }, (_, i) => ({
  position: [
    -70 + i * 11 + (Math.random() - 0.5) * 4,
    0,
    -55 + (Math.random() - 0.5) * 10,
  ],
  scale: [
    5 + Math.random() * 8,
    40 + Math.random() * 40,
    5 + Math.random() * 6,
  ],
  color: `hsl(210, ${10 + Math.random() * 15}%, ${3 + Math.random() * 4}%)`,
  windowEmissive: 0.15 + Math.random() * 0.1,
}));

export const midBuildings = [
  {
    id: 'softsys',
    position: [-45, 0, -30],
    scale: [15, 56, 12],
    color: '#080C14',
    ledStrips: [{ color: '#FF44CC', count: 4 }],
    sign: { text: 'SOFTSYS', color: '#00FFEE', yRatio: 0.88 },
    windows: true,
  },
  {
    id: 'purple-billboard',
    position: [-18, 0, -25],
    scale: [18, 44, 12],
    color: '#0A0E16',
    billboard: 'purple-figure',
    billboardColors: ['#9900FF', '#CC44FF', '#FF44AA'],
    windows: true,
  },
  {
    id: 'center-tower',
    position: [2, 0, -32],
    scale: [10, 80, 9],
    color: '#060A12',
    ledStrips: [{ color: '#00FFFF', count: 8, full: true }],
    roofLight: { color: '#00FFFF', intensity: 4 },
    windows: true,
  },
  {
    id: 'multi-screen',
    position: [22, 0, -22],
    scale: [20, 36, 12],
    color: '#0A1018',
    multiScreens: true,
    screenColors: ['#0088FF', '#FF2288', '#00FFCC', '#FF8800'],
    windows: true,
  },
  {
    id: 'arasaka',
    position: [58, 0, -28],
    scale: [14, 40, 13],
    color: '#080E14',
    sign: { text: 'ARASAKA', color: '#CCFFFF', yRatio: 0.78 },
    ledStrips: [{ color: '#0088CC', count: 3 }],
    windows: true,
  },
];

export const nearBuildings = Array.from({ length: 8 }, (_, i) => ({
  position: [
    -35 + i * 10 + (Math.random() - 0.5) * 3,
    0,
    -8 + (Math.random() - 0.5) * 4,
  ],
  scale: [
    6 + Math.random() * 8,
    8 + Math.random() * 12,
    5 + Math.random() * 5,
  ],
  color: `hsl(210, ${8 + Math.random() * 10}%, ${4 + Math.random() * 3}%)`,
  windowEmissive: 0.05,
}));
