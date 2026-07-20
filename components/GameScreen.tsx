import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Level, Point, InputDevice } from '../types';
import { PLAYER_RADIUS, WALL_STROKE_WIDTH } from '../constants';
import { MouseIcon, TrackPointIcon } from './icons';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Crosshair, HelpCircle, AlertCircle } from 'lucide-react';

interface GameScreenProps {
  level: Level;
  levelIndex: number;
  totalLevels: number;
  time: number;
  device: InputDevice;
  onWin: () => void;
  onGameActive: () => void;
}

const TypingChallenge: React.FC<{ challenge: string; userInput: string }> = ({ challenge, userInput }) => {
  const cursorPosition = userInput.length;
  const challengeChars = challenge.split('');

  return (
    <div className="font-mono text-3xl md:text-4xl tracking-widest text-center py-5 bg-think-bg/95 rounded-2xl px-8 border border-think-gray-light/20 shadow-2xl flex items-center justify-center gap-2">
      {challengeChars.map((char, index) => {
        let color = 'text-gray-600';
        
        if (index < userInput.length) {
          color = 'text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]';
        }
        
        const isNext = index === cursorPosition;
        const cursorClass = isNext ? 'border-b-4 border-yellow-400 bg-yellow-400/10' : 'border-b-4 border-transparent';

        return (
          <span key={index} className={`${color} px-1 pb-1 rounded transition-all duration-150 ${cursorClass}`}>
            {char}
          </span>
        );
      })}
    </div>
  );
};

const GameScreen: React.FC<GameScreenProps> = ({ level, levelIndex, totalLevels, time, device, onWin, onGameActive }) => {
  const [playerPosition, setPlayerPosition] = useState<Point>(level.start);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState(0); // 0=nav1, 1=type1, 2=nav2, 3=type2...
  const [typedText, setTypedText] = useState('');
  const [challengeWord, setChallengeWord] = useState('');
  const [isColliding, setIsColliding] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const collisionTimeoutRef = useRef<number | null>(null);

  const isTypingPhase = phaseIndex % 2 === 1;
  const currentTypingZoneIndex = Math.floor((phaseIndex - 1) / 2);

  const selectNewChallengeWord = useCallback(() => {
    const words = level.typingChallenge;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setChallengeWord(randomWord);
  }, [level.typingChallenge]);

  // Setup level
  useEffect(() => {
    setPlayerPosition(level.start);
    setIsGameActive(false);
    setPhaseIndex(0);
    setTypedText('');
    selectNewChallengeWord();
  }, [level, device, selectNewChallengeWord]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (collisionTimeoutRef.current) {
        window.clearTimeout(collisionTimeoutRef.current);
      }
    };
  }, []);

  const getSvgCoordinates = useCallback((e: MouseEvent): Point | null => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgPoint.x, y: svgPoint.y };
  }, []);

  const pointToLineSegmentDistance = (p: Point, l1: Point, l2: Point): number => {
    const A = p.x - l1.x;
    const B = p.y - l1.y;
    const C = l2.x - l1.x;
    const D = l2.y - l1.y;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;
    if (param < 0) { xx = l1.x; yy = l1.y; }
    else if (param > 1) { xx = l2.x; yy = l2.y; }
    else { xx = l1.x + param * C; yy = l1.y + param * D; }

    const dx = p.x - xx;
    const dy = p.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  useEffect(() => {
    if (!isGameActive || isTypingPhase) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = getSvgCoordinates(e);
      if (newPos) {
        const newWallStrokeWidth = WALL_STROKE_WIDTH * 4;
        let collisionDetected = false;

        // Check collisions with wall segments
        for (const wall of level.walls) {
          const distToWall = pointToLineSegmentDistance(newPos, wall.p1, wall.p2);
          
          if (distToWall < PLAYER_RADIUS + newWallStrokeWidth / 2) {
            collisionDetected = true;
            break;
          }
        }

        if (collisionDetected) {
          if (!isColliding) {
            setIsColliding(true);
            if (collisionTimeoutRef.current) {
              window.clearTimeout(collisionTimeoutRef.current);
            }
            collisionTimeoutRef.current = window.setTimeout(() => {
              setIsColliding(false);
            }, 500); // Shaking timeout
          }
          return; // stop player progress
        }

        // No collision: commit coordinates
        setPlayerPosition(newPos);
        
        const currentNavTargetIndex = phaseIndex / 2;
        
        // Target tracking check
        if (currentNavTargetIndex < level.typingZones.length) {
          const targetZone = level.typingZones[currentNavTargetIndex];
          const dx = newPos.x - targetZone.center.x;
          const dy = newPos.y - targetZone.center.y;
          if (Math.sqrt(dx * dx + dy * dy) < targetZone.radius) {
            setPlayerPosition(targetZone.center);
            setPhaseIndex(prev => prev + 1); // Trigger typing interface
          }
        } else { // Navigating to the end finish line
          const dx = newPos.x - level.end.center.x;
          const dy = newPos.y - level.end.center.y;
          if (Math.sqrt(dx * dx + dy * dy) < level.end.radius) {
            onWin();
          }
        }
      }
    };
    
    const svgElement = svgRef.current;
    svgElement?.addEventListener('mousemove', handleMouseMove);
    return () => svgElement?.removeEventListener('mousemove', handleMouseMove);
  }, [getSvgCoordinates, level, onWin, isGameActive, isTypingPhase, phaseIndex, isColliding, playerPosition]);

  // Focus type controls on load
  useEffect(() => {
    if (isTypingPhase) {
      selectNewChallengeWord();
      // Ensure input captures focus
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isTypingPhase, selectNewChallengeWord]);

  const handleStartZoneEnter = () => {
    if (!isGameActive) {
      setIsGameActive(true);
      onGameActive();
    }
  };

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;

    if (newText.length > challengeWord.length) {
      return;
    }

    setTypedText(newText);

    if (newText.length === challengeWord.length) {
      setTimeout(() => {
        setPhaseIndex(prev => prev + 1);
        setTypedText('');
      }, 150);
    }
  };
  
  const isTrackpoint = device === 'trackpoint';
  const deviceName = isTrackpoint ? 'TrackPoint Dome' : 'Standard Cursor';
  const cursorClass = isGameActive && !isTypingPhase ? 'cursor-none' : 'cursor-auto';

  return (
    <div className="w-full max-w-3xl flex flex-col items-center px-4 py-2">
      
      {/* Sleek Minimalist HUD */}
      <div className="flex flex-row justify-between items-center w-full mb-5 pb-4 border-b border-think-gray-light/10">
        {/* Left: Level Details */}
        <div className="text-left">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-think-red">
            TRACK {levelIndex + 1} OF {totalLevels}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white leading-tight">{level.name}</h2>
        </div>

        {/* Center: Interactive Device Badge */}
        <div className="hidden sm:flex items-center">
          <div className={`flex items-center text-xs font-mono font-bold px-3.5 py-1.5 rounded-full border bg-think-gray-dark/50 ${
            isTrackpoint 
              ? 'border-think-red/30 text-think-red' 
              : 'border-blue-400/30 text-blue-400'
          }`}>
            {isTrackpoint ? (
              <TrackPointIcon className="w-4 h-4 mr-1.5 text-think-red animate-pulse" />
            ) : (
              <MouseIcon className="w-4 h-4 mr-1.5 text-blue-400" />
            )}
            <span>{deviceName.toUpperCase()}</span>
          </div>
        </div>

        {/* Right: Premium Chronometer Timer */}
        <div className="text-right">
          <div className="text-2xl md:text-3xl font-black font-mono text-white bg-think-gray-dark/40 border border-think-gray-light/25 px-5 py-2 rounded-2xl shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-think-red animate-ping shrink-0" />
            <span>{time.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Dynamic Interactive Stage */}
      <div className={`w-full aspect-[4/3] bg-black rounded-3xl shadow-2xl overflow-hidden relative border border-think-gray-light/20 ${cursorClass} ${
        isColliding 
          ? 'animate-shake border-think-red shadow-[0_0_24px_rgba(239,68,68,0.25)]' 
          : 'hover:border-think-gray-light/40 transition-colors duration-300'
      }`}>
        
        {/* Inactive Input Shield Overlay */}
        {!isGameActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 pointer-events-none z-20 px-8 text-center">
            <div className="bg-think-gray-dark/95 border border-emerald-500/40 p-5 rounded-2xl shadow-2xl flex flex-col items-center max-w-xs backdrop-blur-md">
              <div className="w-10 h-10 rounded-full border border-emerald-500/30 flex items-center justify-center mb-3 bg-emerald-500/10 animate-pulse">
                <Crosshair className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-sm font-bold text-white tracking-wide">Place Pointer on START Target</p>
              <p className="text-[11px] text-gray-300 mt-1.5 leading-relaxed">
                Hover your cursor over the bright green target on the left to initiate the test.
              </p>
            </div>
          </div>
        )}

        {/* Typing Overlay Deck */}
        <AnimatePresence>
          {isTypingPhase && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-10 p-6 backdrop-blur-md"
            >
              <div className="max-w-md w-full flex flex-col items-center text-center space-y-4">
                <div className="bg-yellow-500/10 p-3 rounded-full border border-yellow-500/25 text-yellow-400 animate-pulse">
                  <Keyboard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Typing Checkpoint</h3>
                  <p className="text-xs text-gray-400">Keep your fingers on the home-row and type the word:</p>
                </div>
                
                <TypingChallenge challenge={challengeWord} userInput={typedText} />
                
                {/* Invisible focus catcher input */}
                <input 
                  ref={inputRef} 
                  type="text" 
                  value={typedText} 
                  onChange={handleTypingChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-default" 
                  autoFocus
                />
                
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                  Do not lift your hand to reach for the mouse
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive SVG Space */}
        <svg ref={svgRef} viewBox={level.viewBox} className="w-full h-full bg-[#030303]">
          <defs>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* High-tech simple grid pattern */}
            <pattern id="cyber-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.01)" strokeWidth="1" />
            </pattern>

            {/* Dark minimalist walls pattern */}
            <pattern id="carbon-walls" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#1b1b1b" />
              <path d="M 0 0 L 8 8" stroke="rgba(239, 68, 68, 0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#cyber-grid)" />

          {/* Guidelines / Flowing active path */}
          {level.path.map((pathSegment, segmentIndex) => {
            const pointsString = pathSegment.map(p => `${p.x},${p.y}`).join(' ');
            const isActive = isGameActive && !isTypingPhase && Math.floor(phaseIndex / 2) === segmentIndex;
            
            return (
              <g key={`path-group-${segmentIndex}`}>
                {/* Static background path */}
                <polyline
                  points={pointsString}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeOpacity={isActive ? 0.35 : 0.08}
                  strokeDasharray="6,6"
                />
                
                {/* Flowing active direction path */}
                {isActive && (
                  <polyline
                    points={pointsString}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeOpacity={0.85}
                    strokeDasharray="12,8"
                  >
                    <animate 
                      attributeName="stroke-dashoffset" 
                      values="100;0" 
                      dur="1.5s" 
                      repeatCount="indefinite" 
                    />
                  </polyline>
                )}
              </g>
            );
          })}

          {/* Boundary walls */}
          {level.walls.map((wall, index) => (
            <g key={`wall-group-${index}`}>
              {/* Backing Glow */}
              <line 
                x1={wall.p1.x} y1={wall.p1.y} 
                x2={wall.p2.x} y2={wall.p2.y} 
                stroke="#ef4444" 
                strokeWidth={WALL_STROKE_WIDTH * 4} 
                strokeOpacity="0.08"
                strokeLinecap="round"
                filter="url(#glow-red)"
              />
              {/* Core Solid Wall */}
              <line 
                x1={wall.p1.x} y1={wall.p1.y} 
                x2={wall.p2.x} y2={wall.p2.y} 
                stroke="url(#carbon-walls)" 
                strokeWidth={WALL_STROKE_WIDTH * 3} 
                strokeLinecap="round" 
              />
              {/* Clean Highlight Outer Edge */}
              <line 
                x1={wall.p1.x} y1={wall.p1.y} 
                x2={wall.p2.x} y2={wall.p2.y} 
                stroke="#ef4444" 
                strokeWidth="1" 
                strokeOpacity="0.25"
                strokeLinecap="round" 
              />
            </g>
          ))}
          
          {/* START PAD */}
          <g 
            onMouseEnter={handleStartZoneEnter} 
            className={!isGameActive ? 'cursor-pointer' : ''}
          >
            {/* Pulsing outer ring */}
            <circle cx={level.start.x} cy={level.start.y} r="34" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3,3" />
            
            {/* Solid High-Contrast Core */}
            <circle cx={level.start.x} cy={level.start.y} r="24" fill="#10b981" stroke="#ffffff" strokeWidth="3" filter="url(#glow-green)" />
            <circle cx={level.start.x} cy={level.start.y} r="8" fill="#ffffff" />
            
            {/* Solid High-Contrast Badge */}
            <g transform={`translate(${level.start.x}, ${level.start.y + 42})`}>
              <rect x="-26" y="-9" width="52" height="18" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" rx="4" />
              <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="black" className="pointer-events-none font-mono tracking-wider">START</text>
            </g>
          </g>

          {/* High-contrast flashing arrow pointing to start pad */}
          {!isGameActive && (
            <g transform={`translate(${level.start.x + 65}, ${level.start.y})`}>
              <path d="M 0 0 L 15 -10 L 15 -4 L 35 -4 L 35 4 L 15 4 L 15 10 Z" fill="#10b981" stroke="#ffffff" strokeWidth="1.5">
                <animateTransform 
                  attributeName="transform" 
                  type="translate" 
                  values="0,0; -12,0; 0,0" 
                  dur="0.8s" 
                  repeatCount="indefinite" 
                />
              </path>
              <g transform="translate(15, -18)">
                <rect x="-55" y="-9" width="110" height="16" fill="#10b981" stroke="#ffffff" strokeWidth="1" rx="3" />
                <text x="0" y="2" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="black" className="font-mono tracking-wider">MOVE CURSOR HERE</text>
              </g>
            </g>
          )}

          {/* SECTOR TYPING LANDINGS */}
          {level.typingZones.map((zone, index) => {
            const isPassed = currentTypingZoneIndex >= index;
            const isCurrent = currentTypingZoneIndex === index && isGameActive && !isTypingPhase;
            const zoneColor = isPassed ? '#10b981' : (isCurrent ? '#facc15' : '#4b5563');
            
            return (
              <g key={`type-zone-${index}`}>
                {/* Outer guide circle */}
                <circle cx={zone.center.x} cy={zone.center.y} r={zone.radius} fill="none" stroke={zoneColor} strokeWidth="1.5" strokeDasharray={isPassed ? '' : '3,3'} />
                
                {/* Solid core circle */}
                <circle cx={zone.center.x} cy={zone.center.y} r={zone.radius - 6} fill={zoneColor} fillOpacity="0.85" stroke="#ffffff" strokeWidth="2" />
                
                {/* Clean bold label */}
                <text x={zone.center.x} y={zone.center.y} dy="0.33em" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="black" className="pointer-events-none font-mono tracking-wider">
                  {isPassed ? '✓' : 'TYPE'}
                </text>
              </g>
            );
          })}

          {/* END PAD BEACON */}
          <g>
            <circle cx={level.end.center.x} cy={level.end.center.y} r={level.end.radius + 8} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" className="animate-[spin_30s_linear_infinite]" />
            <circle cx={level.end.center.x} cy={level.end.center.y} r={level.end.radius} fill="#3b82f6" fillOpacity="0.85" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx={level.end.center.x} cy={level.end.center.y} r="5" fill="#ffffff" />
            
            <g transform={`translate(${level.end.center.x}, ${level.end.center.y + level.end.radius + 15})`}>
              <rect x="-20" y="-8" width="40" height="16" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.2" rx="4" />
              <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="black" className="pointer-events-none font-mono tracking-wider">END</text>
            </g>
          </g>

          {/* Active Target Beacon Arrow */}
          {isGameActive && !isTypingPhase && (() => {
            const currentNavTargetIndex = Math.floor(phaseIndex / 2);
            const activeTargetPoint = currentNavTargetIndex < level.typingZones.length 
              ? level.typingZones[currentNavTargetIndex].center 
              : level.end.center;
            return (
              <g transform={`translate(${activeTargetPoint.x}, ${activeTargetPoint.y - 45})`}>
                <path d="M 0 0 L -8 -10 L -3 -10 L -3 -20 L 3 -20 L 3 -10 L 8 -10 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5">
                  <animateTransform 
                    attributeName="transform" 
                    type="translate" 
                    values="0,0; 0,8; 0,0" 
                    dur="0.8s" 
                    repeatCount="indefinite" 
                  />
                </path>
                <g transform="translate(0, -26)">
                  <rect x="-32" y="-8" width="64" height="15" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" rx="3" />
                  <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="black" className="font-mono tracking-wider">STEER HERE</text>
                </g>
              </g>
            );
          })()}

          {/* POINTER AVATAR */}
          {isGameActive && (
            <g style={{ transition: 'transform 0.05s ease-out' }}>
              <circle cx={playerPosition.x} cy={playerPosition.y} r="14" fill="none" stroke={isColliding ? '#ff4747' : '#ef4444'} strokeWidth="1.2" opacity="0.3" />
              <g transform={`translate(${playerPosition.x - 10}, ${playerPosition.y - 10})`}>
                <TrackPointIcon width={20} height={20} style={{ color: isColliding ? '#b91c1c' : '#ef4444' }} />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Elegant Minimalist Bottom Tip */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500 font-mono">
        {isColliding ? (
          <span className="text-think-red flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Barrier struck! Stabilize pointer before advancing.
          </span>
        ) : isTypingPhase ? (
          <span>Sector locked. Type the checkpoint word quickly.</span>
        ) : isGameActive ? (
          <span>Steer carefully from green START to blue END.</span>
        ) : (
          <span>Hover START to begin trial.</span>
        )}
      </div>

    </div>
  );
};

export default GameScreen;
