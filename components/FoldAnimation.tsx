'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type FoldAnimationProps = {
  moodColor: string
}

export default function FoldAnimation({ moodColor }: FoldAnimationProps) {
  const [phase, setPhase] = useState<'folding' | 'crane'>('folding')
  const router = useRouter()

  useEffect(() => {
    const foldingTimer = setTimeout(() => {
      setPhase('crane')
    }, 1500)

    const redirectTimer = setTimeout(() => {
      router.push('/home')
    }, 2500)

    return () => {
      clearTimeout(foldingTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {phase === 'folding' && (
        <div className="w-64 h-64 bg-white border-2 border-gray-300 animate-fold" />
      )}

      {phase === 'crane' && (
        <div
          className="w-16 h-16 animate-crane-appear"
          style={{ backgroundColor: moodColor }}
        />
      )}
    </div>
  )
}
