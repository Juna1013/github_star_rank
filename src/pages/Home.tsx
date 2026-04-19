import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { RANKS } from '../lib/rank'

export const Home: FC = () => (
  <Layout title="GitHub Star Rank">
    <div class="jumbotron">
      <h1>GitHub Star Rank</h1>
      <p>GitHubの公開リポジトリの合計スター数で、あなたのランクを確認しよう</p>
      <form action="/user" method="get" style="max-width: 480px; margin: 24px auto 0">
        <div class="input-group">
          <input
            type="text"
            name="username"
            class="form-control"
            placeholder="GitHub ユーザー名（例: torvalds）"
            required
            autocomplete="off"
          />
          <div class="input-group-btn">
            <button type="submit" class="btn btn-primary">Search</button>
          </div>
        </div>
      </form>
    </div>

    <div class="row">
      <div class="col-sm-4 col-sm-offset-4" style="margin: 0 auto; float: none">
        <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 8px">
          Rank Criteria
        </h3>
        <table class="table table-bordered table-condensed">
          <thead>
            <tr>
              <th>Color</th>
              <th>Total Stars</th>
            </tr>
          </thead>
          <tbody>
            {[...RANKS].reverse().map(rank => (
              <tr key={rank.name}>
                <td>
                  <span style={`color: ${rank.color}; font-weight: bold; font-size: 16px`}>
                    {rank.name}
                  </span>
                </td>
                <td>
                  {rank.max !== null
                    ? `${rank.min.toLocaleString()} ～ ${rank.max.toLocaleString()}`
                    : `${rank.min.toLocaleString()} ～`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
)
