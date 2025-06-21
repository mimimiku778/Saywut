import OpenAI from 'openai'
import { AIResponse } from '../types'
import { BaseAIService } from './baseAIService'

/**
 * OpenAI API を使用するサービス
 */
export class OpenAIService extends BaseAIService {
  private openai: OpenAI | null = null
  private apiKey: string | null = null

  constructor(apiKey?: string) {
    super()
    this.apiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY || null
  }

  getServiceName(): string {
    return 'OpenAI GPT-4'
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.warn('OpenAI APIキーが設定されていません')
        return false
      }

      // APIキーが設定されている場合のみtrueを返す
      // 実際のAPI接続テストは重いため、ここでは単純にAPIキーの存在をチェック
      return true
    } catch (error) {
      console.error('OpenAI 利用可能性チェックエラー:', error)
      return false
    }
  }

  private initializeOpenAI(): void {
    if (!this.openai && this.apiKey) {
      this.openai = new OpenAI({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true, // ブラウザでの使用を許可（本番環境では推奨されません）
      })
    }
  }

  async generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse> {
    try {
      if (!this.apiKey) {
        return this.createErrorResponse('OpenAI APIキーが設定されていません。')
      }

      this.initializeOpenAI()
      if (!this.openai) {
        return this.createErrorResponse('OpenAI サービスの初期化に失敗しました。')
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-1106-preview', // GPT-4 Turboを使用
        messages: [
          {
            role: 'user',
            content: this.createPrompt(userInput, correctAnswer),
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      const responseText = response.choices[0]?.message?.content || ''
      return this.parseAIResponse(responseText)
    } catch (error: any) {
      console.error('OpenAI API エラー:', error)

      // エラーの種類に応じてメッセージを変更
      let errorMessage = 'OpenAI APIでエラーが発生しました。'
      if (error?.error?.code === 'invalid_api_key') {
        errorMessage = 'OpenAI APIキーが無効です。'
      } else if (error?.error?.code === 'insufficient_quota') {
        errorMessage = 'OpenAI APIの使用量上限に達しています。'
      }

      return this.createErrorResponse(errorMessage)
    }
  }

  /**
   * APIキーを設定する
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
    this.openai = null // 新しいAPIキーで再初期化するためにリセット
  }

  /**
   * 現在のAPIキーが設定されているかを確認する
   */
  hasApiKey(): boolean {
    return !!this.apiKey
  }
}
