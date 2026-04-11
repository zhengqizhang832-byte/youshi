import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl mb-8">有时</h1>
      <Link href="/login" className="px-4 py-2 border rounded">
        去登录
      </Link>
    </div>
  )
}
