import { useState, useCallback, useEffect } from 'react'
import { GameState } from '../types/gameTypes'
import { aiService } from '../services/aiService'
import { getTopicByIndex, type DifficultyLevel } from '../data/topics'

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentTopic: '',
    userInput: '',
    aiResponse: '',
    isLoading: false,
    isCorrect: null,
    score: 0,
    totalQuestions: 0,
    difficulty: 'normal',
  })
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)

  // ゲームの初期化
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const initialTopic = getTopicByIndex(gameState.difficulty, 0)
        setGameState((prev) => ({ ...prev, currentTopic: initialTopic }))
        setCurrentTopicIndex(0)
      } catch (error) {
        console.error('ゲームの初期化に失敗しました:', error)
        setGameState((prev) => ({
          ...prev,
          currentTopic: '猫', // フォールバック
          aiResponse: 'ゲームの初期化に失敗しました。基本機能のみ利用できます。',
        }))
        setCurrentTopicIndex(0)
      }
    }

    initializeGame()
  }, [])

  const submitGuess = useCallback(async () => {
    if (!gameState.userInput.trim()) return

    setGameState((prev) => ({ ...prev, isLoading: true }))

    try {
      // 第1段階: ユーザー入力値の検証
      const validationResponse = await aiService.validateUserInput(
        gameState.userInput,
        gameState.currentTopic,
        gameState.difficulty
      )

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
        validationReason =
          validationText.replace(/^NG[：:]?\s*/, '') || '入力内容がルールに適合していません。'
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
      const response = await aiService.generateResponse(gameState.userInput, gameState.currentTopic, gameState.difficulty)
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
      const nextIndex = currentTopicIndex + 1
      const newTopic = getTopicByIndex(gameState.difficulty, nextIndex)
      setGameState((prev) => ({
        ...prev,
        currentTopic: newTopic,
        userInput: '',
        aiResponse: '',
        isCorrect: null,
      }))
      setCurrentTopicIndex(nextIndex)
    } catch (error) {
      console.error('次の問題の生成に失敗しました:', error)
    }
  }, [gameState.difficulty, currentTopicIndex])

  const resetGame = useCallback(async () => {
    try {
      const newTopic = getTopicByIndex(gameState.difficulty, 0)
      setGameState({
        currentTopic: newTopic,
        userInput: '',
        aiResponse: '',
        isLoading: false,
        isCorrect: null,
        score: 0,
        totalQuestions: 0,
        difficulty: gameState.difficulty,
      })
      setCurrentTopicIndex(0)
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
        difficulty: gameState.difficulty,
      })
      setCurrentTopicIndex(0)
    }
  }, [gameState.difficulty])

  const updateUserInput = useCallback((input: string) => {
    setGameState((prev) => ({ ...prev, userInput: input }))
  }, [])

  const changeDifficulty = useCallback(async (newDifficulty: DifficultyLevel) => {
    try {
      const newTopic = getTopicByIndex(newDifficulty, 0)
      setGameState((prev) => ({
        ...prev,
        difficulty: newDifficulty,
        currentTopic: newTopic,
        userInput: '',
        aiResponse: '',
        isCorrect: null,
      }))
      setCurrentTopicIndex(0)
    } catch (error) {
      console.error('難易度変更に失敗しました:', error)
    }
  }, [])

  return {
    gameState,
    submitGuess,
    nextQuestion,
    resetGame,
    updateUserInput,
    changeDifficulty,
  }
}
