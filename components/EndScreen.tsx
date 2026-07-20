import React, { useState } from 'react';
import { GameState, Score, HighScore } from '../types';
import { LEVELS } from '../constants';
import { MouseIcon, TrackPointIcon } from './icons';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, TrendingUp, Save, BarChart3, Clock, Flame, Award, ArrowRight, Home } from 'lucide-react';

interface EndScreenProps {
  status: GameState;
  level: number;
  scores: Score[];
  onNextLevel: () => void;
  onGoToMenu: () => void;
  onSaveHighScore: (name: string, score: number) => void;
  isLastLevel: boolean;
}

const ComparisonContent: React.FC<Omit<EndScreenProps, 'status' | 'onSaveHighScore'>> = ({ level, scores, onNextLevel, onGoToMenu, isLastLevel }) => {
    const levelScores = scores.filter(s => s.levelId === level);
    const trackpointAttempt = levelScores.filter(s => s.device === 'trackpoint').pop();
    const otherAttempt = levelScores.filter(s => s.device === 'other').pop();

    const trackpointTime = trackpointAttempt?.time;
    const otherTime = otherAttempt?.time;

    let winner: 'trackpoint' | 'other' | 'tie' | 'none' = 'none';
    if (trackpointTime !== undefined && otherTime !== undefined) {
        if (trackpointTime < otherTime) winner = 'trackpoint';
        else if (otherTime < trackpointTime) winner = 'other';
        else winner = 'tie';
    }

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.35, staggerChildren: 0.12 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-think-red bg-think-red/10 border border-think-red/20 px-3 py-1 rounded-lg">
                LEVEL RUNDOWN
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-white">Level {level + 1} Results</h2>
            <p className="text-base text-gray-400 mt-1 mb-6">Head-to-head laboratory pointing device comparison.</p>
            
            {/* The Comparison Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left max-w-2xl mx-auto">
                
                {/* Trackpoint card */}
                <motion.div 
                    variants={cardVariants}
                    className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-think-bg/70 ${
                        winner === 'trackpoint' 
                            ? 'border-think-red/50 shadow-lg shadow-think-red/5 bg-think-red/5' 
                            : 'border-think-gray-light/20'
                    }`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <TrackPointIcon className="w-6 h-6 text-think-red" />
                            <span className="font-bold text-lg text-white">TrackPoint</span>
                        </div>
                        {winner === 'trackpoint' && (
                            <span className="bg-think-red/20 text-think-red text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-think-red/30 uppercase tracking-wider animate-pulse">
                                WINNER
                            </span>
                        )}
                    </div>
                    <div className="mt-4">
                        <span className="text-5xl font-black font-mono text-white tracking-tight">
                            {trackpointTime !== undefined ? `${trackpointTime.toFixed(1)}s` : 'N/A'}
                        </span>
                        <p className="text-xs text-gray-400 mt-1 font-mono">STEERING TIME INTERVAL</p>
                    </div>
                </motion.div>

                {/* Mouse / pad card */}
                <motion.div 
                    variants={cardVariants}
                    className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-think-bg/70 ${
                        winner === 'other' 
                            ? 'border-blue-500/50 shadow-lg shadow-blue-500/5 bg-blue-500/5' 
                            : 'border-think-gray-light/20'
                    }`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <MouseIcon className="w-6 h-6 text-blue-400" />
                            <span className="font-bold text-lg text-white">Mouse/Pad</span>
                        </div>
                        {winner === 'other' && (
                            <span className="bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-wider animate-pulse">
                                WINNER
                            </span>
                        )}
                    </div>
                    <div className="mt-4">
                        <span className="text-5xl font-black font-mono text-white tracking-tight">
                            {otherTime !== undefined ? `${otherTime.toFixed(1)}s` : 'N/A'}
                        </span>
                        <p className="text-xs text-gray-400 mt-1 font-mono">STEERING TIME INTERVAL</p>
                    </div>
                </motion.div>
            </div>

            {winner === 'tie' && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 py-2.5 px-4 rounded-xl mb-6 inline-block font-mono text-yellow-400 font-bold text-sm">
                    ⚠️ MATCH CALIBRATION TIE! BOTH INPUTS CLOCKED EXACTLY THE SAME TIME.
                </div>
            )}

            {/* Controls */}
            <div className="flex justify-center flex-wrap gap-4 pt-2 border-t border-think-gray-light/10 max-w-lg mx-auto">
                <button
                    onClick={onGoToMenu}
                    className="bg-think-gray-dark hover:bg-think-gray-light/30 border border-think-gray-light/30 text-think-text font-bold py-3.5 px-6 rounded-xl text-base transition-all duration-200 inline-flex items-center gap-2 hover:text-white shrink-0"
                >
                    <Home className="w-4 h-4" />
                    <span>Main Menu</span>
                </button>
                <button
                    onClick={onNextLevel}
                    className="bg-think-red hover:bg-red-600 text-white font-bold py-3.5 px-8 rounded-xl text-base transition-all duration-300 shadow-lg shadow-think-red/20 inline-flex items-center gap-2 shrink-0 group"
                >
                    <span>{isLastLevel ? 'Finish & Summary' : 'Next Level'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>
        </motion.div>
    );
}

const ProductivityReport: React.FC<{totalTrackpointTime: number, totalOtherTime: number}> = ({ totalTrackpointTime, totalOtherTime }) => {
    if (totalTrackpointTime >= totalOtherTime) {
         return (
            <div className="bg-blue-900/10 p-5 rounded-xl border border-blue-400/20 text-left space-y-2 max-w-xl mx-auto">
                <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Efficiency Calibration
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                    Your mouse or trackpad was slightly faster in this run. With ongoing training, the trackpoint's unique nesting near the keyboard home-row eliminates hand-travel lag and eventually yields significant gains. Keep practicing!
                </p>
            </div>
        );
    }
    
    const improvementPercentage = (totalOtherTime - totalTrackpointTime) / totalOtherTime;
    const weeklyWorkMinutes = 40 * 60;
    const relevantWorkMinutes = weeklyWorkMinutes * 0.25; // 25% pointing workload
    const minutesSaved = Math.round(relevantWorkMinutes * improvementPercentage);

    return (
        <div className="bg-think-red/5 p-6 rounded-xl border border-think-red/20 text-left space-y-3 max-w-xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-think-red/5 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="text-lg font-bold text-think-red flex items-center gap-2 font-mono uppercase tracking-wider">
                <TrendingUp className="w-5 h-5" />
                Productivity Multiplier Unlocked
            </h3>
            
            <p className="text-sm text-gray-300 leading-relaxed">
                By maintaining hands-on posture, you navigated the course <span className="font-extrabold text-white text-base px-1.5 py-0.5 bg-think-red/15 rounded border border-think-red/20">{(improvementPercentage * 100).toFixed(0)}% faster</span> using the keyboard-nesting TrackPoint dome!
            </p>

            <div className="pt-2">
                <span className="text-xs font-mono font-bold text-gray-400 uppercase block">PROJECTED WEEKLY SAVING</span>
                <span className="text-2xl md:text-3xl font-black text-yellow-400 tracking-tight flex items-center gap-2 mt-1">
                    <Flame className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" />
                    <span>{minutesSaved} Minutes Saved</span>
                </span>
                <p className="text-xs text-gray-500 mt-1">Calculated over a standard 40-hour office work cycle containing 25% pure pointing interaction.</p>
            </div>
        </div>
    )
}

const FinishedContent: React.FC<{ scores: Score[], onGoToMenu: () => void, onSaveHighScore: (name: string, score: number) => void }> = ({ scores, onGoToMenu, onSaveHighScore }) => {
    const [playerName, setPlayerName] = useState('');
    const [isScoreSaved, setIsScoreSaved] = useState(false);

    // Summing minimum scores per level
    const totalTrackpointTime = LEVELS.reduce((sum, level) => {
        const levelScores = scores.filter(s => s.levelId === level.id - 1 && s.device === 'trackpoint').map(s => s.time);
        return sum + (levelScores.length > 0 ? Math.min(...levelScores) : 0);
    }, 0);

    const totalOtherTime = LEVELS.reduce((sum, level) => {
        const levelScores = scores.filter(s => s.levelId === level.id - 1 && s.device === 'other').map(s => s.time);
        return sum + (levelScores.length > 0 ? Math.min(...levelScores) : 0);
    }, 0);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (playerName.trim()) {
            onSaveHighScore(playerName.trim(), Number(totalTrackpointTime.toFixed(1)));
            setIsScoreSaved(true);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full space-y-6">
            <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                    CALIBRATION COMPLETED
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">Evaluation Completed!</h2>
                <p className="text-sm text-gray-400 mt-1">Final calibrated steering index diagnostics report.</p>
            </div>

            {/* Performance Ledger Table */}
            <div className="bg-think-bg/85 border border-think-gray-light/20 rounded-2xl shadow-xl overflow-hidden max-w-xl mx-auto">
                 <table className="w-full text-left border-collapse font-mono">
                    <thead>
                        <tr className="border-b border-think-gray-light/20 bg-think-gray-dark/40 text-xs text-gray-400 uppercase tracking-wider font-bold">
                            <th className="p-4">Level Track</th>
                            <th className="p-4 text-center text-think-red">TrackPoint</th>
                            <th className="p-4 text-center text-blue-400">Mouse/Pad</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-think-gray-light/10 text-sm">
                        {LEVELS.map(level => {
                            const trackpointScores = scores.filter(s => s.levelId === level.id - 1 && s.device === 'trackpoint').map(s => s.time);
                            const otherScores = scores.filter(s => s.levelId === level.id - 1 && s.device === 'other').map(s => s.time);
                            const bestTrackpoint = trackpointScores.length > 0 ? Math.min(...trackpointScores) : null;
                            const bestOther = otherScores.length > 0 ? Math.min(...otherScores) : null;
                            const winner = bestTrackpoint !== null && bestOther !== null && bestTrackpoint < bestOther;

                            return (
                                <motion.tr key={level.id} variants={rowVariants} className="hover:bg-think-gray-dark/10 transition-colors">
                                    <td className="p-4 font-sans font-bold text-white text-left">{level.name}</td>
                                    <td className={`p-4 text-center font-bold text-base ${winner ? 'text-yellow-400 font-black' : 'text-gray-300'}`}>
                                        {bestTrackpoint !== null ? `${bestTrackpoint.toFixed(1)}s` : '-'}
                                    </td>
                                    <td className="p-4 text-center text-gray-400 text-base">
                                        {bestOther !== null ? `${bestOther.toFixed(1)}s` : '-'}
                                    </td>
                                </motion.tr>
                            )
                        })}
                    </tbody>
                 </table>
            </div>

            {/* High score board submission */}
            {totalTrackpointTime > 0 && !isScoreSaved && (
                <div className="bg-think-gray-dark border border-think-gray-light/20 p-5 rounded-2xl max-w-xl mx-auto text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-start gap-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/35 p-3 rounded-xl text-yellow-400 shrink-0">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div className="space-y-1 flex-grow">
                            <h3 className="text-lg font-bold text-white">Save your record</h3>
                            <p className="text-xs text-gray-400">Total TrackPoint Steer: <span className="text-yellow-300 font-bold font-mono text-sm">{totalTrackpointTime.toFixed(1)}s</span></p>
                            
                            <form onSubmit={handleSave} className="flex flex-col sm:flex-row items-center gap-2 mt-3 w-full">
                                <input
                                    type="text"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    placeholder="Operator Initials"
                                    maxLength={15}
                                    className="bg-think-bg text-white px-4 py-2.5 rounded-xl border border-think-gray-light/30 focus:border-think-red focus:outline-none transition-all w-full text-sm font-mono"
                                    required
                                />
                                <button type="submit" className="bg-think-red hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors duration-200 shrink-0 flex items-center justify-center gap-1 w-full sm:w-auto">
                                    <Save className="w-4 h-4" />
                                    <span>Commit</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isScoreSaved && (
                <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/30 text-center max-w-xl mx-auto flex items-center justify-center gap-2 text-emerald-400 font-bold">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span>Performance record logged successfully to the Leaderboard!</span>
                </div>
            )}

            <ProductivityReport totalTrackpointTime={totalTrackpointTime} totalOtherTime={totalOtherTime} />

            <div className="pt-4 flex justify-center">
                 <button
                    onClick={onGoToMenu}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-8 rounded-xl text-base transition-all duration-300 shadow-lg shadow-blue-600/20 inline-flex items-center gap-2 group shrink-0"
                >
                    <Home className="w-4 h-4" />
                    <span>Return to Main Terminal</span>
                </button>
            </div>
        </motion.div>
    )
}

const EndScreen: React.FC<EndScreenProps> = (props) => {
  return (
    <div className="w-full flex justify-center py-4">
      <div className="text-center bg-think-gray-dark/95 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl max-w-2xl w-full border border-think-gray-light/20 relative">
          {props.status === 'comparison' && <ComparisonContent {...props} />}
          {props.status === 'finished' && <FinishedContent scores={props.scores} onGoToMenu={props.onGoToMenu} onSaveHighScore={props.onSaveHighScore} />}
      </div>
    </div>
  );
};

export default EndScreen;
