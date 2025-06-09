import { NextResponse } from 'next/server'

// 生成智能标题
function generateTitle(content) {
  // 去除 markdown 格式和多余空白
  const cleanContent = content
    .replace(/[#*`[\]()]/g, '') // 移除 markdown 符号
    .replace(/\s+/g, ' ') // 多个空白字符替换为单个空格
    .trim()

  // 如果内容长度小于50字符，使用完整内容作为标题
  if (cleanContent.length <= 50) {
    return cleanContent
  }

  // 否则截取前50字符并添加省略号
  // 尝试在词边界处截断，避免截断单词
  let title = cleanContent.substring(0, 50)
  const lastSpaceIndex = title.lastIndexOf(' ')
  const lastPuncIndex = Math.max(
    title.lastIndexOf('。'),
    title.lastIndexOf('！'),
    title.lastIndexOf('？'),
    title.lastIndexOf('，')
  )

  // 如果在前40字符内找到了合适的断点，使用它
  if (lastPuncIndex > 30) {
    title = cleanContent.substring(0, lastPuncIndex + 1)
  } else if (lastSpaceIndex > 30) {
    title = cleanContent.substring(0, lastSpaceIndex)
  }

  return title + '...'
}

export async function POST(request) {
  try {
    const { body, labels = ['Public'] } = await request.json()

    // 添加特殊标签标识这是从博客发送的
    const blogLabels = [...labels, 'blog-post']

    if (!body) {
      return new NextResponse('内容不能为空', { status: 400 })
    }

    // 检查是否包含验证码
    const secretCode = process.env.MUSING_CODE
    if (!secretCode) {
      return new NextResponse('服务器配置错误', { status: 500 })
    }

    if (!body.includes(secretCode)) {
      return new NextResponse('验证码错误', { status: 401 })
    }

    // 移除验证码
    const cleanBody = body.replace(secretCode, '').trim()

    // 生成智能标题
    const title = generateTitle(cleanBody)

    // 调用 GitHub API 创建 Issue
    const githubToken = process.env.GITHUB_PAT
    if (!githubToken) {
      return new NextResponse('GitHub token 未配置', { status: 500 })
    }

    // 从环境变量获取仓库信息，如果没有则使用默认值
    const githubRepo = process.env.GITHUB_REPO || 'foreveryh/git-thoughts'
    const githubApiUrl = `https://api.github.com/repos/${githubRepo}/issues`

    const response = await fetch(githubApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        body: cleanBody,
        labels: blogLabels
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('GitHub API error:', error)
      return new NextResponse(`GitHub API 错误: ${response.status}`, { status: 500 })
    }

    const issue = await response.json()

    return NextResponse.json({
      success: true,
      issue: {
        id: issue.id,
        number: issue.number,
        url: issue.html_url,
        title: title
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return new NextResponse('服务器内部错误', { status: 500 })
  }
}
