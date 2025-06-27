#!/bin/bash
# Quick installer for Claude Commands
# Usage: curl -sSL https://your-repo/install-claude-commands.sh | bash

echo "🚀 Installing Claude Commands..."
mkdir -p .claude/commands

# Download commands (replace with your actual repository URLs)
echo "📝 Downloading command files..."
curl -sSL https://raw.githubusercontent.com/your-repo/claude-commands/main/code-review.md > .claude/commands/code-review.md
curl -sSL https://raw.githubusercontent.com/your-repo/claude-commands/main/debug-helper.md > .claude/commands/debug-helper.md
curl -sSL https://raw.githubusercontent.com/your-repo/claude-commands/main/feature-implement.md > .claude/commands/feature-implement.md
curl -sSL https://raw.githubusercontent.com/your-repo/claude-commands/main/testing-helper.md > .claude/commands/testing-helper.md
curl -sSL https://raw.githubusercontent.com/your-repo/claude-commands/main/performance-audit.md > .claude/commands/performance-audit.md
curl -sSL https://raw.githubusercontent.com/your-repo/claude-commands/main/docs-helper.md > .claude/commands/docs-helper.md
curl -sSL https://raw.githubusercontent.com/your-repo/claude-commands/main/README.md > .claude/commands/README.md

echo "✅ Claude Commands installed successfully!"
echo "📚 Check .claude/commands/README.md for usage instructions"
