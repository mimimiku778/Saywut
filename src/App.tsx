import { Header } from './components/Header'
import { GameBoard } from './components/GameBoard'
import { ResultDisplay } from './components/ResultDisplay'
import { GameRules } from './components/GameRules'
import { AIServiceSelector } from './components/AIServiceSelector'
import { useGameState } from './hooks/useGameState'

function App() {
  const { gameState, submitGuess, nextQuestion, resetGame, updateUserInput } = useGameState()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <Header score={gameState.score} totalQuestions={gameState.totalQuestions} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* AIサービス選択 */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <AIServiceSelector />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインゲームエリア */}
          <div className="lg:col-span-2 space-y-6">
            <GameBoard
              currentTopic={gameState.currentTopic}
              userInput={gameState.userInput}
              onInputChange={updateUserInput}
              onSubmit={submitGuess}
              isLoading={gameState.isLoading}
              disabled={gameState.isLoading || gameState.isCorrect !== null}
            />

            {gameState.aiResponse && (
              <ResultDisplay
                aiResponse={gameState.aiResponse}
                isCorrect={gameState.isCorrect}
                onNextQuestion={nextQuestion}
                onResetGame={resetGame}
              />
            )}
          </div>

          {/* サイドパネル */}
          <div className="lg:col-span-1">
            <GameRules />
          </div>
        </div>

        {/* フッター */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>🤖 AIクイズゲーム - React版</p>
          <p className="mt-1">AIに言葉を当てさせるシンプルなゲーム</p>
        </footer>
      </main>
    </div>
  )
}

export default App
