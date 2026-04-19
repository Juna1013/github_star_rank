export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  created_at: string;
};

export type GitHubRepo = {
  name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
  language: string | null;
  updated_at: string;
};

export type GitHubError = { type: 'not_found' } | { type: 'rate_limit' } | { type: 'error'; message: string };

function buildHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'github-star-rank',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function getUser(username: string): Promise<GitHubUser | GitHubError> {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: buildHeaders(),
  });
  if (res.status === 404) return { type: 'not_found' };
  if (res.status === 403) return { type: 'rate_limit' };
  if (!res.ok) return { type: 'error', message: `HTTP ${res.status}` };
  return res.json() as Promise<GitHubUser>;
}

export async function getAllRepos(username: string): Promise<GitHubRepo[] | GitHubError> {
  const repos: GitHubRepo[] = [];
  const MAX_PAGES = 10;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&type=owner`,
      { headers: buildHeaders() }
    );
    if (res.status === 403) return { type: 'rate_limit' };
    if (!res.ok) break;

    const data = await res.json() as GitHubRepo[];
    repos.push(...data);
    if (data.length < 100) break;
  }

  return repos;
}

export function calcTotalStars(repos: GitHubRepo[]): number {
  return repos
    .filter(r => !r.fork)
    .reduce((sum, r) => sum + r.stargazers_count, 0);
}

export function isError(value: unknown): value is GitHubError {
  if (typeof value !== 'object' || value === null) return false;
  const t = (value as Record<string, unknown>).type;
  return t === 'not_found' || t === 'rate_limit' || t === 'error';
}
