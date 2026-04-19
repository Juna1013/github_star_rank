import { serve } from '@hono/node-server'
import app from './src/app'

// .env.local を読み込む
import { readFileSync } from 'fs'
try {
  const env = readFileSync('.env.local', 'utf-8')
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && !key.startsWith('#') && rest.length > 0) {
      process.env[key.trim()] = rest.join('=').trim()
    }
  }
} catch {
  // .env.local がなければ無視
}

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`開発サーバー起動: http://localhost:${info.port}`)
})
