import React from 'react';
import { GameState } from '../types';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  onStartOver: () => void;
  gameState: GameState;
}

const Header: React.FC<HeaderProps> = ({ onStartOver, gameState }) => {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-think-gray-light/20 bg-think-bg/85 backdrop-blur-md z-30 sticky top-0">
      <div className="flex items-center select-none font-sans gap-2.5">
        {/* ThinkVantage Logo mark */}
        <div className="flex items-center text-xl md:text-2xl font-extrabold text-white">
          <span>Th</span>
          <span className="relative inline-block text-white px-[1px]">
            i
            {/* Glowing TrackPoint red dot */}
            <span className="absolute top-[3px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-think-red shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
          </span>
          <span>nkVantage</span>
        </div>
        
        {/* High-contrast divider */}
        <span className="text-think-gray-light/40 text-lg font-light">|</span>
        
        {/* High-contrast Navigator label in vibrant bright coral red */}
        <span className="text-xl md:text-2xl font-black tracking-tight text-[#ff4d4d]">
          Navigator
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {gameState !== 'onboarding' && (
          <button
            onClick={onStartOver}
            className="bg-think-gray-dark hover:bg-think-gray-light/30 border border-think-gray-light/30 text-think-text text-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 hover:text-white"
            aria-label="Restart Game"
          >
            <RotateCcw className="w-4 h-4 text-think-red" />
            <span className="hidden sm:inline">Restart Session</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
