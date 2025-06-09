import {
  ArmchairIcon,
  BookmarkIcon,
  GithubIcon,
  ImageIcon,
  LinkedinIcon,
  MessageCircleIcon,
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

export const TWEETS_COLLECTION_ID = 56292239

export const COLLECTION_IDS = [55349123, TWEETS_COLLECTION_ID, 55351618, 55351620, 55858229, 55858636, 55858640, 56212510]

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
    href: '/visual',
    label: 'Visual',
    icon: <ImageIcon size={16} />
  },
  {
    href: '/bookmarks',
    label: 'Bookmarks',
    icon: <BookmarkIcon size={16} />
  },
  {
    href: '/musings',
    label: 'Musings',
    icon: <MessageCircleIcon size={16} />
  }
]

// 个人空间数据结构
export const PERSONAL_SPACE_SECTIONS = {}

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
