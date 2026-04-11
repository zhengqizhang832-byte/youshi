export default function GlassJar({ cranes = [] }: { cranes?: any[] }) {
  const isEmpty = cranes.length === 0

  return (
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
              title={crane.crane_text}
            />
          ))}
        </div>
      )}
    </div>
  )
}
