import { AIResponse } from '../types'
import { IAIService } from './types'

/**
 * AIサービスの基底クラス
 */
export abstract class BaseAIService implements IAIService {
  protected readonly topics = [
    '桜',
    'ラーメン',
    '富士山',
    '電車',
    '猫',
    'スマートフォン',
    '寿司',
    '本',
    'コーヒー',
    '雨',
    'ピアノ',
    '海',
    '花火',
    '雪',
    '太陽',
    '月',
    '星',
    '風',
    '虹',
    '蝶',
    '鳥',
    '犬',
    '魚',
    '花',
    '木',
    '川',
    '山',
    '森',
    '空',
  ]

  abstract generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse>
  abstract getServiceName(): string
  abstract isAvailable(): Promise<boolean>

  getRandomTopic(): string {
    return this.topics[Math.floor(Math.random() * this.topics.length)]
  }

  /**
   * AIへのプロンプトを作成する
   */
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

  /**
   * AIの応答を解析する
   */
  protected parseAIResponse(responseText: string): AIResponse {
    try {
      // JSONレスポンスの抽出を試行
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          guess: parsed.guess || '不明',
          reasoning: parsed.reasoning || '判断できませんでした。',
          confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
        }
      }

      // JSONが見つからない場合のフォールバック
      return this.createFallbackResponse()
    } catch (error) {
      console.error('AIレスポンス解析エラー:', error)
      return this.createFallbackResponse()
    }
  }

  /**
   * フォールバック応答を作成する
   */
  protected createFallbackResponse(): AIResponse {
    return {
      guess: this.getRandomTopic(),
      reasoning: 'AIの応答を解析できませんでした。',
      confidence: 0.3,
    }
  }

  /**
   * エラー応答を作成する
   */
  protected createErrorResponse(errorMessage: string): AIResponse {
    return {
      guess: this.getRandomTopic(),
      reasoning: errorMessage,
      confidence: 0.1,
    }
  }
}
