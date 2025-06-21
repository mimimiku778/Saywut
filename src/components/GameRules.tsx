import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/8bit/card'

export const GameRules: React.FC = () => {
  return (
    <Card className="bg-blue-100 border-blue-600 border-2 retro">
      <CardHeader>
        <CardTitle className="flex items-center retro">
          <span className="mr-2">📖</span>
          ゲームのルール
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 text-sm retro">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white flex items-center justify-center text-xs font-bold retro">
              1
            </span>
            <p>画面に表示されたお題の言葉を確認しましょう</p>
          </div>

          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white flex items-center justify-center text-xs font-bold retro">
              2
            </span>
            <p>
              <strong>お題の言葉を使わずに</strong>その特徴を説明してください
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white flex items-center justify-center text-xs font-bold retro">
              3
            </span>
            <p>AIがあなたの説明から答えを推測します</p>
          </div>

          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white flex items-center justify-center text-xs font-bold retro">
              4
            </span>
            <p>AIの推測が正解なら成功！理由付きで結果を表示します</p>
          </div>
        </div>

        <Card className="mt-6 p-4 bg-background border-2 border-foreground retro">
          <CardTitle className="mb-2 retro">💡 コツ</CardTitle>
          <ul className="text-xs space-y-1 retro">
            <li>• 具体的な特徴や用途を説明する</li>
            <li>• 色、形、大きさなどの外見を描写する</li>
            <li>• 関連する場所や状況を説明する</li>
            <li>• お題の言葉は絶対に使わない</li>
          </ul>
        </Card>
      </CardContent>
    </Card>
  )
}
