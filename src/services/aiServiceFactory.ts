import { IAIService, AIServiceType, AIServiceConfig } from './types'
import { ChromeAIService } from './chromeAIService'
import { OpenAIService } from './openAIService'

/**
 * AIサービスファクトリー
 */
export class AIServiceFactory {
  private static instances: Map<AIServiceType, IAIService> = new Map()
  private static config: AIServiceConfig = {
    defaultService: 'chrome-ai', // デフォルトはGemini Nano
    enableChromeAI: true,
  }

  /**
   * 設定を更新する
   */
  static updateConfig(config: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * 設定を取得する
   */
  static getConfig(): AIServiceConfig {
    return { ...this.config }
  }

  /**
   * 指定されたタイプのAIサービスを作成する
   */
  static async createService(type: AIServiceType): Promise<IAIService> {
    // 既存のインスタンスがある場合は再利用
    const existingInstance = this.instances.get(type)
    if (existingInstance) {
      const isAvailable = await existingInstance.isAvailable()
      if (isAvailable) {
        return existingInstance
      }
    }

    let service: IAIService

    switch (type) {
      case 'chrome-ai':
        service = new ChromeAIService()
        break
      case 'openai':
        service = new OpenAIService(this.config.openaiApiKey)
        break
      default:
        throw new Error(`サポートされていないAIサービスタイプ: ${type}`)
    }

    // サービスが利用可能かチェック
    const isAvailable = await service.isAvailable()
    if (!isAvailable) {
      throw new Error(`${service.getServiceName()}が利用できません`)
    }

    this.instances.set(type, service)
    return service
  }

  /**
   * 優先順位に基づいて利用可能なAIサービスを取得する
   */
  static async getBestAvailableService(): Promise<IAIService> {
    // デフォルトサービスを最初に試す
    try {
      return await this.createService(this.config.defaultService)
    } catch (error) {
      console.warn(`デフォルトサービス(${this.config.defaultService})が利用できません:`, error)
    }

    // フォールバック: 他のサービスを試す
    const fallbackServices: AIServiceType[] =
      this.config.defaultService === 'chrome-ai' ? ['openai'] : ['chrome-ai']

    for (const serviceType of fallbackServices) {
      try {
        return await this.createService(serviceType)
      } catch (error) {
        console.warn(`フォールバックサービス(${serviceType})が利用できません:`, error)
      }
    }

    throw new Error('利用可能なAIサービスがありません')
  }

  /**
   * 利用可能なサービスのリストを取得する
   */
  static async getAvailableServices(): Promise<{ type: AIServiceType; service: IAIService }[]> {
    const available: { type: AIServiceType; service: IAIService }[] = []
    const serviceTypes: AIServiceType[] = ['chrome-ai', 'openai']

    for (const type of serviceTypes) {
      try {
        const service = await this.createService(type)
        available.push({ type, service })
      } catch (error) {
        console.log(`${type}は利用できません:`, error)
      }
    }

    return available
  }

  /**
   * 全てのインスタンスをクリアする
   */
  static clearInstances(): void {
    // Chrome AIサービスのリソースを適切に解放
    const chromeAI = this.instances.get('chrome-ai') as ChromeAIService
    if (chromeAI && typeof chromeAI.destroy === 'function') {
      chromeAI.destroy()
    }

    this.instances.clear()
  }

  /**
   * 特定のサービスインスタンスを削除する
   */
  static removeInstance(type: AIServiceType): void {
    if (type === 'chrome-ai') {
      const chromeAI = this.instances.get('chrome-ai') as ChromeAIService
      if (chromeAI && typeof chromeAI.destroy === 'function') {
        chromeAI.destroy()
      }
    }
    this.instances.delete(type)
  }
}
