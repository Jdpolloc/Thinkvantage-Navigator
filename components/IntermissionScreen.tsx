import React from 'react';
import { InputDevice } from '../types';
import { MouseIcon, TrackPointIcon } from './icons';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface IntermissionScreenProps {
  device: InputDevice;
  levelName: string;
  levelIndex: number;
  totalLevels: number;
  onStartTrial: () => void;
}

const IntermissionScreen: React.FC<IntermissionScreenProps> = ({ device, levelName, levelIndex, totalLevels, onStartTrial }) => {
  const isTrackpoint = device === 'trackpoint';
  const roundLabel = isTrackpoint ? 'TRIAL B' : 'TRIAL A';
  const deviceName = isTrackpoint ? 'TrackPoint Dome' : 'Standard Cursor';
  
  const accentColorClass = isTrackpoint ? 'text-think-red' : 'text-blue-400';
  const glowColorClass = isTrackpoint ? 'bg-think-red/10' : 'bg-blue-500/10';
  const buttonClass = isTrackpoint 
    ? 'bg-think-red hover:bg-red-600 shadow-think-red/10' 
    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/10';

  const DeviceIcon = isTrackpoint ? TrackPointIcon : MouseIcon;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
  };

  return (
    <div className="w-full max-w-lg px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-think-gray-dark/95 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-think-gray-light/10 text-center relative overflow-hidden"
      >
        {/* Soft Radial Backlight */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20 ${isTrackpoint ? 'bg-think-red' : 'bg-blue-500'}`} />

        {/* Level indicator */}
        <motion.div variants={itemVariants} className="mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-think-bg border border-think-gray-light/10 px-3 py-1 rounded-full text-gray-400">
            LEVEL {levelIndex + 1} OF {totalLevels}
          </span>
        </motion.div>

        {/* Level Name */}
        <motion.h2 variants={itemVariants} className="text-2xl font-black text-white">
          {levelName}
        </motion.h2>

        {/* Device Target Presentation */}
        <motion.div 
          variants={itemVariants} 
          className="my-8 flex flex-col items-center justify-center"
        >
          <div className={`p-6 rounded-full ${glowColorClass} border border-think-gray-light/10 shadow-xl mb-4 relative`}>
            <DeviceIcon className={`w-14 h-14 ${accentColorClass}`} />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">{roundLabel}</span>
          <span className={`text-2xl font-black text-white tracking-tight mt-1`}>
            {deviceName}
          </span>
        </motion.div>

        {/* Action Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartTrial}
          className={`text-white font-bold py-3.5 px-8 rounded-xl text-base transition-all duration-300 shadow-lg ${buttonClass} inline-flex items-center gap-2 group w-full justify-center`}
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Navigation</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default IntermissionScreen;
