import { useState, useCallback, useEffect } from 'react'
import { GameState } from '../types'
import { AIServiceManager, aiService } from '../services/aiService'
import { getRandomTopic } from '../data'

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
        await AIServiceManager.initialize()
        const initialTopic = getRandomTopic()
        setGameState((prev) => ({ ...prev, currentTopic: initialTopic }))
      } catch (error) {
        console.error('AIサービスの初期化に失敗しました:', error)
        setGameState((prev) => ({
          ...prev,
          currentTopic: '猫', // フォールバック
          aiResponse: 'AIサービスの初期化に失敗しました。基本機能のみ利用できます。',
        }))
      }
    }

    initializeGame()
  }, [])

  const submitGuess = useCallback(async () => {
    if (!gameState.userInput.trim()) return

    setGameState((prev) => ({ ...prev, isLoading: true }))

    try {
      // 第1段階: ユーザー入力値の検証
      const validationResponse = await aiService.validateUserInput(gameState.userInput, gameState.currentTopic)
      
      // 検証エラーの場合
      if (validationResponse.response.includes('エラー')) {
        setGameState((prev) => ({
          ...prev,
          aiResponse: validationResponse.response,
          isLoading: false,
          isCorrect: false,
          totalQuestions: prev.totalQuestions + 1,
        }))
        return
      }

      // 検証結果をパース
      const validationText = validationResponse.response.trim()
      let isInputValid = false
      let validationReason = ''
      console.log('検証結果:', validationText)

      if (validationText.includes('OK')) {
        isInputValid = true
      } else if (validationText.includes('NG')) {
        isInputValid = false
        validationReason = validationText.replace(/^NG[：:]?\s*/, '') || '入力内容がルールに適合していません。'
      } else {
        // 判定が不明な場合はNGとして扱う
        isInputValid = false
        validationReason = '入力内容の判定ができませんでした。'
      }

      // 入力値検証で不合格の場合
      if (!isInputValid) {
        setGameState((prev) => ({
          ...prev,
          aiResponse: `ルール違反: ${validationReason}`,
          isLoading: false,
          isCorrect: false,
          totalQuestions: prev.totalQuestions + 1,
        }))
        return
      }

      // 第2段階: AIによる推理
      const response = await aiService.generateResponse(gameState.userInput, gameState.currentTopic)
      console.log('AI応答:', response.response)

      // AIのレスポンスに正解の単語が含まれているかで判定
      const isCorrect = response.response.includes(gameState.currentTopic)
      const newScore = isCorrect ? gameState.score + 1 : gameState.score

      setGameState((prev) => ({
        ...prev,
        aiResponse: response.response,
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
      const newTopic = getRandomTopic()
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
      const newTopic = getRandomTopic()
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
