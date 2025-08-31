import { createClient } from '@supabase/supabase-js'

function createPrivateClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing env vars SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// 延迟初始化
let privateClient = null

export default {
  get client() {
    if (!privateClient) {
      privateClient = createPrivateClient()
    }
    return privateClient
  },
  
  // 代理所有 Supabase 客户端方法
  from(...args) {
    return this.client.from(...args)
  },
  
  storage: {
    get from() {
      return privateClient?.storage?.from || createPrivateClient().storage.from
    }
  }
}
