import React from 'react';
import { TrackPointIcon } from './icons';
import { motion } from 'motion/react';
import { Keyboard, ArrowRight, Zap, Award } from 'lucide-react';

interface OnboardingScreenProps {
  onContinue: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onContinue }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="w-full max-w-3xl px-4 md:px-0">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-think-gray-dark/95 backdrop-blur p-8 md:p-10 rounded-2xl shadow-2xl border border-think-gray-light/20 relative overflow-hidden"
      >
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-think-red/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          {/* Animated Header Logo */}
          <motion.div variants={itemVariants} className="relative mb-6">
            <div className="absolute inset-0 bg-think-red/20 rounded-full blur-lg animate-pulse" />
            <TrackPointIcon className="w-16 h-16 text-think-red relative z-10" />
          </motion.div>

          {/* Core Title */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              The <span className="text-think-red">Home-Row</span> Advantage
            </h2>
            <p className="text-xl text-gray-200 font-medium max-w-xl mx-auto leading-relaxed">
              Laptop users can boost navigation productivity by up to <span className="font-bold text-think-red text-2xl px-1.5 bg-think-red/10 rounded-lg border border-think-red/20">50%</span>.
            </p>
          </motion.div>

          {/* Interactive Graphic / Explainer */}
          <motion.div variants={itemVariants} className="w-full bg-think-bg border border-think-gray-light/25 rounded-xl p-6 my-8 text-left grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-think-red" />
                No Hand Travel Time
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Standard pointing devices (mice and trackpads) require you to lift your hand away from the typing home-row, wait, point, and then travel all the way back to resume typing.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed font-semibold text-think-red flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                TrackPoint resolves this instantly.
              </p>
            </div>

            {/* Home Row Infographic Component */}
            <div className="flex flex-col justify-center items-center bg-think-gray-dark/40 border border-think-gray-light/10 p-4 rounded-lg">
              <div className="w-full text-center mb-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">TYPING DECK</span>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                {/* Simulated keyboard rows */}
                <div className="flex justify-center gap-1">
                  {['Q','W','E','R','T','Y','U','I','O','P'].map(k => <div key={k} className="w-6 h-6 rounded bg-think-bg border border-think-gray-light/20 flex items-center justify-center text-[9px] text-gray-500 font-mono font-bold">{k}</div>)}
                </div>
                {/* Home Row */}
                <div className="flex justify-center gap-1 relative py-1 bg-think-red/5 border border-think-red/10 rounded">
                  {['A','S','D'].map(k => <div key={k} className="w-6 h-6 rounded bg-think-bg border border-think-gray-light/20 flex items-center justify-center text-[9px] text-gray-400 font-mono font-bold">{k}</div>)}
                  {/* G and H with Trackpoint Nestled */}
                  <div className="w-6 h-6 rounded bg-think-bg border border-think-gray-light/20 flex items-center justify-center text-[9px] text-gray-400 font-mono font-bold relative">
                    G
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-20">
                      <div className="w-2.5 h-2.5 rounded-full bg-think-red ring-2 ring-think-bg animate-pulse" />
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded bg-think-bg border border-think-gray-light/20 flex items-center justify-center text-[9px] text-gray-400 font-mono font-bold">H</div>
                  {['J','K','L',';'].map(k => <div key={k} className="w-6 h-6 rounded bg-think-bg border border-think-gray-light/20 flex items-center justify-center text-[9px] text-gray-400 font-mono font-bold">{k}</div>)}
                  
                  {/* Floating tooltip */}
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-think-red font-mono font-bold uppercase tracking-wider bg-think-bg border border-think-red/30 px-1.5 rounded shadow">Home Row Nesting</span>
                </div>
                {/* Space Row */}
                <div className="flex justify-center gap-1 mt-2">
                  <div className="w-4 h-6 rounded bg-think-bg border border-think-gray-light/20" />
                  <div className="w-24 h-6 rounded bg-think-bg border border-think-gray-light/20 flex items-center justify-center text-[8px] text-gray-600 font-mono">SPACE</div>
                  <div className="w-4 h-6 rounded bg-think-bg border border-think-gray-light/20" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description summary */}
          <motion.p variants={itemVariants} className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
            This utility measures your coordination across multiple steering tracks. See how guiding the pointer while completing typing tasks without lifting your hands from the keyboard home-row saves time.
          </motion.p>

          {/* Action button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="bg-think-red hover:bg-red-600 text-white font-bold py-3.5 px-10 rounded-xl text-lg md:text-xl transition-all duration-200 shadow-lg shadow-think-red/20 flex items-center gap-2 group"
          >
            <span>Proceed to Calibration</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingScreen;
