import { AIResponse } from '../types'
import { BaseAIService } from './baseAIService'

/**
 * Chrome Built-in AI (Gemini Nano) を使用するサービス
 */
export class ChromeAIService extends BaseAIService {
  private model: any = null
  private isInitialized = false

  getServiceName(): string {
    return 'Chrome Built-in AI (Gemini Nano)'
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (!window.ai?.languageModel) {
        return false
      }

      const capabilities = await window.ai.languageModel.capabilities()
      return capabilities.available === 'readily' || capabilities.available === 'after-download'
    } catch (error) {
      console.error('Chrome AI 利用可能性チェックエラー:', error)
      return false
    }
  }

  private async initializeModel(): Promise<boolean> {
    try {
      if (this.isInitialized && this.model) {
        return true
      }

      if (!window.ai?.languageModel) {
        return false
      }

      const capabilities = await window.ai.languageModel.capabilities()
      if (capabilities.available !== 'readily' && capabilities.available !== 'after-download') {
        return false
      }

      // 最新のAPI構文を使用してモデルを作成
      this.model = await window.ai.languageModel.create({
        systemPrompt:
          'あなたは推理ゲームのプレイヤーです。ユーザーの説明から何を指しているかを推測してください。JSON形式で回答し、guess（推測）、reasoning（理由）、confidence（確信度0-1）を含めてください。',
        temperature: 0.7,
        topK: 3,
      })

      this.isInitialized = true
      console.log('Chrome Built-in AI (Gemini Nano) が初期化されました')
      return true
    } catch (error) {
      console.error('Chrome AI初期化エラー:', error)
      this.isInitialized = false
      return false
    }
  }

  async generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse> {
    try {
      // モデルの初期化を確認
      const initialized = await this.initializeModel()
      if (!initialized) {
        return this.createErrorResponse('Chrome AI が利用できません')
      }

      const prompt = this.createPrompt(userInput, correctAnswer)

      // ストリーミング機能がある場合は使用、なければ通常のpromptを使用
      let responseText = ''
      if (this.model.promptStreaming) {
        const stream = this.model.promptStreaming(prompt)
        for await (const chunk of stream) {
          responseText += chunk
        }
      } else {
        responseText = await this.model.prompt(prompt)
      }

      return this.parseAIResponse(responseText)
    } catch (error) {
      console.error('Chrome AI エラー:', error)
      return this.createErrorResponse('Chrome AIでエラーが発生しました。')
    }
  }

  /**
   * モデルを破棄してリソースを解放する
   */
  destroy(): void {
    if (this.model && typeof this.model.destroy === 'function') {
      this.model.destroy()
    }
    this.model = null
    this.isInitialized = false
  }
}
