import React, { useState, useCallback, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import Header from './components/Header';
import { LEVELS } from './constants';
import { GameState, InputDevice, Score, HighScore } from './types';
import IntermissionScreen from './components/IntermissionScreen';
import OnboardingScreen from './components/OnboardingScreen';
import { motion, AnimatePresence } from 'motion/react';

const SCORES_STORAGE_KEY = 'trackpoint-navigator-scores';
const HIGH_SCORES_STORAGE_KEY = 'trackpoint-navigator-highscores';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [trialDevice, setTrialDevice] = useState<InputDevice>('other');
  const [scores, setScores] = useState<Score[]>([]);
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  // Load scores and high scores from localStorage on initial mount
  useEffect(() => {
    try {
      const storedScores = localStorage.getItem(SCORES_STORAGE_KEY);
      if (storedScores) {
        setScores(JSON.parse(storedScores));
      }
      const storedHighScores = localStorage.getItem(HIGH_SCORES_STORAGE_KEY);
      if (storedHighScores) {
        setHighScores(JSON.parse(storedHighScores));
      }
    } catch (error) {
      console.error("Failed to load scores from localStorage", error);
    }
  }, []);

  // Save scores to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(scores));
    } catch (error) {
      console.error("Failed to save scores to localStorage", error);
    }
  }, [scores]);
  
  // Save high scores to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(HIGH_SCORES_STORAGE_KEY, JSON.stringify(highScores));
    } catch (error) {
      console.error("Failed to save high scores to localStorage", error);
    }
  }, [highScores]);

  // Enhanced stopwatch with decisecond (100ms) high precision resolution
  useEffect(() => {
    let timer: number;
    if (isTimerRunning) {
      setTime(0);
      timer = window.setInterval(() => {
        setTime(prevTime => Number((prevTime + 0.1).toFixed(1)));
      }, 100);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTimerRunning]);
  
  const handleContinueFromOnboarding = useCallback(() => {
    setGameState('welcome');
  }, []);

  const handleStartGame = useCallback(() => {
    setCurrentLevel(0);
    setTrialDevice('other');
    setScores([]); // Clear previous attempt scores
    setGameState('playing');
    setIsTimerRunning(false);
    setTime(0);
  }, []);
  
  const handleStartTrial = useCallback(() => {
    setGameState('playing');
    setIsTimerRunning(false);
    setTime(0);
  }, []);

  const handleGameActive = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  const handleWin = useCallback(() => {
    setIsTimerRunning(false);
    const newScore: Score = {
      levelId: currentLevel,
      time: time,
      device: trialDevice,
    };
    setScores(prev => [...prev, newScore]);

    if (trialDevice === 'other') {
      setTrialDevice('trackpoint');
      setGameState('intermission');
    } else {
      setGameState('comparison');
    }
  }, [time, trialDevice, currentLevel]);

  const handleNextLevel = useCallback(() => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setTrialDevice('other');
      setGameState('intermission');
    } else {
      setGameState('finished');
    }
  }, [currentLevel]);

  const handleGoToMenu = useCallback(() => {
    setGameState('welcome');
    setCurrentLevel(0);
    setTrialDevice('other');
  }, []);

  const handleSaveHighScore = useCallback((name: string, score: number) => {
    const newHighScore: HighScore = { name, score };
    const updatedHighScores = [...highScores, newHighScore]
      .sort((a, b) => a.score - b.score) // Sort by lowest time
      .slice(0, 5); // Keep top 5
    setHighScores(updatedHighScores);
  }, [highScores]);

  const renderContent = () => {
    switch (gameState) {
      case 'onboarding':
        return <OnboardingScreen onContinue={handleContinueFromOnboarding} />;
      case 'welcome':
        return <WelcomeScreen onStart={handleStartGame} highScores={highScores} />;
      case 'intermission':
        return <IntermissionScreen 
                  device={trialDevice} 
                  levelName={LEVELS[currentLevel].name}
                  levelIndex={currentLevel}
                  totalLevels={LEVELS.length}
                  onStartTrial={handleStartTrial} 
                />;
      case 'playing':
        return (
          <GameScreen
            level={LEVELS[currentLevel]}
            levelIndex={currentLevel}
            totalLevels={LEVELS.length}
            time={time}
            device={trialDevice}
            onWin={handleWin}
            onGameActive={handleGameActive}
          />
        );
      case 'comparison':
      case 'finished':
        return (
          <EndScreen
            status={gameState}
            level={currentLevel}
            scores={scores}
            onNextLevel={handleNextLevel}
            onGoToMenu={handleGoToMenu}
            onSaveHighScore={handleSaveHighScore}
            isLastLevel={currentLevel === LEVELS.length - 1}
          />
        );
      default:
        return <WelcomeScreen onStart={handleStartGame} highScores={highScores} />;
    }
  };

  return (
    <div className="min-h-screen bg-think-bg text-think-text flex flex-col font-sans relative overflow-x-hidden selection:bg-think-red/25 selection:text-white">
      {/* Top ambient backlight mask */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-think-red/5 rounded-full blur-3xl pointer-events-none z-0" />
      
      <Header onStartOver={handleGoToMenu} gameState={gameState} />
      
      <main className="flex-grow flex items-center justify-center w-full relative z-10 py-6 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="w-full max-w-6xl flex justify-center items-center"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
