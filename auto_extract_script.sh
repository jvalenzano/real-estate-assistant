#!/bin/bash

# Auto-Extract and Update Documentation Script
# Automatically finds real values from your codebase and updates documentation placeholders

set -e

echo "🔍 Auto-extracting values from your codebase..."

# Initialize variables
DEVELOPER_NAME=""
PROJECT_NAME=""
SUPABASE_URL=""
API_PORT=""
DEMO_EMAIL=""
DEMO_PASSWORD=""
GOLDEN_PROPERTY=""

# Function to safely extract value from file
extract_value() {
    local file="$1"
    local pattern="$2"
    local default="$3"
    
    if [ -f "$file" ]; then
        local value=$(grep "$pattern" "$file" 2>/dev/null | head -1 | cut -d'=' -f2 | tr -d '"' | tr -d "'" | xargs)
        if [ -n "$value" ] && [ "$value" != "your_"* ]; then
            echo "$value"
        else
            echo "$default"
        fi
    else
        echo "$default"
    fi
}

# Function to extract from JSON files
extract_json_value() {
    local file="$1"
    local key="$2"
    local default="$3"
    
    if [ -f "$file" ] && command -v jq >/dev/null 2>&1; then
        local value=$(jq -r ".$key // empty" "$file" 2>/dev/null)
        if [ -n "$value" ] && [ "$value" != "null" ]; then
            echo "$value"
        else
            echo "$default"
        fi
    else
        echo "$default"
    fi
}

echo "📊 Extracting project information..."

# Extract developer name from git config or system
if command -v git >/dev/null 2>&1; then
    DEVELOPER_NAME=$(git config user.name 2>/dev/null || echo "Jason Valenzano")
else
    DEVELOPER_NAME="Jason Valenzano"
fi

# Extract project name from package.json
PROJECT_NAME=$(extract_json_value "package.json" "name" "realeagent-prototype")

# Extract API port from server files
if [ -f "api-server/src/server.ts" ]; then
    API_PORT=$(grep -E "(PORT|port)" api-server/src/server.ts | grep -o '[0-9]\+' | head -1)
fi
[ -z "$API_PORT" ] && API_PORT="3001"

# Extract environment variables from .env file
if [ -f "api-server/.env" ]; then
    echo "🔐 Found .env file, extracting configuration..."
    SUPABASE_URL=$(extract_value "api-server/.env" "SUPABASE_URL" "<your_supabase_url>")
    NODE_ENV=$(extract_value "api-server/.env" "NODE_ENV" "development")
else
    echo "⚠️  No .env file found, using placeholders"
    SUPABASE_URL="<your_supabase_url>"
    NODE_ENV="development"
fi

# Extract demo credentials from code
if [ -f "demo-data/users.json" ]; then
    echo "👤 Extracting demo user credentials..."
    DEMO_EMAIL=$(jq -r '.[] | select(.role == "agent") | .email' demo-data/users.json 2>/dev/null | head -1)
    DEMO_PASSWORD=$(jq -r '.[] | select(.role == "agent") | .password' demo-data/users.json 2>/dev/null | head -1)
fi
[ -z "$DEMO_EMAIL" ] && DEMO_EMAIL="agent@demo.com"
[ -z "$DEMO_PASSWORD" ] && DEMO_PASSWORD="demo123"

# Extract golden path property from demo data
if [ -f "demo-data/properties.json" ]; then
    echo "🏠 Extracting golden path property..."
    GOLDEN_PROPERTY=$(jq -r '.[0].mls // empty' demo-data/properties.json 2>/dev/null)
fi
[ -z "$GOLDEN_PROPERTY" ] && GOLDEN_PROPERTY="ML81234567"

# Extract current phase from existing scratchpad
CURRENT_PHASE="Phase 5: React Native App"
if [ -f ".cursor/knowledge-base/legacy-scratchpad.md" ]; then
    PHASE_LINE=$(grep -i "phase.*:" .cursor/knowledge-base/legacy-scratchpad.md | head -1)
    if [ -n "$PHASE_LINE" ]; then
        CURRENT_PHASE="$PHASE_LINE"
    fi
fi

# Display extracted values
echo ""
echo "📋 Extracted Configuration:"
echo "   Developer: $DEVELOPER_NAME"
echo "   Project: $PROJECT_NAME"
echo "   API Port: $API_PORT"
echo "   Environment: $NODE_ENV"
echo "   Supabase: $(echo $SUPABASE_URL | cut -c1-20)..."
echo "   Demo Email: $DEMO_EMAIL"
echo "   Demo Password: $DEMO_PASSWORD"
echo "   Golden Property: $GOLDEN_PROPERTY"
echo "   Current Phase: $CURRENT_PHASE"
echo ""

# Function to update placeholders in a file
update_placeholders() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "📝 Updating: $file"
        
        # Create backup
        cp "$file" "$file.backup"
        
        # Update common placeholders
        sed -i.tmp "s/\[Your Name\]/$DEVELOPER_NAME/g" "$file"
        sed -i.tmp "s/\[your name\]/$DEVELOPER_NAME/g" "$file"
        sed -i.tmp "s/your_supabase_url/$(echo $SUPABASE_URL | sed 's/[\/&]/\\&/g')/g" "$file"
        sed -i.tmp "s/your_gemini_key/<your_gemini_api_key>/g" "$file"
        sed -i.tmp "s/your_integration_key/<your_docusign_integration_key>/g" "$file"
        sed -i.tmp "s/your_user_id/<your_docusign_user_id>/g" "$file"
        sed -i.tmp "s/your_account_id/<your_docusign_account_id>/g" "$file"
        
        # Update project-specific values
        sed -i.tmp "s/agent@demo\.com/$DEMO_EMAIL/g" "$file"
        sed -i.tmp "s/demo123/$DEMO_PASSWORD/g" "$file"
        sed -i.tmp "s/ML81234567/$GOLDEN_PROPERTY/g" "$file"
        sed -i.tmp "s/localhost:3001/localhost:$API_PORT/g" "$file"
        
        # Update TBD and pending statuses
        sed -i.tmp "s/TBD/Not yet implemented/g" "$file"
        sed -i.tmp "s/\[To be decided\]/To be determined by $DEVELOPER_NAME/g" "$file"
        sed -i.tmp "s/Pending 🔄/In Progress by $DEVELOPER_NAME 🔄/g" "$file"
        
        # Clean up temporary files
        rm -f "$file.tmp"
    fi
}

echo "🔄 Updating documentation files..."

# Update all documentation files
FILES_TO_UPDATE=(
    ".cursor/project-board/command-center.md"
    ".cursor/ai-instructions/cursor-context.md"
    ".cursor/knowledge-base/decisions.md"
    "docs/quick-reference/api-endpoints.md"
    "docs/quick-reference/performance-metrics.md"
    "CLAUDE.md"
)

for file in "${FILES_TO_UPDATE[@]}"; do
    update_placeholders "$file"
done

# Special handling for environment examples
if [ -f ".cursor/ai-instructions/cursor-context.md" ]; then
    echo "🔧 Updating environment variable examples..."
    
    # Create a realistic .env example based on what we found
    cat >> .cursor/ai-instructions/environment-template.md << EOF

## Environment Variables Reference

### Development (.env)
\`\`\`bash
NODE_ENV=$NODE_ENV
PORT=$API_PORT

# Supabase (if using)
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_KEY=<your_service_key>

# AI Integration (when ready)
GEMINI_API_KEY=<your_gemini_api_key>

# DocuSign (for Phase 7)
DOCUSIGN_INTEGRATION_KEY=<your_docusign_key>
DOCUSIGN_USER_ID=<your_docusign_user_id>
DOCUSIGN_ACCOUNT_ID=<your_docusign_account_id>
\`\`\`

### Demo Accounts
- **Agent**: $DEMO_EMAIL / $DEMO_PASSWORD
- **Golden Path Property**: $GOLDEN_PROPERTY

EOF
fi

# Update command center with current developer info
if [ -f ".cursor/project-board/command-center.md" ]; then
    echo "🎯 Personalizing command center..."
    
    # Update the header with current info
    sed -i.tmp "s/\*Active Developer:.*\*/\*Active Developer: $DEVELOPER_NAME\*/g" ".cursor/project-board/command-center.md"
    sed -i.tmp "s/\*Sprint: Week.*\*/\*Sprint: Week 2 of 3 - Mobile App Development\*/g" ".cursor/project-board/command-center.md"
    
    rm -f ".cursor/project-board/command-center.md.tmp"
fi

# Create extraction report
echo "📊 Creating extraction report..."

cat > .cursor/extraction-report.md << EOF
# Auto-Extraction Report

**Generated**: $(date)
**Developer**: $DEVELOPER_NAME

## Values Extracted and Updated

### Project Configuration
- **Project Name**: $PROJECT_NAME
- **API Port**: $API_PORT
- **Environment**: $NODE_ENV

### Demo Configuration  
- **Demo Email**: $DEMO_EMAIL
- **Demo Password**: $DEMO_PASSWORD
- **Golden Property**: $GOLDEN_PROPERTY

### Service Configuration
- **Supabase URL**: $(echo $SUPABASE_URL | cut -c1-30)...
- **Other Services**: Configured as placeholders

### Files Updated
$(for file in "${FILES_TO_UPDATE[@]}"; do echo "- $file"; done)

## Backup Files Created
All original files backed up with .backup extension.

## Next Steps
1. Review updated documentation files
2. Add missing service credentials to .env
3. Test API endpoints with updated configuration
4. Continue with mobile app development

---
*Auto-generated by extraction script*
EOF

echo "✅ Auto-extraction and update complete!"
echo ""
echo "📁 Updated files:"
for file in "${FILES_TO_UPDATE[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file"
    fi
done
echo ""
echo "💾 Backup files created with .backup extension"
echo "📋 Extraction report: .cursor/extraction-report.md"
echo ""
echo "🎯 Key updates made:"
echo "   • Developer name: $DEVELOPER_NAME"
echo "   • Demo credentials: $DEMO_EMAIL / $DEMO_PASSWORD"
echo "   • Golden property: $GOLDEN_PROPERTY"
echo "   • API port: $API_PORT"
echo "   • All TBD/Pending items updated"
echo ""
echo "🚀 Ready to continue development with personalized documentation!"
