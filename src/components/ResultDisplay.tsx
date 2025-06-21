import React from 'react'
import { Button } from '@/components/ui/8bit/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/8bit/card'

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

  const resultIcon = isCorrect === true ? '🎉' : isCorrect === false ? '😔' : '🤖'
  const resultText = isCorrect === true ? '正解！' : isCorrect === false ? '不正解' : '結果'

  return (
    <Card className="retro">
      <CardHeader className="text-center">
        <div
          className={`inline-flex items-center space-x-2 px-4 py-2 retro ${
            isCorrect === true
              ? 'bg-green-600 text-white'
              : isCorrect === false
                ? 'bg-red-600 text-white'
                : 'bg-muted text-muted-foreground'
          }`}
        >
          <span className="text-xl">{resultIcon}</span>
          <span className="font-semibold retro">{resultText}</span>
        </div>
      </CardHeader>

      <CardContent>
        <Card
          className={`p-6 border-2 retro ${
            isCorrect === true
              ? 'bg-green-100 border-green-600'
              : isCorrect === false
                ? 'bg-red-100 border-red-600'
                : 'bg-muted border-border'
          }`}
        >
          <CardTitle className="mb-3 retro">AIの回答</CardTitle>
          <div className="whitespace-pre-line text-sm leading-relaxed retro">
            {aiResponse}
          </div>
        </Card>

        <div className="flex space-x-4 mt-6">
          <Button
            onClick={onNextQuestion}
            className="flex-1 bg-blue-600 text-white retro"
            font="retro"
          >
            次の問題
          </Button>
          <Button
            onClick={onResetGame}
            className="px-6 py-3 retro"
            variant="secondary"
            font="retro"
          >
            リセット
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
