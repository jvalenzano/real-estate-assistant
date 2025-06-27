# Claude Commands Collection

Essential AI-assisted development commands for Claude in IDEs like Cursor.

Opening Prompt: "New session startup: Read `CLAUDE.md` for project context, then `.claude/commands/session-start.md` to verify system health and identify current priorities."

## 🚀 Quick Start (New Projects)

### Option 1: One-Line Install (Future)
```bash
# Coming soon - when URLs are configured
curl -sSL https://your-repo/install-claude-commands.sh | bash
```

### Option 2: Manual Setup (Current)
```bash
# Clone/copy the setup script to your project root
./setup-claude-commands.sh
```

## Commands Overview

### 🔍 **code-review.md**
**Purpose**: Systematic code quality and security review
**When to use**: Before commits, during PR reviews, refactoring
**Key benefits**: Catches security issues, maintains code quality, prevents technical debt

### 🐛 **debug-helper.md**
**Purpose**: Structured debugging approach
**When to use**: Error troubleshooting, performance issues, unexpected behavior
**Key benefits**: Faster problem resolution, root cause analysis, systematic approach

### 🚀 **feature-implement.md**
**Purpose**: Consistent feature development following project standards
**When to use**: Building new features, major modifications
**Key benefits**: Maintains architecture consistency, ensures quality gates

### 🧪 **testing-helper.md**
**Purpose**: Comprehensive testing strategy and implementation
**When to use**: Adding tests, improving coverage, test-driven development
**Key benefits**: Better test coverage, consistent testing patterns

### ⚡ **performance-audit.md**
**Purpose**: Performance optimization and monitoring
**When to use**: Performance issues, optimization sprints, before releases
**Key benefits**: Mobile-first performance, user experience optimization

### 📚 **docs-helper.md**
**Purpose**: Documentation maintenance and creation
**When to use**: API changes, new features, architecture updates
**Key benefits**: Up-to-date documentation, better team communication

## How to Use These Commands

### In Cursor IDE
1. Open the command palette (Cmd/Ctrl + Shift + P)
2. Type "Claude: Chat with Claude"
3. In the chat, type `@code-review` (or any command name) *or us shlash shortcut, claud lists custom commands first in the list*
4. Claude will follow the structured approach defined in that command

### In VS Code with Claude Extension
1. Open Claude chat panel
2. Reference the command: "Follow the @debug-helper process to help me debug this issue"
3. Paste relevant code or describe the problem

### Manual Reference
- Keep this folder bookmarked for quick reference
- Copy command instructions into Claude chat when needed
- Customize commands for your specific project needs

## 🔄 Install Script Automation

### Current Setup
- **`setup-claude-commands.sh`**: Creates commands locally in current project
- **`install-claude-commands.sh`**: Downloads commands from remote repository (URLs need configuration)

### Making Install Script Functional

#### Step 1: Create a Repository
```bash
# Option A: Public GitHub repo
# 1. Create repo: github.com/yourname/claude-commands
# 2. Upload all .claude/commands/*.md files
# 3. Update URLs in install-claude-commands.sh

# Option B: Company/team internal repo
# 1. Create internal repo for standardized commands
# 2. Update URLs to point to your company's repository
```

#### Step 2: Update URLs in install-claude-commands.sh
```bash
# Replace placeholder URLs with actual repository URLs
# Example:
curl -sSL https://raw.githubusercontent.com/yourname/claude-commands/main/code-review.md > .claude/commands/code-review.md
```

#### Step 3: Use as "Step 1" for Any Project
```bash
# For new projects - instant setup
curl -sSL https://your-repo/install-claude-commands.sh | bash

# For existing projects - update to latest commands
./install-claude-commands.sh

# For team onboarding - standardized setup
git clone new-project && cd new-project && curl -sSL https://company-repo/install-claude-commands.sh | bash
```

### The Evolution Vision
Once functional, this becomes your **standard development workflow**:

```bash
# Step 1: Start any new project
mkdir new-awesome-project && cd new-awesome-project
git init

# Step 2: Get AI assistance commands (automated)
curl -sSL https://your-repo/install-claude-commands.sh | bash

# Step 3: Start coding with AI assistance
# Now you have consistent, high-quality AI assistance from day 1
```

### Benefits of Install Script Approach
- ✅ **Consistent across projects**: Same high-quality commands everywhere
- ✅ **Team standardization**: Everyone gets the same AI assistance patterns
- ✅ **Evolution ready**: Commands improve over time, updates propagate automatically
- ✅ **Onboarding acceleration**: New team members get best practices immediately
- ✅ **Zero configuration**: Works out of the box on any project

## Customization Guide

These commands are designed to be **project-agnostic** but should be customized:

### Technology Stack Adjustments
- **Frontend**: Update framework-specific patterns (React/Vue/Angular)
- **Backend**: Adjust for your API framework (Express/FastAPI/Django)
- **Database**: Modify for your database type (SQL/NoSQL)
- **Testing**: Update for your testing framework (Jest/Vitest/Cypress)

### Project-Specific Customization
1. **File Paths**: Update directory structures in commands
2. **Performance Targets**: Adjust based on your application requirements
3. **Code Standards**: Modify style guides and best practices
4. **Testing Strategy**: Adapt coverage goals and testing approaches

### Quick Customization Script
```bash
# Run this in your project root to customize commands for your stack
find .claude/commands -name "*.md" -exec sed -i 's/YOUR_FRAMEWORK/NextJS/g' {} \;
find .claude/commands -name "*.md" -exec sed -i 's/YOUR_DATABASE/PostgreSQL/g' {} \;
```

## Integration with Development Workflow

### Daily Development
1. **Start session**: Use these commands to maintain consistency
2. **Feature development**: `@feature-implement` for new features
3. **Problem solving**: `@debug-helper` for troubleshooting
4. **Code review**: `@code-review` before commits

### Sprint/Release Cycle
1. **Planning**: Use commands to estimate complexity and testing needs
2. **Development**: Follow implementation patterns consistently
3. **Testing**: `@testing-helper` for comprehensive test coverage
4. **Performance**: `@performance-audit` before releases
5. **Documentation**: `@docs-helper` to keep docs current

## Best Practices

### Command Execution
- **Be specific**: Provide context about your project and current issue
- **Include code**: Share relevant code snippets for better analysis
- **Follow up**: Ask for clarification or additional steps as needed

### Maintaining Commands
- **Review quarterly**: Update commands based on new best practices
- **Project feedback**: Modify based on what works for your team
- **Version control**: Keep commands in git for team sharing
- **Use install script**: Keep commands updated across all projects

### Team Adoption
- **Share install script**: Ensure all developers use the same commands
- **Training**: Show new team members how to use commands effectively
- **Feedback loop**: Continuously improve commands based on team experience
- **Standardization**: Use install script to maintain consistency across projects

## Troubleshooting

### Command Not Working
1. Check if you are referencing the command correctly
2. Ensure Claude has access to the command files
3. Try copying the command content directly into chat

### Install Script Issues
1. Verify URLs are correct and accessible
2. Check network connectivity
3. Ensure you have write permissions in the project directory
4. Test URLs individually with `curl -I [URL]`

### Customization Issues
1. Test commands after customization
2. Keep original versions backed up
3. Update gradually and test each change

### Performance Issues
1. Commands are designed to be efficient
2. If Claude responses are slow, break down requests
3. Use specific commands rather than general requests

## Contributing & Sharing

### Creating Your Command Repository
1. **Set up repository**: GitHub, GitLab, or internal repo
2. **Upload commands**: Copy your `.claude/commands/*.md` files
3. **Update install script**: Replace placeholder URLs with actual URLs
4. **Test installation**: Verify install script works in fresh project
5. **Share with team**: Distribute install script URL

### Versioning Commands
```bash
# Tag versions for stability
git tag v1.0.0 -m "Initial command set"
git tag v1.1.0 -m "Added mobile performance patterns"

# Install specific versions
curl -sSL https://your-repo/install-claude-commands.sh?ref=v1.0.0 | bash
```

### Community Sharing
- **Make public**: Share successful command patterns with the community
- **Contribute improvements**: Submit PRs to improve existing commands
- **Document successes**: Share case studies of AI-assisted development wins

---

**🎯 The Goal**: Transform these commands into your **standard "Step 1"** for any development project - instant, consistent, high-quality AI assistance from day one.

*These commands transform Claude from a general assistant into a specialized development partner that understands your project's specific needs and standards.*