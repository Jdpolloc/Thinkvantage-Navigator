import { Level } from './types';

export const PLAYER_RADIUS = 10;
export const WALL_STROKE_WIDTH = 4;

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Standard Desktop Maze",
    viewBox: "0 0 800 600",
    start: { x: 80, y: 300 },
    typingZones: [{ center: { x: 400, y: 300 }, radius: 30 }],
    end: { center: { x: 720, y: 300 }, radius: 25 },
    walls: [], // A very simple level with no walls
    typingChallenge: ["trackpoint", "thinkvantage", "pointer", "cursor"],
    path: [
      [{ x: 80, y: 300 }, { x: 400, y: 300 }],
      [{ x: 400, y: 300 }, { x: 720, y: 300 }]
    ],
  },
  {
    id: 2,
    name: "ZigZag Pathway Calibration",
    viewBox: "0 0 800 600",
    start: { x: 80, y: 100 },
    typingZones: [
      { center: { x: 720, y: 100 }, radius: 25 },
      { center: { x: 80, y: 300 }, radius: 25 },
    ],
    end: { center: { x: 720, y: 500 }, radius: 25 },
    walls: [
      { p1: { x: 0, y: 200 }, p2: { x: 640, y: 200 } },
      { p1: { x: 160, y: 400 }, p2: { x: 800, y: 400 } },
    ],
    typingChallenge: ["keyboard", "efficiency", "workflow", "precision", "control"],
    path: [
      [{ x: 80, y: 100 }, { x: 720, y: 100 }],
      [{ x: 720, y: 100 }, { x: 720, y: 200 }, { x: 80, y: 300 }],
      [{ x: 80, y: 300 }, { x: 80, y: 400 }, { x: 720, y: 500 }]
    ],
  },
  {
    id: 3,
    name: "Home-Row Steering Track",
    viewBox: "0 0 800 600",
    start: { x: 100, y: 100 },
    typingZones: [{ center: { x: 400, y: 300 }, radius: 25 }],
    end: { center: { x: 700, y: 500 }, radius: 25 },
    walls: [
      // Vertical barriers to negotiate
      { p1: { x: 250, y: 0 }, p2: { x: 250, y: 180 } },
      { p1: { x: 250, y: 350 }, p2: { x: 250, y: 600 } },
      { p1: { x: 550, y: 0 }, p2: { x: 550, y: 250 } },
      { p1: { x: 550, y: 420 }, p2: { x: 550, y: 600 } },
    ],
    typingChallenge: ["ergonomics", "tactile", "thinkpad", "navigator", "home-row"],
    path: [
      [{ x: 100, y: 100 }, { x: 250, y: 260 }, { x: 400, y: 300 }],
      [{ x: 400, y: 300 }, { x: 550, y: 340 }, { x: 700, y: 500 }]
    ],
  },
  {
    id: 4,
    name: "System Administrator Obstacle",
    viewBox: "0 0 800 600",
    start: { x: 80, y: 80 },
    typingZones: [
      { center: { x: 720, y: 80 }, radius: 25 },
      { center: { x: 80, y: 520 }, radius: 25 }
    ],
    end: { center: { x: 720, y: 520 }, radius: 25 },
    walls: [
      // Outer border buffers and central divider box
      { p1: { x: 200, y: 180 }, p2: { x: 600, y: 180 } },
      { p1: { x: 200, y: 420 }, p2: { x: 600, y: 420 } },
      { p1: { x: 200, y: 180 }, p2: { x: 200, y: 420 } },
      { p1: { x: 600, y: 180 }, p2: { x: 600, y: 420 } },
      // Corner guards to guide alignment
      { p1: { x: 400, y: 0 }, p2: { x: 400, y: 80 } },
      { p1: { x: 400, y: 520 }, p2: { x: 400, y: 600 } },
    ],
    typingChallenge: ["calibration", "isometric", "sensitivity", "dome", "hardware"],
    path: [
      [{ x: 80, y: 80 }, { x: 720, y: 80 }],
      [{ x: 720, y: 80 }, { x: 720, y: 300 }, { x: 80, y: 300 }, { x: 80, y: 520 }],
      [{ x: 80, y: 520 }, { x: 720, y: 520 }]
    ],
  },
  {
    id: 5,
    name: "Precision Ergonomic Evaluation",
    viewBox: "0 0 800 600",
    start: { x: 80, y: 300 },
    typingZones: [
      { center: { x: 250, y: 150 }, radius: 25 },
      { center: { x: 550, y: 450 }, radius: 25 },
      { center: { x: 680, y: 150 }, radius: 25 }
    ],
    end: { center: { x: 740, y: 300 }, radius: 25 },
    walls: [
      // High-frequency corridor dividers
      { p1: { x: 180, y: 0 }, p2: { x: 180, y: 220 } },
      { p1: { x: 180, y: 380 }, p2: { x: 180, y: 600 } },
      { p1: { x: 380, y: 0 }, p2: { x: 380, y: 220 } },
      { p1: { x: 380, y: 380 }, p2: { x: 380, y: 600 } },
      { p1: { x: 480, y: 0 }, p2: { x: 480, y: 220 } },
      { p1: { x: 480, y: 380 }, p2: { x: 480, y: 600 } },
      { p1: { x: 620, y: 0 }, p2: { x: 620, y: 220 } },
      { p1: { x: 620, y: 380 }, p2: { x: 620, y: 600 } },
    ],
    typingChallenge: ["configuration", "registry", "driver", "installation", "endpoint", "management", "provisioning", "deployment"],
    path: [
      [{ x: 80, y: 300 }, { x: 180, y: 280 }, { x: 250, y: 150 }],
      [{ x: 250, y: 150 }, { x: 380, y: 280 }, { x: 480, y: 320 }, { x: 550, y: 450 }],
      [{ x: 550, y: 450 }, { x: 620, y: 300 }, { x: 680, y: 150 }],
      [{ x: 680, y: 150 }, { x: 740, y: 300 }]
    ],
  },
];
