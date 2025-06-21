import React from 'react'
import type { DifficultyLevel } from '../data/topics'

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel
  onDifficultyChange: (difficulty: DifficultyLevel) => void
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onDifficultyChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">難易度選択</h3>
      <div className="flex space-x-4">
        <button
          onClick={() => onDifficultyChange('normal')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            currentDifficulty === 'normal'
              ? 'bg-blue-500 text-white shadow-md transform scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
          }`}
        >
          <div className="text-center">
            <div className="text-lg font-bold">ノーマル</div>
          </div>
        </button>
        
        <button
          onClick={() => onDifficultyChange('hard')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            currentDifficulty === 'hard'
              ? 'bg-red-500 text-white shadow-md transform scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
          }`}
        >
          <div className="text-center">
            <div className="text-lg font-bold">ハード</div>
          </div>
        </button>
      </div>
    </div>
  )
}