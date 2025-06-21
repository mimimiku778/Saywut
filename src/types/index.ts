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
  response: string
}

// Chrome Built-in AI API の型定義（2025年版）
declare global {
  interface Window {
    ai?: {
      languageModel?: {
        capabilities(): Promise<{
          available: 'readily' | 'after-download' | 'no'
        }>
        create(options?: {
          systemPrompt?: string
          temperature?: number
          topK?: number
        }): Promise<AILanguageModel>
      }
    }
  }
}

interface AILanguageModel {
  prompt(input: string): Promise<string>
  promptStreaming?(input: string): AsyncIterable<string>
  destroy(): void
}
