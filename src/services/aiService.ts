import { AIResponse } from '../types'

// モックAIサービス - 実際のLLMの代わりにパターンマッチングを使用
export class MockAIService {
  private topics = [
    {
      word: '桜',
      keywords: ['春', 'ピンク', '花', '日本', '咲く', '美しい', '木', '葉', '散る', '満開'],
    },
    {
      word: 'ラーメン',
      keywords: [
        '麺',
        'スープ',
        '温かい',
        '食べ物',
        '箸',
        '中華',
        'チャーシュー',
        '味噌',
        '醤油',
        '豚骨',
      ],
    },
    {
      word: '富士山',
      keywords: ['山', '高い', '日本', '雪', '美しい', '静岡', '山梨', '登山', '3776', '世界遺産'],
    },
    {
      word: '電車',
      keywords: [
        '乗り物',
        '線路',
        '駅',
        '運転手',
        '切符',
        '通勤',
        '交通',
        'レール',
        'ホーム',
        '車両',
      ],
    },
    {
      word: '猫',
      keywords: ['動物', '毛', 'にゃー', 'ペット', '可愛い', '爪', 'ひげ', '尻尾', '肉球', '鳴く'],
    },
    {
      word: 'スマートフォン',
      keywords: [
        '電話',
        '画面',
        'アプリ',
        '携帯',
        'タッチ',
        'インターネット',
        'カメラ',
        'バッテリー',
        'iOS',
        'Android',
      ],
    },
    {
      word: '寿司',
      keywords: ['魚', '米', '生', '日本料理', 'わさび', '醤油', '握り', 'ネタ', 'シャリ', '回転'],
    },
    {
      word: '本',
      keywords: ['読む', 'ページ', '文字', '知識', '図書館', '作家', '物語', '紙', '活字', '小説'],
    },
    {
      word: 'コーヒー',
      keywords: [
        '飲み物',
        '黒い',
        '苦い',
        'カフェイン',
        '豆',
        '朝',
        '目覚め',
        'カップ',
        'エスプレッソ',
        'ラテ',
      ],
    },
    {
      word: '雨',
      keywords: ['水', '空', '雲', '濡れる', '傘', '梅雨', '天気', '音', 'しずく', '降る'],
    },
    {
      word: 'ピアノ',
      keywords: [
        '楽器',
        '鍵盤',
        '音楽',
        '白',
        '黒',
        '弾く',
        'クラシック',
        '指',
        '練習',
        'メロディー',
      ],
    },
    {
      word: '海',
      keywords: ['水', '塩', '青い', '波', '魚', '泳ぐ', '砂浜', '深い', '広い', '潮'],
    },
  ]

  async generateResponse(userInput: string, correctAnswer: string): Promise<AIResponse> {
    // 実際のAPIコールをシミュレート
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const input = userInput.toLowerCase()

    // 正解の単語を直接含んでいる場合は失格
    if (input.includes(correctAnswer.toLowerCase())) {
      return {
        guess: correctAnswer,
        reasoning: `入力に「${correctAnswer}」という言葉が含まれているため、ルール違反です。`,
        confidence: 1.0,
      }
    }

    // 対応するトピックを検索
    const topic = this.topics.find((t) => t.word === correctAnswer)

    if (topic) {
      const matchedKeywords = topic.keywords.filter((keyword) =>
        input.includes(keyword.toLowerCase())
      )

      // 強いマッチ（複数キーワード + 高い確率）
      if (matchedKeywords.length >= 3) {
        return {
          guess: correctAnswer,
          reasoning: `「${matchedKeywords.slice(0, 3).join('」「')}」などの複数のキーワードから明確に推測できました。`,
          confidence: Math.min(0.95, 0.7 + matchedKeywords.length * 0.1),
        }
      }
      // 中程度のマッチ（2つのキーワード）
      else if (matchedKeywords.length === 2) {
        return {
          guess: correctAnswer,
          reasoning: `「${matchedKeywords.join('」「')}」という重要なヒントから推測しました。`,
          confidence: 0.7 + Math.random() * 0.2,
        }
      }
      // 弱いマッチ（1つのキーワード）
      else if (matchedKeywords.length === 1) {
        // 70%の確率で正解
        if (Math.random() > 0.3) {
          return {
            guess: correctAnswer,
            reasoning: `「${matchedKeywords[0]}」というヒントから推測しましたが、やや不確実です。`,
            confidence: 0.4 + Math.random() * 0.3,
          }
        }
      }

      // 部分的な文字列マッチもチェック
      const partialMatches = topic.keywords.filter(
        (keyword) =>
          keyword
            .toLowerCase()
            .split('')
            .some((char) => input.includes(char)) ||
          input.split('').some((char) => keyword.toLowerCase().includes(char))
      )

      if (partialMatches.length >= 3 && Math.random() > 0.6) {
        return {
          guess: correctAnswer,
          reasoning: `説明の内容から推測しました。関連性のあるヒントが含まれていたようです。`,
          confidence: 0.3 + Math.random() * 0.3,
        }
      }
    }

    // ランダムな不正解を生成
    const randomTopics = this.topics.filter((t) => t.word !== correctAnswer)
    const randomGuess = randomTopics[Math.floor(Math.random() * randomTopics.length)]

    const uncertainReasons = [
      'ヒントから推測しましたが、確信が持てません。',
      '説明から連想しましたが、別の可能性もありそうです。',
      'いくつかの要素から推測しましたが、曖昧な部分があります。',
      '与えられた情報では判断が難しく、推測に頼っています。',
      '関連しそうなキーワードから推測しましたが、自信がありません。',
    ]

    return {
      guess: randomGuess.word,
      reasoning: uncertainReasons[Math.floor(Math.random() * uncertainReasons.length)],
      confidence: 0.2 + Math.random() * 0.4,
    }
  }

  getRandomTopic(): string {
    return this.topics[Math.floor(Math.random() * this.topics.length)].word
  }
}

export const aiService = new MockAIService()
