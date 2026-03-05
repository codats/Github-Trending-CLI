#!/usr/bin/env node

import axios from 'axios';

interface Repo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: {
    login: string;
    html_url: string;
  };
}

interface GitHubTrendingResponse {
  repositories: Repo[];
}

type Duration = 'day' | 'week' | 'month' | 'year';

const DURATION_TO_SINCE: Record<Duration, string> = {
  day: 'daily',
  week: 'weekly',
  month: 'monthly',
  year: 'yearly',
};

function parseArgs(args: string[]): { duration: Duration; limit: number } {
  let duration: Duration = 'week';
  let limit = 10;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--duration' && args[i + 1]) {
      const value = args[i + 1] as Duration;
      if (['day', 'week', 'month', 'year'].includes(value)) {
        duration = value;
        i++;
      } else {
        console.error(`Error: Invalid duration "${value}". Must be one of: day, week, month, year.`);
        process.exit(1);
      }
    } else if (args[i] === '--limit' && args[i + 1]) {
      const value = parseInt(args[i + 1], 10);
      if (isNaN(value) || value <= 0) {
        console.error(`Error: Invalid limit "${args[i + 1]}". Must be a positive number.`);
        process.exit(1);
      }
      limit = value;
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
GitHub Trending CLI - Fetch trending repositories from GitHub

Usage: trending-repos [options]

Options:
  --duration <day|week|month|year>  Time range for trending (default: week)
  --limit <number>                  Number of repositories to display (default: 10)
  --help, -h                        Show this help message

Examples:
  trending-repos --duration month --limit 20
  trending-repos --duration year
  trending-repos --limit 5
`);
      process.exit(0);
    }
  }

  return { duration, limit };
}

async function fetchTrendingRepos(duration: Duration, limit: number): Promise<Repo[]> {
  const since = DURATION_TO_SINCE[duration];
  
  // Using GitHub's built-in search API to find trending repos
  // Note: GitHub doesn't have a direct "trending" API endpoint, 
  // so we use their search API sorted by stars
  const query = `stars:>=1000`;
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'github-trending-cli',
      },
    });

    const repos = response.data.items as Repo[];
    
    // Sort by star count (descending)
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    
    return repos.slice(0, limit);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`Error: API request failed with status ${error.response.status}`);
        if (error.response.status === 403) {
          console.error('Rate limit exceeded. Please wait a moment and try again.');
        }
        console.error(`Details: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('Error: No response received from GitHub API.');
      } else {
        console.error(`Error: ${error.message}`);
      }
    } else if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unexpected error occurred.');
    }
    process.exit(1);
  }
}

function formatOutput(repos: Repo[], duration: Duration): void {
  console.log(`\n🔥 Trending Repositories (${duration})\n`);
  console.log('='.repeat(80));

  repos.forEach((repo, index) => {
    const rank = (index + 1).toString().padStart(2, ' ');
    const name = `${repo.owner.login}/${repo.name}`.padEnd(45);
    const stars = `⭐ ${repo.stargazers_count.toLocaleString()}`.padStart(15);
    const forks = `🍴 ${repo.forks_count.toLocaleString()}`.padStart(12);
    const language = repo.language ? `💻 ${repo.language}` : '';
    
    console.log(`${rank}. ${name} ${stars} ${forks} ${language}`);
    console.log(`   ${repo.description || 'No description available'}`);
    console.log(`   🔗 ${repo.html_url}`);
    console.log('-'.repeat(80));
  });

  console.log(`\nShowing ${repos.length} repositories`);
  console.log('='.repeat(80));
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { duration, limit } = parseArgs(args);

  console.log(`Fetching trending repositories for the past ${duration}...`);
  
  const repos = await fetchTrendingRepos(duration, limit);
  
  if (repos.length === 0) {
    console.log('No trending repositories found.');
    process.exit(0);
  }

  formatOutput(repos, duration);
}

main().catch((error) => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});