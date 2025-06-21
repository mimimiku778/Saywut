import React from 'react'
import type { DifficultyLevel } from '../data/topics'

interface GameBoardProps {
  currentTopic: string
  userInput: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  disabled: boolean
  difficulty: DifficultyLevel
}

export const GameBoard: React.FC<GameBoardProps> = ({
  currentTopic,
  userInput,
  onInputChange,
  onSubmit,
  isLoading,
  disabled,
  difficulty,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!disabled && userInput.trim()) {
      onSubmit()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <h2 className="text-lg font-medium text-gray-600">お題</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            difficulty === 'hard' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {difficulty === 'hard' ? 'ハード' : 'ノーマル'}
          </span>
        </div>
        <div className={`text-white rounded-xl py-6 px-8 ${
          difficulty === 'hard'
            ? 'bg-gradient-to-r from-red-500 to-pink-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-600'
        }`}>
          <span className="text-4xl font-bold">{currentTopic}</span>
        </div>
        <p className="text-sm text-gray-500 mt-3">上記の言葉を使わずに特徴を説明してください</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            特徴を説明してください
          </label>
          <textarea
            id="description"
            value={userInput}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={`「${currentTopic}」を使わずに特徴を説明してください...`}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 transition-all duration-200"
            disabled={disabled}
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !userInput.trim() || isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>AIが考え中...</span>
            </div>
          ) : (
            'AIに推測させる'
          )}
        </button>
      </form>
    </div>
  )
}
