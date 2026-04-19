import type { FC, Child } from 'hono/jsx'

type Props = {
  title?: string
  children: Child
}

// Bootstrap 3 + AtCoder固有スタイルを再現
const CSS = `
/* ===== Bootstrap 3 リセット ===== */
*, *::before, *::after { box-sizing: border-box; }
html { font-size: 10px; -webkit-tap-highlight-color: rgba(0,0,0,0); }
body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333;
  background: #fff;
  margin: 0;
}
a { color: #337ab7; text-decoration: none; }
a:hover, a:focus { color: #23527c; text-decoration: underline; }
img { vertical-align: middle; border: 0; }
h1,h2,h3,h4,h5,h6 { font-family: inherit; font-weight: 500; line-height: 1.1; color: inherit; margin-top: 20px; margin-bottom: 10px; }
h1 { font-size: 36px; } h2 { font-size: 30px; } h3 { font-size: 24px; }
p { margin: 0 0 10px; }
small { font-size: 85%; }
.text-center { text-align: center; }
.text-muted { color: #777; }
.lead { margin-bottom: 20px; font-size: 16px; font-weight: 300; line-height: 1.4; }

/* ===== Bootstrap Grid ===== */
.container { margin-right: auto; margin-left: auto; padding-right: 15px; padding-left: 15px; max-width: 1170px; }
.row { margin-right: -15px; margin-left: -15px; }
.row::after { content: ""; display: table; clear: both; }
[class*="col-"] { position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; float: left; }
.col-sm-2  { width: 16.66667%; }
.col-sm-3  { width: 25%; }
.col-sm-4  { width: 33.33333%; }
.col-sm-8  { width: 66.66667%; }
.col-sm-9  { width: 75%; }
.col-sm-10 { width: 83.33333%; }
.col-sm-12 { width: 100%; }

/* ===== Bootstrap Navbar（navbar-inverse） ===== */
.navbar {
  position: relative;
  min-height: 50px;
  margin-bottom: 20px;
  border: 1px solid transparent;
}
.navbar-inverse {
  background-color: #222;
  border-color: #080808;
}
.navbar > .container { display: flex; align-items: center; }
.navbar-header { float: left; }
.navbar-brand {
  float: left;
  height: 50px;
  padding: 15px 15px;
  font-size: 18px;
  line-height: 20px;
  color: #fff;
  text-decoration: none;
}
.navbar-brand:hover { color: #fff; background: transparent; text-decoration: none; }
.navbar-inverse .navbar-brand { color: #fff; }
.navbar-inverse .navbar-brand:hover { color: #fff; }
.navbar-collapse { flex: 1; padding: 0; }
.nav { margin-bottom: 0; padding: 0; list-style: none; }
.navbar-nav { margin: 0; float: left; }
.navbar-nav > li { float: left; }
.navbar-nav > li > a { padding: 15px; line-height: 20px; display: block; font-size: 14px; }
.navbar-inverse .navbar-nav > li > a { color: #9d9d9d; }
.navbar-inverse .navbar-nav > li > a:hover { color: #fff; background: #080808; text-decoration: none; }
.navbar-inverse .navbar-nav > .active > a { color: #fff; background: #080808; }
.navbar-right { float: right; margin-right: -15px; }

/* ===== Bootstrap ページヘッダー ===== */
.page-header { padding-bottom: 9px; margin: 40px 0 20px; border-bottom: 1px solid #eee; }
.page-header h2 { margin-top: 0; }

/* ===== Bootstrap dl-horizontal ===== */
.dl-horizontal { margin-bottom: 0; }
.dl-horizontal dt {
  float: left;
  width: 160px;
  clear: left;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
  padding-bottom: 5px;
  color: #777;
}
.dl-horizontal dd {
  margin-left: 180px;
  padding-bottom: 5px;
}
.dl-horizontal dd::after { content: ""; display: table; clear: both; }

/* ===== Bootstrap table ===== */
.table { width: 100%; max-width: 100%; margin-bottom: 20px; border-collapse: collapse; background: transparent; }
.table > tbody > tr > td,
.table > tbody > tr > th,
.table > thead > tr > td,
.table > thead > tr > th {
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
  border-top: 1px solid #ddd;
}
.table > thead > tr > th { vertical-align: bottom; border-bottom: 2px solid #ddd; }
.table-bordered { border: 1px solid #ddd; }
.table-bordered > tbody > tr > td,
.table-bordered > tbody > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > thead > tr > th { border: 1px solid #ddd; }
.table-condensed > tbody > tr > td,
.table-condensed > tbody > tr > th,
.table-condensed > thead > tr > td,
.table-condensed > thead > tr > th { padding: 5px; }
.table-striped > tbody > tr:nth-of-type(odd) { background: #f9f9f9; }
.table-hover > tbody > tr:hover { background: #f5f5f5; }
.table > tbody > tr > td:first-child { min-width: 160px; color: #777; }

/* ===== Bootstrap nav-tabs ===== */
.nav-tabs {
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
  padding-left: 0;
  list-style: none;
}
.nav-tabs::after { content: ""; display: table; clear: both; }
.nav-tabs > li { float: left; margin-bottom: -1px; }
.nav-tabs > li > a {
  margin-right: 2px;
  line-height: 1.42857143;
  border: 1px solid transparent;
  border-radius: 4px 4px 0 0;
  padding: 10px 15px;
  display: block;
  color: #555;
  text-decoration: none;
}
.nav-tabs > li > a:hover { border-color: #eee #eee #ddd; background: #eee; text-decoration: none; }
.nav-tabs > li.active > a {
  color: #555;
  cursor: default;
  background: #fff;
  border: 1px solid #ddd;
  border-bottom-color: transparent;
}

/* ===== Bootstrap panel ===== */
.panel { margin-bottom: 20px; background: #fff; border: 1px solid transparent; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,.05); }
.panel-default { border-color: #ddd; }
.panel-default > .panel-heading { color: #333; background: #f5f5f5; border-color: #ddd; }
.panel-heading { padding: 10px 15px; border-bottom: 1px solid transparent; border-radius: 3px 3px 0 0; }
.panel-body { padding: 15px; }

/* ===== Bootstrap form ===== */
.form-control {
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  outline: none;
}
.form-control:focus { border-color: #66afe9; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6); }
.input-group { display: flex; }
.input-group .form-control { flex: 1; border-radius: 4px 0 0 4px; }
.btn {
  display: inline-block;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
  text-decoration: none;
  background: none;
}
.btn-default { color: #333; background: #fff; border-color: #ccc; }
.btn-default:hover { color: #333; background: #e6e6e6; border-color: #adadad; text-decoration: none; }
.btn-primary { color: #fff; background: #337ab7; border-color: #2e6da4; }
.btn-primary:hover { color: #fff; background: #286090; border-color: #204d74; text-decoration: none; }
.input-group-btn .btn { border-radius: 0 4px 4px 0; margin-left: -1px; height: 34px; }

/* ===== AtCoder ユーザーカラー ===== */
.user-grey    { color: #808080; }
.user-brown   { color: #804000; }
.user-green   { color: #008000; }
.user-cyan    { color: #00C0C0; }
.user-blue    { color: #0000FF; }
.user-yellow  { color: #C0C000; }
.user-orange  { color: #FF8000; }
.user-red     { color: #FF0000; }

/* ===== プロフィールページ固有 ===== */
.profile-img { width: 100px; height: 100px; border-radius: 50%; }
.username { font-size: 24px; font-weight: bold; margin-top: 0; }
.user-rank-badge {
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border: 2px solid currentColor;
  border-radius: 2px;
  margin-left: 8px;
  vertical-align: middle;
}

/* ランク統計 */
.rank-number { font-size: 28px; font-weight: bold; }
.rating-number { font-size: 48px; font-weight: bold; line-height: 1; }
.small-note { font-size: 11px; color: #777; }

/* プログレスバー */
.progress {
  height: 10px;
  overflow: hidden;
  background: #f5f5f5;
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
  margin-bottom: 4px;
}
.progress-bar { height: 100%; border-radius: 4px; transition: width .6s ease; }
.progress-label { display: flex; justify-content: space-between; font-size: 11px; color: #888; margin-bottom: 3px; }

/* リポジトリテーブル */
.lang-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}
.repo-star { font-weight: bold; font-family: monospace; }

/* ===== トップページ ===== */
.jumbotron {
  padding: 48px 60px;
  margin-bottom: 30px;
  background: #eee;
  border-radius: 6px;
  text-align: center;
}
.jumbotron h1 { font-size: 48px; margin-top: 0; font-weight: 600; }
.jumbotron p { font-size: 18px; color: #555; }

/* ===== フッター ===== */
footer {
  padding: 30px 0;
  margin-top: 30px;
  border-top: 1px solid #e5e5e5;
  color: #777;
  text-align: center;
  font-size: 13px;
}

@media (max-width: 767px) {
  [class*="col-"] { float: none; width: 100%; }
  .dl-horizontal dt { float: none; width: auto; text-align: left; }
  .dl-horizontal dd { margin-left: 0; }
  .navbar-right { float: none !important; }
}
`

export const Layout: FC<Props> = ({ title, children }) => (
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title ?? 'GitHub Star Rank'}</title>
      <style>{CSS}</style>
    </head>
    <body>
      <nav class="navbar navbar-inverse">
        <div class="container">
          <div class="navbar-header">
            <a href="/" class="navbar-brand">GitHub Star Rank</a>
          </div>
          <div class="navbar-collapse">
            <ul class="nav navbar-nav">
              <li class="active"><a href="/">Home</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <li><a href="https://github.com" target="_blank">GitHub</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="container">
        {children}
      </div>

      <div class="container">
        <footer>
          <p>GitHub Star Rank — Inspired by <a href="https://atcoder.jp" target="_blank">AtCoder</a></p>
        </footer>
      </div>
    </body>
  </html>
)
