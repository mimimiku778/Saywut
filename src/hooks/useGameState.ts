import { useState, useCallback } from 'react'
import { GameState } from '../types'
import { aiService } from '../services/aiService'

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentTopic: aiService.getRandomTopic(),
    userInput: '',
    aiResponse: '',
    isLoading: false,
    isCorrect: null,
    score: 0,
    totalQuestions: 0,
  })

  const submitGuess = useCallback(async () => {
    if (!gameState.userInput.trim()) return

    setGameState((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await aiService.generateResponse(gameState.userInput, gameState.currentTopic)

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
      setGameState((prev) => ({
        ...prev,
        aiResponse: 'エラーが発生しました。もう一度お試しください。',
        isLoading: false,
        isCorrect: false,
      }))
    }
  }, [gameState.userInput, gameState.currentTopic, gameState.score])

  const nextQuestion = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentTopic: aiService.getRandomTopic(),
      userInput: '',
      aiResponse: '',
      isCorrect: null,
    }))
  }, [])

  const resetGame = useCallback(() => {
    setGameState({
      currentTopic: aiService.getRandomTopic(),
      userInput: '',
      aiResponse: '',
      isLoading: false,
      isCorrect: null,
      score: 0,
      totalQuestions: 0,
    })
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
