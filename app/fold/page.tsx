'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FoldAnimation from '@/components/FoldAnimation'

type CraneData = {
  original_text: string
  crane_language: string
  mood_color: string
}

export default function FoldPage() {
  const [content, setContent] = useState('')
  const [isFolding, setIsFolding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [craneData, setCraneData] = useState<CraneData | null>(null)

  const handleFold = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      // 1. 调用 GLM API 生成鹤语和心情色
      const glmRes = await fetch('/api/glm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!glmRes.ok) {
        throw new Error('AI 生成失败')
      }

      const { crane_language, mood_color } = await glmRes.json()

      // 2. 保存到 Supabase
      const craneRes = await fetch('/api/crane', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_text: content,
          crane_language,
          mood_color,
        }),
      })

      if (!craneRes.ok) {
        throw new Error('保存失败')
      }

      // 3. 开始动画
      setCraneData({ original_text: content, crane_language, mood_color })
      setIsFolding(true)
    } catch (error: any) {
      console.error('Error:', error)
      alert(error.message || '处理失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFolding && craneData) {
    return <FoldAnimation moodColor={craneData.mood_color} />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-64 h-64 bg-white border-2 border-gray-300 p-4 mb-8">
        <textarea
          placeholder="写下你的想法..."
          className="w-full h-full resize-none outline-none text-gray-700"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button
        onClick={handleFold}
        disabled={isLoading || !content.trim()}
        className="px-6 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '生成中...' : '折叠'}
      </button>
    </div>
  )
}
