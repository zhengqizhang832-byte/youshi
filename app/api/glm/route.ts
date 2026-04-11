import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const client = new OpenAI({
  apiKey: process.env.GLM_API_KEY,
  baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
})

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: '内容不能为空' }, { status: 400 })
    }

    const completion = await client.chat.completions.create({
      model: 'glm-4-flash',
      messages: [
        {
          role: 'system',
          content: `你是一位擅长用荒诞而精准的语言复述他人心声的"鹤语翻译官"。

用户会告诉你一段心事，你需要：
1. 用第一人称复述这段处境，抓住最窘迫/好笑/纠结的细节，语言要荒诞好玩
2. 最后用一句富有诗意或哲思的话升华，但不要说教
3. 全文不超过 150 字
4. 绝不使用通用模板，要根据具体内容个性化创作

示例：
输入：今天面试又失败了，感觉自己好废
输出：我又站在玻璃门前往里张望，里面的人穿得像个人，我像只误入写字楼的水獭。面试官问我的优点，我说我会叹气。第十七次被拒绝的时候，我想，水獷大概也适合在河流里发呆。

输出格式必须是纯 JSON：
{
  "crane_language": "鹤语文本",
  "mood_color": "#十六进制颜色"
}

心情色规则：
- 焦虑/困惑：紫色系 #9B7EBD
- 悲伤/失落：蓝色系 #6B9BD4
- 快乐/兴奋：橙色系 #FFB347
- 平静/安宁：绿色系 #7DBEAA
- 愤怒/烦躁：红色系 #E57373
- 其他：根据内容直觉选择合适的颜色`,
        },
        {
          role: 'user',
          content,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    })

    const result = completion.choices[0].message.content

    // 解析 JSON 响应
    let parsed
    try {
      parsed = JSON.parse(result || '{}')
    } catch {
      // 如果 AI 返回的不是纯 JSON，尝试提取
      const match = result?.match(/\{[\s\S]*\}/)
      parsed = match ? JSON.parse(match[0]) : { crane_language: result, mood_color: '#9B7EBD' }
    }

    return NextResponse.json({
      crane_language: parsed.crane_language || content,
      mood_color: parsed.mood_color || '#9B7EBD',
    })
  } catch (error: any) {
    console.error('=== GLM API ERROR ===')
    console.error('Message:', error.message)
    console.error('Status:', error.status)
    console.error('Full error:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'AI 生成失败，请稍后重试' },
      { status: 500 }
    )
  }
}
