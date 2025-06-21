/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Chrome Built-in AI (Prompt API) 型定義
interface LanguageModelCapabilities {
  available: 'readily' | 'after-download' | 'no'
  defaultTemperature?: number
  maxTemperature?: number
  defaultTopK?: number
  maxTopK?: number
}

interface LanguageModelCreateOptions {
  signal?: AbortSignal
  monitor?: (monitor: EventTarget) => void
  initialPrompts?: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  temperature?: number
  topK?: number
}

interface LanguageModelSession {
  prompt(input: string, options?: { signal?: AbortSignal }): Promise<string>
  promptStreaming(input: string): ReadableStream<string>
  destroy(): void
  clone(options?: { signal?: AbortSignal }): Promise<LanguageModelSession>
}

declare global {
  class LanguageModel {
    static create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>
    static availability(
      options?: LanguageModelCreateOptions
    ): Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>
    static params(): Promise<LanguageModelCapabilities | null>
  }

  interface Window {
    ai?: {
      languageModel?: {
        capabilities(): Promise<LanguageModelCapabilities>
        create(options?: any): Promise<any>
      }
    }
  }
}
