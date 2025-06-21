import React from 'react';

export const GameRules: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">📖</span>
        ゲームのルール
      </h3>
      
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
          <p>画面に表示されたお題の言葉を確認しましょう</p>
        </div>
        
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
          <p><strong>お題の言葉を使わずに</strong>その特徴を説明してください</p>
        </div>
        
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
          <p>AIがあなたの説明から答えを推測します</p>
        </div>
        
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
          <p>AIの推測が正解なら成功！理由付きで結果を表示します</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
        <h4 className="font-medium text-gray-900 mb-2">💡 コツ</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• 具体的な特徴や用途を説明する</li>
          <li>• 色、形、大きさなどの外見を描写する</li>
          <li>• 関連する場所や状況を説明する</li>
          <li>• お題の言葉は絶対に使わない</li>
        </ul>
      </div>
    </div>
  );
};
