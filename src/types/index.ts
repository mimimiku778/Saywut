export interface GameState {
  currentTopic: string
  userInput: string
  aiResponse: string
  isLoading: boolean
  isCorrect: boolean | null
  score: number
  totalQuestions: number
}

export interface QuizTopic {
  word: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface AIResponse {
  guess: string
  reasoning: string
  confidence: number
}
