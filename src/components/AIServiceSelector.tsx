import React, { useState, useEffect } from 'react'
import { AIServiceType } from '../services/types'
import { AIServiceManager } from '../services/aiService'

interface AIServiceSelectorProps {
  onServiceChange?: (serviceType: AIServiceType) => void
  className?: string
}

export const AIServiceSelector: React.FC<AIServiceSelectorProps> = ({
  onServiceChange,
  className = '',
}) => {
  const [availableServices, setAvailableServices] = useState<
    { type: AIServiceType; name: string }[]
  >([])
  const [currentService, setCurrentService] = useState<AIServiceType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)

  useEffect(() => {
    loadAvailableServices()
  }, [])

  const loadAvailableServices = async () => {
    try {
      setIsLoading(true)
      const services = await AIServiceManager.getAvailableServices()
      setAvailableServices(services)
      setCurrentService(AIServiceManager.getCurrentServiceType())
    } catch (error) {
      console.error('利用可能なサービスの取得に失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleServiceSwitch = async (serviceType: AIServiceType) => {
    try {
      await AIServiceManager.switchToService(serviceType)
      setCurrentService(serviceType)
      onServiceChange?.(serviceType)
    } catch (error) {
      console.error('サービスの切り替えに失敗:', error)
      // OpenAI APIキーが必要な場合
      if (serviceType === 'openai') {
        setShowApiKeyInput(true)
      }
    }
  }

  const handleApiKeySubmit = async () => {
    if (apiKey.trim()) {
      AIServiceManager.setOpenAIApiKey(apiKey.trim())
      setShowApiKeyInput(false)
      setApiKey('')
      // サービスリストを再読み込み
      await loadAvailableServices()
      // OpenAIに切り替えを試行
      try {
        await handleServiceSwitch('openai')
      } catch (error) {
        console.error('OpenAI APIキー設定後のサービス切り替えに失敗:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="text-sm text-gray-600">AIサービスを確認中...</span>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">AIサービス:</label>
        <div className="flex space-x-2">
          {availableServices.map(({ type }) => (
            <button
              key={type}
              onClick={() => handleServiceSwitch(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                currentService === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type === 'chrome-ai' ? 'Gemini Nano' : 'OpenAI GPT-4'}
            </button>
          ))}
        </div>
      </div>

      {availableServices.length === 0 && (
        <div className="text-sm text-red-600">
          利用可能なAIサービスがありません。
          <button
            onClick={() => setShowApiKeyInput(true)}
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            OpenAI APIキーを設定
          </button>
        </div>
      )}

      {showApiKeyInput && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h4 className="text-sm font-medium text-gray-700">OpenAI APIキーを設定</h4>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleApiKeySubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              設定
            </button>
            <button
              onClick={() => {
                setShowApiKeyInput(false)
                setApiKey('')
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {currentService && (
        <div className="text-xs text-gray-500">
          現在使用中: {availableServices.find((s) => s.type === currentService)?.name}
        </div>
      )}
    </div>
  )
}
