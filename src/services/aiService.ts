import OpenAI from 'openai'
import { AIResponse } from '../types'

// 基本的なAIサービスの抽象クラス
abstract class BaseAIService {
  protected topics = [
    '桜', 'ラーメン', '富士山', '電車', '猫', 'スマートフォン', '寿司', '本', 
    'コーヒー', '雨', 'ピアノ', '海', '花火', '雪', '太陽', '月', '星', 
    '風', '虹', '蝶', '鳥', '犬', '魚', '花', '木', '川', '山', '森', '空'
  ]

  abstract generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse>

  getRandomTopic(): string {
    return this.topics[Math.floor(Math.random() * this.topics.length)]
  }

  protected createPrompt(userInput: string, correctAnswer: string): string {
    return `あなたは推理ゲームのプレイヤーです。ユーザーが何かを説明しており、それが何を指しているかを推測する必要があります。

ルール:
1. ユーザーの説明から推測される単語を1つ答えてください
2. 推測の根拠を簡潔に説明してください
3. 確信度を0.0〜1.0で評価してください
4. 正解の単語「${correctAnswer}」が説明に直接含まれている場合は、ルール違反として指摘してください

ユーザーの説明: "${userInput}"

以下のJSON形式で回答してください:
{
  "guess": "推測した単語",
  "reasoning": "推測の根拠",
  "confidence": 確信度（0.0〜1.0の数値）
}`
  }

  protected parseAIResponse(responseText: string): AIResponse {
    try {
      // JSONレスポンスの抽出を試行
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          guess: parsed.guess || '不明',
          reasoning: parsed.reasoning || '判断できませんでした。',
          confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5))
        }
      }
      
      // JSONが見つからない場合のフォールバック
      return {
        guess: this.topics[Math.floor(Math.random() * this.topics.length)],
        reasoning: 'AIの応答を解析できませんでした。',
        confidence: 0.3
      }
    } catch (error) {
      console.error('AIレスポンス解析エラー:', error)
      return {
        guess: this.topics[Math.floor(Math.random() * this.topics.length)],
        reasoning: 'AIの応答を解析できませんでした。',
        confidence: 0.3
      }
    }
  }
}

// OpenAI APIを使用するサービス
class OpenAIService extends BaseAIService {
  private openai: OpenAI
  
  constructor() {
    super()
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OpenAI APIキーが設定されていません。.envファイルでVITE_OPENAI_API_KEYを設定してください。')
    }
    
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // ブラウザでの使用を許可（本番環境では推奨されません）
    })
  }

  async generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-1106-preview', // GPT-4 Turboを使用（gpt-4.1 nanoが利用可能でない場合）
        messages: [
          {
            role: 'user',
            content: this.createPrompt(userInput, correctAnswer)
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      const responseText = response.choices[0]?.message?.content || ''
      return this.parseAIResponse(responseText)
    } catch (error) {
      console.error('OpenAI API エラー:', error)
      return {
        guess: this.topics[Math.floor(Math.random() * this.topics.length)],
        reasoning: 'APIエラーが発生しました。',
        confidence: 0.3
      }
    }
  }
}

// Chrome Built-in AI (Gemini Nano)を使用するサービス
class ChromeAIService extends BaseAIService {
  private model: any = null

  async initializeModel(): Promise<boolean> {
    try {
      // Chrome Built-in AI API の最新構文（2025年対応）
      if (!window.ai?.languageModel) {
        return false
      }

      const capabilities = await window.ai.languageModel.capabilities()
      if (capabilities.available !== 'readily' && capabilities.available !== 'after-download') {
        return false
      }

      // 最新のAPI構文を使用
      this.model = await window.ai.languageModel.create({
        systemPrompt: 'あなたは推理ゲームのプレイヤーです。ユーザーの説明から何を指しているかを推測してください。JSON形式で回答し、guess（推測）、reasoning（理由）、confidence（確信度0-1）を含めてください。',
        temperature: 0.7,
        topK: 3
      })

      return true
    } catch (error) {
      console.error('Chrome AI初期化エラー:', error)
      return false
    }
  }

  async generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse> {
    try {
      if (!this.model) {
        const initialized = await this.initializeModel()
        if (!initialized) {
          throw new Error('Chrome AI が利用できません')
        }
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
      return {
        guess: this.topics[Math.floor(Math.random() * this.topics.length)],
        reasoning: 'Chrome AIでエラーが発生しました。',
        confidence: 0.3
      }
    }
  }
}

// AIサービスファクトリー
class AIServiceFactory {
  private static instance: BaseAIService | null = null

  static async createService(): Promise<BaseAIService> {
    if (this.instance) {
      return this.instance
    }

    // 環境変数でChrome AIの使用が指定されている場合
    const useChromeAI = import.meta.env.VITE_USE_CHROME_AI === 'true'
    
    if (useChromeAI) {
      const chromeService = new ChromeAIService()
      const isAvailable = await chromeService.initializeModel()
      
      if (isAvailable) {
        console.log('Chrome Built-in AI (Gemini Nano) を使用します')
        this.instance = chromeService
        return this.instance
      } else {
        console.log('Chrome AIが利用できません。OpenAI APIにフォールバックします。')
      }
    }

    // OpenAI APIを使用
    try {
      console.log('OpenAI API を使用します')
      this.instance = new OpenAIService()
      return this.instance
    } catch (error) {
      console.error('AIサービスの初期化に失敗しました:', error)
      throw error
    }
  }

  static resetInstance(): void {
    this.instance = null
  }
}

// サービスのインスタンスを作成してエクスポート
let aiServiceInstance: BaseAIService | null = null

export const getAIService = async (): Promise<BaseAIService> => {
  if (!aiServiceInstance) {
    aiServiceInstance = await AIServiceFactory.createService()
  }
  return aiServiceInstance
}

// 後方互換性のための直接エクスポート（非推奨）
export const aiService = {
  async generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse> {
    const service = await getAIService()
    return service.generateResponse(userInput, correctAnswer)
  },
  
  getRandomTopic(): string {
    return new ChromeAIService().getRandomTopic()
  }
}
