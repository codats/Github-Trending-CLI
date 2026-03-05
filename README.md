# GitHub Trending CLI

A command-line interface tool that interacts with the GitHub API to retrieve and display trending repositories.

## Overview

GitHub Trending CLI allows you to quickly fetch and view trending repositories from GitHub directly from your terminal. The tool supports filtering by time range (day, week, month, or year) and lets you customize the number of results displayed.

## Project Structure

```
github-trending-cli/
├── src/              # TypeScript source code
├── dist/             # Compiled JavaScript (generated)
├── tests/            # Test files
├── package.json      # Project configuration and dependencies
├── tsconfig.json     # TypeScript configuration
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## Requirements

- Node.js 18.0 or higher
- npm 9.0 or higher

## Installation

### From Source

1. Clone or navigate to the project directory:
   ```bash
   cd github-trending-cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project (automatically runs during install):
   ```bash
   npm run build
   ```

4. Run the CLI:
   ```bash
   npm start -- [options]
   ```

### Global Installation (Optional)

To use the CLI globally without `npm start`:

```bash
npm install -g .
```

Then you can run it from anywhere:
```bash
trending-repos --duration week --limit 10
```

## Usage

### Basic Usage

```bash
npm start
```

This will fetch the top 10 trending repositories for the past week (default settings).

### Command-Line Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `--duration <day|week|month|year>` | Time range for trending repositories | `week` |
| `--limit <number>` | Number of repositories to display | `10` |
| `--help`, `-h` | Show help message | - |

### Examples

Fetch trending repositories for the past month:
```bash
npm start -- --duration month
```

Fetch top 20 trending repositories:
```bash
npm start -- --limit 20
```

Combine duration and limit:
```bash
npm start -- --duration month --limit 20
```

Fetch yearly trending repositories:
```bash
npm start -- --duration year
```

Show help:
```bash
npm start -- --help
```

### Global Usage (after `npm install -g .`)

```bash
trending-repos --duration month --limit 20
trending-repos --duration year
trending-repos --limit 5
trending-repos -h
```

## Output Format

The CLI displays repositories in a formatted list including:
- Rank number
- Repository name (owner/repo)
- Star count
- Fork count
- Primary programming language
- Description
- Repository URL

Example output:
```
🔥 Trending Repositories (week)

================================================================================
 1. facebook/react                            ⭐ 223,456 🍴 45,678 💻 TypeScript
    A declarative, efficient, and flexible JavaScript library for building user interfaces.
    🔗 https://github.com/facebook/react
--------------------------------------------------------------------------------
```

## Features

- **Time Range Filtering**: Filter trending repositories by day, week, month, or year
- **Customizable Results**: Set the number of repositories to display
- **Sorted by Stars**: Results are sorted by star count in descending order
- **Rich Output**: Displays repository name, stars, forks, language, description, and URL
- **Error Handling**: Robust error handling for API failures and invalid inputs
- **Rate Limit Awareness**: Informs users when GitHub API rate limits are exceeded

## API Information

This tool uses the GitHub REST API v3 to search for repositories. No authentication is required for basic usage, but GitHub API rate limits apply:
- Unauthenticated: 10 requests per minute
- Authenticated: 30 requests per minute

For higher rate limits, you can add a GitHub token (optional):
```bash
export GITHUB_TOKEN=your_token_here
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled CLI |
| `npm run dev` | Run the CLI directly from TypeScript source |
| `npm run prepare` | Build before publishing |

## License

MIT