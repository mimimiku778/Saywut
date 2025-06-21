import { AIResponse } from '../types'
import { IAIService, AIServiceType } from './types'
import { AIServiceFactory } from './aiServiceFactory'
import { getRandomTopic } from '../data'

/**
 * AIサービス管理クラス
 * フロントエンドからAIサービスを利用するための統一インターフェース
 */
export class AIServiceManager {
  private static currentService: IAIService | null = null
  private static currentServiceType: AIServiceType | null = null

  /**
   * AIサービスを初期化する
   * デフォルトではGemini Nanoを使用し、利用できない場合はOpenAIにフォールバック
   */
  static async initialize(): Promise<IAIService> {
    try {
      this.currentService = await AIServiceFactory.getBestAvailableService()
      console.log(`${this.currentService.getServiceName()} を使用します`)
      return this.currentService
    } catch (error) {
      console.error('AIサービスの初期化に失敗しました:', error)
      throw error
    }
  }

  /**
   * 特定のAIサービスに切り替える
   */
  static async switchToService(serviceType: AIServiceType): Promise<IAIService> {
    try {
      this.currentService = await AIServiceFactory.createService(serviceType)
      this.currentServiceType = serviceType
      console.log(`${this.currentService.getServiceName()} に切り替えました`)
      return this.currentService
    } catch (error) {
      console.error(`${serviceType}への切り替えに失敗しました:`, error)
      throw error
    }
  }

  /**
   * 現在のAIサービスを取得する
   */
  static async getCurrentService(): Promise<IAIService> {
    if (!this.currentService) {
      return await this.initialize()
    }
    return this.currentService
  }

  /**
   * 利用可能なAIサービスのリストを取得する
   */
  static async getAvailableServices(): Promise<{ type: AIServiceType; name: string }[]> {
    const available = await AIServiceFactory.getAvailableServices()
    return available.map(({ type, service }) => ({
      type,
      name: service.getServiceName(),
    }))
  }

  /**
   * 現在のサービスタイプを取得する
   */
  static getCurrentServiceType(): AIServiceType | null {
    return this.currentServiceType
  }

  /**
   * OpenAI APIキーを設定する
   */
  static setOpenAIApiKey(apiKey: string): void {
    AIServiceFactory.updateConfig({ openaiApiKey: apiKey })
    // OpenAIサービスが現在使用中の場合は再初期化
    if (this.currentServiceType === 'openai') {
      AIServiceFactory.removeInstance('openai')
      this.currentService = null
    }
  }

  /**
   * デフォルトサービスを設定する
   */
  static setDefaultService(serviceType: AIServiceType): void {
    AIServiceFactory.updateConfig({ defaultService: serviceType })
  }

  /**
   * サービスをリセットする
   */
  static reset(): void {
    AIServiceFactory.clearInstances()
    this.currentService = null
    this.currentServiceType = null
  }
}

// 後方互換性のためのエクスポート
export const getAIService = async (): Promise<IAIService> => {
  return await AIServiceManager.getCurrentService()
}

// 簡単なインターフェースのエクスポート
export const aiService = {
  async generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse> {
    const service = await getAIService()
    return service.generateResponse(userInput, correctAnswer)
  },

  async validateUserInput(userInput: string, correctAnswer: string): Promise<AIResponse> {
    const service = await getAIService()
    return service.validateUserInput(userInput, correctAnswer)
  },

  getRandomTopic(): string {
    return getRandomTopic()
  },

  async switchService(serviceType: AIServiceType): Promise<void> {
    await AIServiceManager.switchToService(serviceType)
  },

  async getAvailableServices(): Promise<{ type: AIServiceType; name: string }[]> {
    return await AIServiceManager.getAvailableServices()
  },
}
