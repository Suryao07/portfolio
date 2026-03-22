# Environment Setup Guide

## Security Fix: GitHub Token Setup

The hardcoded GitHub token has been removed from the code for security reasons. To use the Projects page functionality, you need to set up environment variables.

### Step 1: Get a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Portfolio Website")
4. Select the `repo` scope (full access to repositories)
5. Click "Generate token"
6. **Copy the token immediately** - you won't be able to see it again!

### Step 2: Create Environment File

Create a `.env` file in the root directory of your project:

```bash
# Create .env file
VITE_GITHUB_TOKEN=your_github_token_here
```

Replace `your_github_token_here` with your actual GitHub token.

### Step 3: Restart Development Server

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

## Important Security Notes

- Never commit the `.env` file to version control
- Regenerate your GitHub token if you suspect it has been compromised
- The token should have minimal required permissions (only `repo` scope)

## Troubleshooting

If the Projects page shows rate limiting errors, make sure:
1. Your `.env` file is in the project root
2. The token has the correct format (starts with `ghp_`)
3. The token has `repo` scope permissions
4. You've restarted the development server