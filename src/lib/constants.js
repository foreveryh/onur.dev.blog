import {
  ArmchairIcon,
  BookmarkIcon,
  GithubIcon,
  LinkedinIcon,
  NavigationIcon,
  PencilLineIcon,
  SparklesIcon,
  Wand2Icon
} from 'lucide-react'

export const PROFILES = {
  twitter: {
    title: 'X (Twitter)',
    username: '熊布朗', // 请替换为您的 Twitter 用户名
    url: 'https://x.com/Stephen4171127', // 请替换为您的 Twitter 个人资料 URL
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#000000"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    )
  },
  github: {
    title: 'GitHub',
    url: 'https://github.com/foreveryh',
    icon: <GithubIcon size={16} />
  },
  linkedin: {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/peng-g', // 请替换为您的 LinkedIn 个人资料 URL
    icon: <LinkedinIcon size={16} />
  }
  /* medium: {
    title: 'Medium',
    url: 'https://suyalcinkaya.medium.com'
  }, */
  /* instagram: {
    title: 'Instagram',
    url: 'https://www.instagram.com/jgrmn',
    icon: <InstagramIcon size={16} />
  }, */
  /* soundcloud: {
    title: 'Soundcloud',
    url: 'https://soundcloud.com/jagerman'
  }, */
  /* youtube: {
    title: 'YouTube',
    url: 'https://www.youtube.com/c/jagermanmusic',
    icon: <YoutubeIcon size={16} />
  }, */
  /* bluesky: {
    title: 'Bluesky',
    url: 'https://staging.bsky.app/profile/onur.dev'
  }, */
  /* readcv: {
    title: 'Read.cv',
    url: 'https://read.cv/onur'
  }, */
  /* pinterest: {
    title: 'Pinterest',
    url: 'https://nl.pinterest.com/onurschu'
  } */
}

export const TWEETS_COLLECTION_ID = 15896982

export const COLLECTION_IDS = [
  55349123,
  55351618,
  55351620,
  55858229,
  55858636,
  55858640,
]

export const LINKS = [
  {
    href: '/',
    label: 'Home',
    icon: <SparklesIcon size={16} />
  },
  {
    href: '/writing',
    label: 'Writing',
    icon: <PencilLineIcon size={16} />
  },
  {
    href: '/journey',
    label: 'Journey',
    icon: <NavigationIcon size={16} />
  },
  {
    href: '/stack',
    label: 'Stack',
    icon: <Wand2Icon size={16} />
  },
  {
    href: '/workspace',
    label: 'Workspace',
    icon: <ArmchairIcon size={16} />
  },
  {
    href: '/bookmarks',
    label: 'Bookmarks',
    icon: <BookmarkIcon size={16} />
  }
]

// 个人空间数据结构
export const PERSONAL_SPACE_SECTIONS = {
  books: {
    title: '📚 阅读清单',
    description: '我读过的好书推荐',
    items: [
      {
        title: '《思考，快与慢》',
        author: '丹尼尔·卡尼曼',
        year: '2023',
        rating: '⭐⭐⭐⭐⭐',
        notes: '关于认知偏见和决策心理学的经典之作'
      },
      {
        title: '《原则》',
        author: '瑞·达利欧',
        year: '2023',
        rating: '⭐⭐⭐⭐⭐',
        notes: '系统性思维和原则导向的人生哲学'
      },
      {
        title: '《人工智能时代》',
        author: '亨利·基辛格',
        year: '2023',
        rating: '⭐⭐⭐⭐',
        notes: 'AI对人类社会影响的深度思考'
      },
      {
        title: '《零到一》',
        author: '彼得·蒂尔',
        year: '2022',
        rating: '⭐⭐⭐⭐⭐',
        notes: '创新和垄断思维的商业洞察'
      }
    ]
  },
  movies: {
    title: '🎬 电影清单',
    description: '值得推荐的电影作品',
    items: [
      {
        title: '《奥本海默》',
        director: '克里斯托弗·诺兰',
        year: '2023',
        rating: '⭐⭐⭐⭐⭐',
        notes: '科学、道德与历史的深度交织'
      },
      {
        title: '《瞬息全宇宙》',
        director: '关家永',
        year: '2022',
        rating: '⭐⭐⭐⭐⭐',
        notes: '创意无限的多元宇宙奇幻之旅'
      },
      {
        title: '《沙丘》',
        director: '丹尼斯·维伦纽瓦',
        year: '2021',
        rating: '⭐⭐⭐⭐',
        notes: '视觉震撼的科幻史诗巨作'
      },
      {
        title: '《银翼杀手2049》',
        director: '丹尼斯·维伦纽瓦',
        year: '2017',
        rating: '⭐⭐⭐⭐⭐',
        notes: '关于人性和AI的哲学思辨'
      }
    ]
  },
  travels: {
    title: '✈️ 旅行足迹',
    description: '我去过的有趣地方',
    items: [
      {
        title: '巴黎',
        country: '法国',
        year: '2024',
        rating: '⭐⭐⭐⭐⭐',
        notes: '艺术与浪漫的完美结合，现在的居住地'
      },
      {
        title: '首尔',
        country: '韩国',
        year: '2020-2023',
        rating: '⭐⭐⭐⭐⭐',
        notes: '科技与传统文化的和谐共存'
      },
      {
        title: '东京',
        country: '日本',
        year: '2023',
        rating: '⭐⭐⭐⭐⭐',
        notes: '细节完美主义和创新精神的体现'
      },
      {
        title: '新加坡',
        country: '新加坡',
        year: '2022',
        rating: '⭐⭐⭐⭐',
        notes: '多元文化融合的现代都市'
      },
      {
        title: '上海',
        country: '中国',
        year: '2022',
        rating: '⭐⭐⭐⭐⭐',
        notes: '东西方文化交汇的国际大都市'
      }
    ]
  },
  tools: {
    title: '🛠️ 工具箱',
    description: '我常用的效率工具',
    items: [
      {
        title: 'Cursor',
        category: 'AI编程',
        year: '2024',
        rating: '⭐⭐⭐⭐⭐',
        notes: 'AI驱动的代码编辑器，编程效率神器'
      },
      {
        title: 'Claude',
        category: 'AI助手',
        year: '2024',
        rating: '⭐⭐⭐⭐⭐',
        notes: '最好的AI对话助手，思维清晰'
      },
      {
        title: 'Notion',
        category: '知识管理',
        year: '2023',
        rating: '⭐⭐⭐⭐',
        notes: '全能的笔记和项目管理工具'
      },
      {
        title: 'Figma',
        category: '设计工具',
        year: '2023',
        rating: '⭐⭐⭐⭐⭐',
        notes: '协作设计的标准工具'
      }
    ]
  }
}

export const SCROLL_AREA_ID = 'scroll-area'
export const MOBILE_SCROLL_THRESHOLD = 20
export const SUPABASE_TABLE_NAME = 'pages'

export const SUBMIT_BOOKMARK_FORM_TITLE = 'Submit a bookmark'
export const SUBMIT_BOOKMARK_FORM_DESCRIPTION =
  "Send me a website you like and if I like it too, you'll see it in the bookmarks list. With respect, please do not submit more than 5 websites a day."

export const CONTENT_TYPES = {
  PAGE: 'page',
  POST: 'post',
  LOGBOOK: 'logbook'
}
