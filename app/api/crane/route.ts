import { createClient } from '@/lib/Supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.error('=== DEBUG: USER INFO ===')
    console.error('User:', user)
    console.error('User ID:', user?.id)

    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const body = await request.json()

    console.error('=== DEBUG: REQUEST BODY ===')
    console.error('Body:', body)
    console.error('original_text:', body.original_text)
    console.error('crane_language:', body.crane_language)
    console.error('mood_color:', body.mood_color)

    const { original_text, crane_language, mood_color } = body

    if (!original_text || !crane_language || !mood_color) {
      console.error('=== VALIDATION FAILED ===')
      console.error('Missing fields:', { original_text: !!original_text, crane_language: !!crane_language, mood_color: !!mood_color })
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 })
    }

    const insertData = {
      user_id: user.id,
      original_text,
      crane_text: crane_language,
      color: mood_color,
    }

    console.error('=== DEBUG: INSERT DATA ===')
    console.error('Insert data:', insertData)

    const { data, error } = await supabase
      .from('cranes')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('=== SUPABASE INSERT ERROR ===')
      console.error('Code:', error.code)
      console.error('Message:', error.message)
      console.error('Details:', error.details)
      console.error('Hint:', error.hint)
      console.error('Full error:', JSON.stringify(error, null, 2))
      return NextResponse.json({ error: '保存失败', details: error.message }, { status: 500 })
    }

    // 清除主页缓存，确保显示最新数据
    revalidatePath('/home')

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('=== SAVE CRANE CATCH ERROR ===')
    console.error('Message:', error.message)
    console.error('Full error:', JSON.stringify(error, null, 2))
    return NextResponse.json({ error: '保存失败', details: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('cranes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: '获取失败' }, { status: 500 })
    }

    return NextResponse.json({ cranes: data || [] })
  } catch (error: any) {
    console.error('Get cranes error:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}
