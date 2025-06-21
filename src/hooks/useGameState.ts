import { useState, useCallback, useEffect } from 'react'
import { GameState } from '../types'
import { getAIService } from '../services/aiService'

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentTopic: '',
    userInput: '',
    aiResponse: '',
    isLoading: false,
    isCorrect: null,
    score: 0,
    totalQuestions: 0,
  })

  // AIサービスの初期化
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const service = await getAIService()
        const initialTopic = service.getRandomTopic()
        setGameState(prev => ({ ...prev, currentTopic: initialTopic }))
      } catch (error) {
        console.error('AIサービスの初期化に失敗しました:', error)
        setGameState(prev => ({ 
          ...prev, 
          currentTopic: '猫', // フォールバック
          aiResponse: 'AIサービスの初期化に失敗しました。基本機能のみ利用できます。'
        }))
      }
    }
    
    initializeGame()
  }, [])

  const submitGuess = useCallback(async () => {
    if (!gameState.userInput.trim()) return

    setGameState((prev) => ({ ...prev, isLoading: true }))

    try {
      const service = await getAIService()
      const response = await service.generateResponse(gameState.userInput, gameState.currentTopic)

      const isCorrect = response.guess === gameState.currentTopic
      const newScore = isCorrect ? gameState.score + 1 : gameState.score

      setGameState((prev) => ({
        ...prev,
        aiResponse: `AIの推測: "${response.guess}"\n理由: ${response.reasoning}\n確信度: ${Math.round(response.confidence * 100)}%`,
        isLoading: false,
        isCorrect,
        score: newScore,
        totalQuestions: prev.totalQuestions + 1,
      }))
    } catch (error) {
      console.error('AI応答エラー:', error)
      setGameState((prev) => ({
        ...prev,
        aiResponse: 'エラーが発生しました。もう一度お試しください。',
        isLoading: false,
        isCorrect: false,
      }))
    }
  }, [gameState.userInput, gameState.currentTopic, gameState.score])

  const nextQuestion = useCallback(async () => {
    try {
      const service = await getAIService()
      const newTopic = service.getRandomTopic()
      setGameState((prev) => ({
        ...prev,
        currentTopic: newTopic,
        userInput: '',
        aiResponse: '',
        isCorrect: null,
      }))
    } catch (error) {
      console.error('次の問題の生成に失敗しました:', error)
    }
  }, [])

  const resetGame = useCallback(async () => {
    try {
      const service = await getAIService()
      const newTopic = service.getRandomTopic()
      setGameState({
        currentTopic: newTopic,
        userInput: '',
        aiResponse: '',
        isLoading: false,
        isCorrect: null,
        score: 0,
        totalQuestions: 0,
      })
    } catch (error) {
      console.error('ゲームのリセットに失敗しました:', error)
      setGameState({
        currentTopic: '猫', // フォールバック
        userInput: '',
        aiResponse: 'ゲームのリセットに失敗しました。',
        isLoading: false,
        isCorrect: null,
        score: 0,
        totalQuestions: 0,
      })
    }
  }, [])

  const updateUserInput = useCallback((input: string) => {
    setGameState((prev) => ({ ...prev, userInput: input }))
  }, [])

  return {
    gameState,
    submitGuess,
    nextQuestion,
    resetGame,
    updateUserInput,
  }
}
