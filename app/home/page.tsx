import { createClient } from '@/lib/Supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GlassJar from '@/components/GlassJar'

async function getUserCranes(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cranes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) return []
  return data || []
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const cranes = await getUserCranes(user.id)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl">有时</h1>
          <form action="/auth/logout" method="post">
            <button type="submit" className="px-3 py-1 border rounded text-sm">
              退出登录
            </button>
          </form>
        </div>

        <GlassJar cranes={cranes} />

        <div className="text-center mt-8">
          <Link href="/fold" className="px-6 py-2 border rounded">
            折一只千纸鹤
          </Link>
        </div>
      </div>
    </div>
  )
}
