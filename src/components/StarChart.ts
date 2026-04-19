import type { GitHubRepo } from '../lib/github'

// JSXのSVG属性問題を避けるためSVG文字列を直接生成する
export function renderStarChart(repos: GitHubRepo[], color: string): string {
  const top = repos.slice(0, 20)
  if (top.length === 0) return ''

  const W = 700, H = 280
  const mT = 15, mR = 20, mB = 100, mL = 58
  const cW = W - mL - mR
  const cH = H - mT - mB

  const maxStars = Math.max(...top.map(r => r.stargazers_count), 1)
  const mag = Math.pow(10, Math.floor(Math.log10(maxStars)))
  const yMax = Math.ceil(maxStars / mag) * mag

  const bW = cW / top.length
  const bGap = Math.max(2, bW * 0.2)
  const bInner = bW - bGap

  // Y軸目盛（5本）
  const TICKS = 5
  const ticks = Array.from({ length: TICKS + 1 }, (_, i) => {
    const val = Math.round((yMax / TICKS) * i)
    const y = mT + cH - (val / yMax) * cH
    return { val, y }
  })

  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 ${W} ${H}" style="display:block;max-width:100%">`
  s += `<rect width="${W}" height="${H}" fill="#fff"/>`

  // グリッド線 + Y軸ラベル
  for (const { val, y } of ticks) {
    s += `<line x1="${mL}" y1="${y.toFixed(1)}" x2="${mL + cW}" y2="${y.toFixed(1)}" stroke="#ebebeb" stroke-width="1"/>`
    s += `<text x="${mL - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="#999" font-size="11" font-family="Helvetica,Arial,sans-serif">${val.toLocaleString()}</text>`
  }

  // 棒グラフ + X軸ラベル
  for (let i = 0; i < top.length; i++) {
    const repo = top[i]
    const x = mL + i * bW + bGap / 2
    const bH = Math.max(1, (repo.stargazers_count / yMax) * cH)
    const y = mT + cH - bH
    const cx = x + bInner / 2
    const labelY = mT + cH + 8

    s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bInner.toFixed(1)}" height="${bH.toFixed(1)}" fill="${color}" opacity="0.82" rx="1"/>`

    const name = repo.name.length > 13 ? repo.name.slice(0, 13) + '…' : repo.name
    s += `<text x="${cx.toFixed(1)}" y="${labelY}" transform="rotate(-45,${cx.toFixed(1)},${labelY})" text-anchor="end" fill="#555" font-size="10" font-family="Helvetica,Arial,sans-serif">${esc(name)}</text>`
  }

  // 軸
  s += `<line x1="${mL}" y1="${mT}" x2="${mL}" y2="${mT + cH}" stroke="#ccc" stroke-width="1"/>`
  s += `<line x1="${mL}" y1="${mT + cH}" x2="${mL + cW}" y2="${mT + cH}" stroke="#ccc" stroke-width="1"/>`

  s += `</svg>`
  return s
}

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
