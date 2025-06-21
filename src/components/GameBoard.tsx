import React from 'react'
import type { DifficultyLevel } from '../data/topics'
import { Button } from '@/components/ui/8bit/button'
import { Card, CardContent, CardHeader } from '@/components/ui/8bit/card'
import { Label } from '@/components/ui/8bit/label'

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
    <Card className="retro">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-lg font-medium">お題</h2>
          <span className={`px-3 py-1 text-xs font-medium retro ${
            difficulty === 'hard' 
              ? 'bg-red-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            {difficulty === 'hard' ? 'ハード' : 'ノーマル'}
          </span>
        </div>
        <div className={`text-white py-6 px-8 retro ${
          difficulty === 'hard'
            ? 'bg-red-600'
            : 'bg-blue-600'
        }`}>
          <span className="text-4xl font-bold retro">{currentTopic}</span>
        </div>
        <p className="text-sm mt-3 retro">上記の言葉を使わずに特徴を説明してください</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="description" className="retro">
              特徴を説明してください
            </Label>
            <textarea
              id="description"
              value={userInput}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={`「${currentTopic}」を使わずに特徴を説明してください...`}
              className="w-full px-4 py-3 border-2 border-foreground focus:outline-none focus:border-primary resize-none h-32 mt-2 retro bg-background"
              disabled={disabled}
            />
          </div>

          <Button
            type="submit"
            disabled={disabled || !userInput.trim() || isLoading}
            className="w-full py-4 retro"
            font="retro"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin"></div>
                <span>AIが考え中...</span>
              </div>
            ) : (
              'AIに推測させる'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
