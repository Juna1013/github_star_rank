import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import type { GitHubUser, GitHubRepo } from '../lib/github'
import type { Rank } from '../lib/rank'
import { calcProgress, RANKS } from '../lib/rank'
import { renderStarChart } from '../components/StarChart'

type Props = {
  user: GitHubUser
  repos: GitHubRepo[]
  totalStars: number
  rank: Rank
  nextRank: Rank | null
}

// AtCoderのユーザーカラーCSSクラスに対応
const RANK_CLASS: Record<string, string> = {
  '灰': 'user-grey',
  '茶': 'user-brown',
  '緑': 'user-green',
  '水': 'user-cyan',
  '青': 'user-blue',
  '黄': 'user-yellow',
  '橙': 'user-orange',
  '赤': 'user-red',
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#2b7489', JavaScript: '#f1e05a', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C++': '#f34b7d',
  C: '#555555', 'C#': '#178600', Ruby: '#701516', PHP: '#4F5D95',
  Swift: '#ffac45', Kotlin: '#F18E33', Scala: '#c22d40',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Dart: '#00B4AB', Zig: '#ec915c',
}

function formatDate(iso: string) {
  return iso.slice(0, 10).replace(/-/g, '/')
}

export const UserPage: FC<Props> = ({ user, repos, totalStars, rank, nextRank }) => {
  const rankClass = RANK_CLASS[rank.name] ?? 'user-grey'
  const progress = calcProgress(totalStars)
  const rankIndex = RANKS.findIndex(r => r.name === rank.name)
  const ownRepos = repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)

  return (
    <Layout title={`${user.login} - GitHub Star Rank`}>

      {/* ===== プロフィールセクション（AtCoder準拠） ===== */}
      <div class="row" style="margin-top: 10px">

        {/* 左列：アバター */}
        <div class="col-sm-2 text-center">
          <img src={user.avatar_url} alt={user.login} class="profile-img" />
        </div>

        {/* 右列：ユーザー情報 */}
        <div class="col-sm-10">
          <h3 class="username">
            <a
              href={user.html_url}
              target="_blank"
              class={rankClass}
              style="text-decoration: none"
            >
              {user.login}
            </a>
            <span class={`user-rank-badge ${rankClass}`}>{rank.name}</span>
          </h3>

          <dl class="dl-horizontal">
            {user.name && (
              <>
                <dt>Name</dt>
                <dd>{user.name}</dd>
              </>
            )}
            {user.bio && (
              <>
                <dt>Bio</dt>
                <dd>{user.bio}</dd>
              </>
            )}
            <dt>Registered</dt>
            <dd>{formatDate(user.created_at)}</dd>
          </dl>
        </div>
      </div>

      <hr style="margin: 20px 0" />

      {/* ===== スター統計（AtCoderのAlgorithmタブ相当） ===== */}

      {/* タブヘッダー（AtCoderに合わせて） */}
      <ul class="nav nav-tabs">
        <li class="active"><a href="#">Star Statistics</a></li>
      </ul>

      <div class="row">

        {/* 左：ランク（AtCoderの「Rank」列） */}
        <div class="col-sm-3 text-center">
          <p class="lead" style="margin-bottom: 5px">Rank</p>
          <p>
            <span class={`rank-number ${rankClass}`}>
              {rankIndex + 1}位
            </span>
            <br />
            <small class="small-note">/ {RANKS.length}ランク中</small>
          </p>
        </div>

        {/* 右：合計スター数（AtCoderの「Rating」列） */}
        <div class="col-sm-9">
          <div class="text-center" style="margin-bottom: 15px">
            <span class="small-note">Total Stars</span>
            <br />
            <span class={`rating-number ${rankClass}`}>
              {totalStars.toLocaleString()}
            </span>
          </div>

          <table class="table table-bordered table-condensed">
            <tbody>
              <tr>
                <td>Highest Stars</td>
                <td>
                  <span class={rankClass} style="font-weight: bold">
                    {totalStars.toLocaleString()}
                  </span>
                  {' '}— {rank.name}
                  {nextRank && (
                    <span class="small-note">
                      {' '}(+{(nextRank.min - totalStars).toLocaleString()} to promote)
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td>Public Repositories</td>
                <td>{ownRepos.length}</td>
              </tr>
              <tr>
                <td>Followers</td>
                <td>{user.followers.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Following</td>
                <td>{user.following.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* プログレスバー */}
          {nextRank ? (
            <>
              <div class="progress-label">
                <span class={rankClass} style="font-weight: bold">{rank.name} ({rank.min.toLocaleString()})</span>
                <span>{progress}%</span>
                <span class={RANK_CLASS[nextRank.name] ?? ''} style="font-weight: bold">
                  {nextRank.name} ({nextRank.min.toLocaleString()})
                </span>
              </div>
              <div class="progress">
                <div class="progress-bar" style={`width: ${progress}%; background: ${rank.color}`} />
              </div>
            </>
          ) : (
            <p class="text-center" style="color: #cc0000; font-weight: bold; margin-top: 10px">
              🎉 Highest Rank Achieved!
            </p>
          )}
        </div>
      </div>

      <hr />

      {/* ===== スターグラフ（AtCoderのレーティンググラフ相当） ===== */}
      <h4 style="margin-bottom: 10px">Star Chart</h4>
      <div class="panel panel-default" style="padding: 10px">
        <div
          dangerouslySetInnerHTML={{ __html: renderStarChart(ownRepos, rank.color) }}
        />
      </div>

      <hr />

      {/* ===== リポジトリ一覧 ===== */}
      <h4 style="margin-bottom: 10px">
        Repositories
        <small style="margin-left: 8px; color: #777">{ownRepos.length} repos</small>
      </h4>

      {ownRepos.length === 0 ? (
        <p class="text-muted">公開リポジトリがありません。</p>
      ) : (
        <div style="overflow-x: auto">
          <table class="table table-bordered table-condensed table-hover">
            <thead>
              <tr>
                <th>Repository</th>
                <th style="width: 130px">Language</th>
                <th style="width: 90px; text-align: right">⭐ Stars</th>
              </tr>
            </thead>
            <tbody>
              {ownRepos.map(repo => (
                <tr key={repo.name}>
                  <td style="color: inherit">
                    <a href={repo.html_url} target="_blank">{repo.name}</a>
                    {repo.description && (
                      <small style="color: #999; margin-left: 8px">
                        {repo.description.length > 60
                          ? repo.description.slice(0, 60) + '…'
                          : repo.description}
                      </small>
                    )}
                  </td>
                  <td>
                    {repo.language ? (
                      <>
                        <span
                          class="lang-dot"
                          style={`background: ${LANG_COLORS[repo.language] ?? '#888'}`}
                        />
                        {repo.language}
                      </>
                    ) : (
                      <span style="color: #ccc">—</span>
                    )}
                  </td>
                  <td style="text-align: right">
                    <span
                      class="repo-star"
                      style={`color: ${repo.stargazers_count >= 100 ? '#a67c00' : '#555'}`}
                    >
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </Layout>
  )
}

export const ErrorPage: FC<{ message: string }> = ({ message }) => (
  <Layout title="Error - GitHub Star Rank">
    <div class="text-center" style="padding: 60px 0">
      <h2>{message}</h2>
      <a href="/" class="btn btn-default" style="margin-top: 20px">← Back to Home</a>
    </div>
  </Layout>
)
