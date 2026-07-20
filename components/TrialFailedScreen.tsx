import React from 'react';
import { CloseIcon } from './icons';

interface TrialFailedScreenProps {
  onRetry: () => void;
  onGoToMenu: () => void;
}

const TrialFailedScreen: React.FC<TrialFailedScreenProps> = ({ onRetry, onGoToMenu }) => {
  return (
    <div className="text-center bg-think-gray-dark p-8 rounded-lg shadow-2xl max-w-lg w-full animate-fade-in border border-think-gray-light/50">
      <div className="flex justify-center mb-4">
        <CloseIcon className="w-20 h-20 text-think-red" />
      </div>
      <h2 className="text-4xl font-extrabold mb-2 text-think-red">You Hit a Wall!</h2>
      <p className="text-lg text-gray-300 mb-6">
        Precision is key. Don't give up!
      </p>
      <div className="flex justify-center flex-wrap gap-4 mt-8">
        <button
            onClick={onGoToMenu}
            className="bg-think-gray-light text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-600 transition-colors duration-200"
        >
            Main Menu
        </button>
        <button
            onClick={onRetry}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-colors duration-200"
        >
            Try Again
        </button>
      </div>
    </div>
  );
};

export default TrialFailedScreen;