import React from 'react'

interface ResultDisplayProps {
  aiResponse: string
  isCorrect: boolean | null
  onNextQuestion: () => void
  onResetGame: () => void
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  aiResponse,
  isCorrect,
  onNextQuestion,
  onResetGame,
}) => {
  if (!aiResponse) return null

  const resultColor = isCorrect === true ? 'green' : isCorrect === false ? 'red' : 'gray'
  const resultIcon = isCorrect === true ? '🎉' : isCorrect === false ? '😔' : '🤖'
  const resultText = isCorrect === true ? '正解！' : isCorrect === false ? '不正解' : '結果'

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-6">
        <div
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
            isCorrect === true
              ? 'bg-green-100 text-green-700'
              : isCorrect === false
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          <span className="text-xl">{resultIcon}</span>
          <span className="font-semibold">{resultText}</span>
        </div>
      </div>

      <div
        className={`p-6 rounded-xl border-2 ${
          isCorrect === true
            ? 'bg-green-50 border-green-200'
            : isCorrect === false
              ? 'bg-red-50 border-red-200'
              : 'bg-gray-50 border-gray-200'
        }`}
      >
        <h3 className="font-semibold text-gray-900 mb-3">AIの回答</h3>
        <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
          {aiResponse}
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={onNextQuestion}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          次の問題
        </button>
        <button
          onClick={onResetGame}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
        >
          リセット
        </button>
      </div>
    </div>
  )
}
