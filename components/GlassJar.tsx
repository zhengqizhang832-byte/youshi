'use client'

import { useState } from 'react'

export default function GlassJar({ cranes = [] }: { cranes?: any[] }) {
  const isEmpty = cranes.length === 0
  const [selectedCrane, setSelectedCrane] = useState<any | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return (
    <>
      <div className="border-2 border-dashed border-gray-300 p-8 min-h-64">
        {isEmpty ? (
          <div className="text-center py-12">
            <p className="text-gray-500">空玻璃罐</p>
            <p className="text-sm text-gray-400 mt-2">待填充内容</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-end">
            {cranes.map((crane) => (
              <div
                key={crane.id}
                className="w-5 h-5 rounded-sm cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: crane.color }}
                onClick={() => setSelectedCrane(crane)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCrane && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedCrane(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-[90%] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-1 rounded-t-lg"
              style={{ backgroundColor: selectedCrane.color }}
            />
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-400">{formatDate(selectedCrane.created_at)}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-2">原话</h3>
                <p className="text-gray-800 leading-relaxed">{selectedCrane.original_text}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-2">鹤语</h3>
                <p className="text-gray-700 leading-relaxed italic">{selectedCrane.crane_text}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedCrane(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
