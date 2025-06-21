import { AIResponse } from '../types'
import { IAIService, AIServiceType } from './types'
import { ChromeAIService } from './chromeAIService'
import { OpenAIService } from './openAIService'
import { getRandomTopic } from '../data'

/**
 * AIサービスの設定
 */
export interface AIServiceConfig {
  openaiApiKey?: string
}

let config: AIServiceConfig = {}

/**
 * 設定を更新する
 */
export function updateConfig(newConfig: Partial<AIServiceConfig>): void {
  config = { ...config, ...newConfig }
}

/**
 * 指定されたタイプのAIサービスの新しいインスタンスを作成する
 */
export function createAIService(type: AIServiceType): IAIService {
  switch (type) {
    case 'chrome-ai':
      return new ChromeAIService()
    case 'openai':
      return new OpenAIService(config.openaiApiKey)
    default:
      throw new Error(`サポートされていないAIサービスタイプ: ${type}`)
  }
}

/**
 * 利用可能な最適なAIサービスを作成する
 */
export async function createBestAvailableService(): Promise<IAIService> {
  // Chrome AIを最初に試す
  try {
    const chromeAI = createAIService('chrome-ai')
    if (await chromeAI.isAvailable()) {
      console.log(`${chromeAI.getServiceName()} を使用します`)
      return chromeAI
    }
  } catch (error) {
    console.warn('Chrome AIが利用できません:', error)
  }

  // OpenAIにフォールバック
  try {
    const openAI = createAIService('openai')
    if (await openAI.isAvailable()) {
      console.log(`${openAI.getServiceName()} を使用します`)
      return openAI
    }
  } catch (error) {
    console.warn('OpenAIが利用できません:', error)
  }

  throw new Error('利用可能なAIサービスがありません')
}

/**
 * 利用可能なサービスのリストを取得する
 */
export async function getAvailableServices(): Promise<{ type: AIServiceType; name: string }[]> {
  const available: { type: AIServiceType; name: string }[] = []
  const serviceTypes: AIServiceType[] = ['chrome-ai', 'openai']

  for (const type of serviceTypes) {
    try {
      const service = createAIService(type)
      if (await service.isAvailable()) {
        available.push({ type, name: service.getServiceName() })
      }
    } catch (error) {
      console.log(`${type}は利用できません:`, error)
    }
  }

  return available
}

// 簡単なインターフェースのエクスポート
export const aiService = {
  async generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse> {
    const service = await createBestAvailableService()
    return service.generateResponse(userInput, correctAnswer)
  },

  async validateUserInput(userInput: string, correctAnswer: string): Promise<AIResponse> {
    const service = await createBestAvailableService()
    return service.validateUserInput(userInput, correctAnswer)
  },

  getRandomTopic(): string {
    return getRandomTopic()
  },

  setOpenAIApiKey(apiKey: string): void {
    updateConfig({ openaiApiKey: apiKey })
  },

  async getAvailableServices(): Promise<{ type: AIServiceType; name: string }[]> {
    return await getAvailableServices()
  },

  createService(type: AIServiceType): IAIService {
    return createAIService(type)
  },
}
