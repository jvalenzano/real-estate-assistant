#!/bin/bash

# Automated Date Update Script
# Run this whenever you want to update "Last Updated" timestamps

CURRENT_DATE=$(date +"%Y-%m-%d")
CURRENT_DATETIME=$(date +"%Y-%m-%d %H:%M")

echo "📅 Updating timestamps to: $CURRENT_DATETIME"

# Files to update
FILES=(
    ".cursor/project-board/command-center.md"
    ".cursor/ai-instructions/cursor-context.md"
    ".cursor/knowledge-base/decisions.md"
    "docs/quick-reference/performance-metrics.md"
    "CLAUDE.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating: $file"
        # Update any "Last Updated" lines
        sed -i.bak "s/Last Updated: [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9].*/Last Updated: $CURRENT_DATETIME/g" "$file"
        sed -i.bak "s/\*Last Updated: [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9].*/*Last Updated: $CURRENT_DATETIME*/g" "$file"
        rm -f "$file.bak"
    fi
done

echo "✅ Timestamps updated!"
