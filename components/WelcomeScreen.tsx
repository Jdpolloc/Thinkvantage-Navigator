import React from 'react';
import { TrackPointIcon, ArrowRightIcon } from './icons';
import { HighScore } from '../types';
import { motion } from 'motion/react';
import { Download, Play, Trophy, HelpCircle, Monitor, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  highScores: HighScore[];
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, highScores }) => {
  // Container stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl px-4 flex flex-col items-center justify-center text-center py-4"
    >
      {/* Floating 3D TrackPoint Dome */}
      <motion.div variants={itemVariants} className="relative mb-6">
        <div className="absolute inset-0 bg-think-red/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative bg-think-gray-dark/40 border border-think-gray-light/20 p-5 rounded-full shadow-2xl flex items-center justify-center">
          <TrackPointIcon className="w-16 h-16 text-think-red transform hover:scale-110 hover:rotate-6 transition-all duration-300 cursor-pointer" />
        </div>
      </motion.div>

      {/* Hero Title & Subtitle */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          ThinkVantage <span className="text-think-red">Input Efficiency</span> Diagnostics
        </h2>
        
        {/* Bold Statement for IT Administrators */}
        <div className="bg-think-red/10 border border-think-red/30 px-6 py-4 rounded-xl max-w-xl mx-auto my-2">
          <p className="text-sm md:text-base font-black text-think-red font-mono uppercase tracking-wider">
            Laptop users who use a trackpoint are 35% more productive than mice users.
          </p>
        </div>

        <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed uppercase tracking-wider font-mono">
          Compare your TrackPoint speed against standard mouse navigation now.
        </p>
      </motion.div>

      {/* Primary Action Button */}
      <motion.div variants={itemVariants} className="mt-6 mb-8 w-full flex flex-col items-center gap-4">
        <button
          onClick={onStart}
          className="relative bg-think-red hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl text-base transition-all duration-300 shadow-lg shadow-think-red/20 flex items-center gap-2 group overflow-hidden"
        >
          <span>Begin steering test</span>
          <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Windows 11 Native Executable Callout */}
        <div className="flex flex-col items-center gap-2 mt-1">
          <span className="text-[11px] text-gray-500 font-mono">ThinkPad Native low-latency desktop app (Windows 11):</span>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 bg-think-gray-dark/40 border border-think-gray-light/10 px-3 py-1.5 rounded-md">
              <span className="text-gray-500">Recommended:</span>
              <a
                href="./ThinkVantage_Navigator_Windows.zip"
                download="ThinkVantage_Navigator_Windows.zip"
                className="text-think-red font-bold hover:underline inline-flex items-center gap-1 animate-pulse-button px-1 rounded"
              >
                <Download className="w-3.5 h-3.5" />
                Download Setup Archive (.ZIP)
              </a>
            </div>
          </div>
          <span className="text-[10px] text-gray-500 max-w-sm text-center">
            Extract the ZIP to your PC and run <code className="text-gray-400 font-semibold bg-gray-900 px-1 py-0.5 rounded">ThinkVantage Navigator.exe</code> to prevent Windows Defender and temp-folder access blocks.
          </span>
        </div>
      </motion.div>

      {/* Two Minimal Columns: Quick Rules & Hall of Fame */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full border-t border-think-gray-light/10 pt-8 text-left">
        {/* Quick Calibration Rules */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-think-red" />
            Navigation Rules
          </h3>
          <ul className="space-y-2.5 text-xs text-gray-400 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-think-red">•</span>
              <span>Steer the red dot from <span className="text-emerald-400 font-bold">START</span> to <span className="text-blue-400 font-bold">END</span>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-think-red">•</span>
              <span>When entering yellow sectors, type the displayed terminal word instantly.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-think-red">•</span>
              <span>Do not touch walls — collision causes a severe vibration delay.</span>
            </li>
          </ul>
        </div>

        {/* Compact Leaderboard */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Leaderboard Records
          </h3>
          
          {highScores.length > 0 ? (
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {highScores.slice(0, 3).map((score, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1.5 border-b border-think-gray-light/10 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 font-bold">#{index + 1}</span>
                    <span className="text-gray-300 font-semibold truncate max-w-[120px]">{score.name}</span>
                  </div>
                  <span className="text-think-red font-bold">{score.score}s</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 font-mono italic">
              No entries logged yet. Beat 15s to secure a spot!
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
