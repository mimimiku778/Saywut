import React from 'react'
import type { DifficultyLevel } from '../data/topics'
import { Button } from '@/components/ui/8bit/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/8bit/card'

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel
  onDifficultyChange: (difficulty: DifficultyLevel) => void
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onDifficultyChange,
}) => {
  return (
    <Card className="retro">
      <CardHeader>
        <CardTitle className="text-center retro">難易度選択</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Button
            onClick={() => onDifficultyChange('normal')}
            className={`flex-1 py-3 retro ${
              currentDifficulty === 'normal'
                ? 'bg-blue-600 text-white'
                : 'bg-secondary text-secondary-foreground'
            }`}
            font="retro"
          >
            <div className="text-center">
              <div className="text-lg font-bold">ノーマル</div>
            </div>
          </Button>
          
          <Button
            onClick={() => onDifficultyChange('hard')}
            className={`flex-1 py-3 retro ${
              currentDifficulty === 'hard'
                ? 'bg-red-600 text-white'
                : 'bg-secondary text-secondary-foreground'
            }`}
            font="retro"
          >
            <div className="text-center">
              <div className="text-lg font-bold">ハード</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}