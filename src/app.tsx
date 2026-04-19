import { Hono } from 'hono'
import { Home } from './pages/Home'
import { UserPage, ErrorPage } from './pages/UserPage'
import { getUser, getAllRepos, calcTotalStars, isError } from './lib/github'
import { getRank, getNextRank } from './lib/rank'

const app = new Hono()

app.get('/', (c) => c.html(<Home />))

// 検索フォームから /user?username=xxx でリダイレクト
app.get('/user', (c) => {
  const username = c.req.query('username')?.trim()
  if (!username) return c.redirect('/')
  return c.redirect(`/${encodeURIComponent(username)}`)
})

app.get('/:username', async (c) => {
  const username = c.req.param('username')

  const [userResult, reposResult] = await Promise.all([
    getUser(username),
    getAllRepos(username),
  ])

  if (isError(userResult)) {
    const message =
      userResult.type === 'not_found'
        ? `ユーザー "${username}" が見つかりません`
        : userResult.type === 'rate_limit'
          ? 'GitHub API のレート制限に達しました。しばらくしてから再試行してください'
          : `エラーが発生しました: ${userResult.message}`
    return c.html(<ErrorPage message={message} />, userResult.type === 'not_found' ? 404 : 500)
  }

  const repos = isError(reposResult) ? [] : reposResult
  const totalStars = calcTotalStars(repos)
  const rank = getRank(totalStars)
  const nextRank = getNextRank(totalStars)

  return c.html(
    <UserPage
      user={userResult}
      repos={repos}
      totalStars={totalStars}
      rank={rank}
      nextRank={nextRank}
    />
  )
})

export default app
