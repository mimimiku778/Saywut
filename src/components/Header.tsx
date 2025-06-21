import React from 'react'
import { Card } from '@/components/ui/8bit/card'

interface HeaderProps {
  score: number
  totalQuestions: number
}

export const Header: React.FC<HeaderProps> = ({ score, totalQuestions }) => {
  return (
    <header className="bg-background border-b-4 border-foreground sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center retro">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <h1 className="text-2xl font-bold retro">AIクイズゲーム</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Card className="px-4 py-2 retro">
              <span className="text-sm font-medium retro">
                スコア: <span className="text-blue-600 font-bold">{score}</span>
                {totalQuestions > 0 && (
                  <>
                    <span className="mx-1">/</span>
                    <span>{totalQuestions}</span>
                  </>
                )}
              </span>
            </Card>
            {totalQuestions > 0 && (
              <Card className="px-3 py-1 bg-blue-600 text-white retro">
                <span className="text-xs font-medium retro">
                  正答率: {Math.round((score / totalQuestions) * 100)}%
                </span>
              </Card>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
