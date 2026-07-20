// Fix: Define and export all necessary types to resolve missing type errors across the application.
export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  p1: Point;
  p2: Point;
}

export interface TypingZone {
  center: Point;
  radius: number;
}

export interface EndZone {
  center: Point;
  radius: number;
}

export interface Level {
  id: number;
  name: string;
  viewBox: string;
  start: Point;
  typingZones: TypingZone[];
  end: EndZone;
  walls: Wall[];
  typingChallenge: string[];
  path: Point[][];
}

export type GameState = 'onboarding' | 'welcome' | 'intermission' | 'playing' | 'comparison' | 'finished';

export type InputDevice = 'trackpoint' | 'other';

export interface Score {
  levelId: number;
  time: number;
  device: InputDevice;
}

export interface HighScore {
  name: string;
  score: number;
}
