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

// 現在選択されているサービスタイプ
let selectedServiceType: AIServiceType = 'openai'

/**
 * サービスタイプを設定する
 */
export function setServiceType(type: AIServiceType): void {
  selectedServiceType = type
}

/**
 * 選択されたサービスを作成する
 */
export async function createSelectedService(): Promise<IAIService> {
  const service = createAIService(selectedServiceType)
  if (!(await service.isAvailable())) {
    throw new Error(`${service.getServiceName()}が利用できません`)
  }
  return service
}

/**
 * 利用可能なサービスのリストを取得する
 */
export async function getAvailableServices(): Promise<{ type: AIServiceType; name: string }[]> {
  const available: { type: AIServiceType; name: string }[] = []
  const serviceTypes: AIServiceType[] = ['openai', 'chrome-ai']

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
    const service = await createSelectedService()
    return service.generateResponse(userInput, correctAnswer)
  },

  async validateUserInput(userInput: string, correctAnswer: string): Promise<AIResponse> {
    const service = await createSelectedService()
    return service.validateUserInput(userInput, correctAnswer)
  },

  setServiceType(type: AIServiceType): void {
    setServiceType(type)
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
