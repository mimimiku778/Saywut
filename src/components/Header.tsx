import React from 'react'

interface HeaderProps {
  score: number
  totalQuestions: number
}

export const Header: React.FC<HeaderProps> = ({ score, totalQuestions }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AIクイズゲーム</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-full px-4 py-2">
              <span className="text-sm font-medium text-gray-600">
                スコア: <span className="text-blue-600 font-bold">{score}</span>
                {totalQuestions > 0 && (
                  <>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-600">{totalQuestions}</span>
                  </>
                )}
              </span>
            </div>
            {totalQuestions > 0 && (
              <div className="bg-blue-100 rounded-full px-3 py-1">
                <span className="text-xs font-medium text-blue-600">
                  正答率: {Math.round((score / totalQuestions) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
