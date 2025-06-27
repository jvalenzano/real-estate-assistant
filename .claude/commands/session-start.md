# Session Start Checklist

## Quick Status Check
```bash
# Verify development environment
cd ~/realeagent-prototype/web-app
npm run dev

# Test API endpoints - all should work
curl http://localhost:3000/api/v1/document-templates | jq '.data | length'  # Should show 36

# Test all 6 working forms
for template in CA_RPA BUYER_COUNTER_OFFER SELLER_COUNTER_OFFER REQUEST_FOR_REPAIR BUYER_CONTINGENCY_REMOVAL LEAD_BASED_PAINT; do
  echo "Testing $template..."
  curl -s http://localhost:3000/api/v1/document-templates/$template | grep -q '"success":true' && echo "✅ OK" || echo "❌ FAILED"
done

# Test document generation
curl -X POST http://localhost:3000/api/v1/documents/generate \
  -H "Content-Type: application/json" \
  -d '{"templateCode": "CA_RPA", "formData": {"propertyAddress": "123 Main St", "buyerName": "Test User"}, "transactionId": "test-session-$(date +%s)"}'
```

## Review Last Session
- Check CLAUDE.md for latest achievements and objectives
- Review git status for uncommitted changes
- Check generated documents: `ls -la public/generated-documents/`

## Current Status (as of 2025-06-27)
✅ **6 Forms Working**: 
- CA_RPA (Category 01) - Optimized with template caching
- BUYER_COUNTER_OFFER (Category 03) 
- SELLER_COUNTER_OFFER (Category 03)
- REQUEST_FOR_REPAIR (Category 01)
- BUYER_CONTINGENCY_REMOVAL (Category 02)
- LEAD_BASED_PAINT (Category 01)

✅ **Performance**: All forms generating in 0.5-1.1s (CA_RPA optimized from 1.76s to <1s)
✅ **Storage**: Supabase integration with signed URLs
✅ **Testing**: Automated validation script (validate-6-forms.js) confirms 9/10 investor ready

## Current Priorities

### Primary Objectives
1. **Field Mapping Tool**
   - Build interactive UI to click PDF positions
   - Generate pdf-fields.json automatically
   - Target: Reduce form implementation from 30min to 5min

2. **Document Management UI**
   - List generated documents by transaction
   - Filter by template type, date, status
   - Download and preview capabilities

3. **Scale to 15 Forms**
   - Next priorities: High-frequency forms from remaining categories
   - BUYER_INVESTIGATION (Cat 01)
   - NOTICE_TO_BUYER (Cat 02)
   - DISCLOSURE_INFO_ADVISORY (Cat 03)

### Testing Checklist
- [ ] All 6 forms generate without errors
- [ ] Performance stays under 1.5s per form
- [ ] Supabase storage uploads work
- [ ] Signed URLs are accessible

### Browser Testing URLs
- **Template Selection**: `http://localhost:3000/documents/new`
- **Properties Page**: `http://localhost:3000/properties`
- **Demo Login**: `http://localhost:3000/login` (agent@demo.com / demo123)

### Key Commands for This Session
```bash
# Quick form test
curl -X POST http://localhost:3000/api/v1/documents/generate \
  -H "Content-Type: application/json" \
  -d '{"templateCode": "BUYER_CONTINGENCY_REMOVAL", "formData": {"propertyAddress": "456 Oak St", "buyerName": "Jane Doe", "inspectionContingency": true}, "transactionId": "bcr-$(date +%s)"}'

# Check Supabase storage (if configured)
curl http://localhost:3000/api/v1/documents?transactionId=test-123

# Performance test all forms
time for t in CA_RPA BUYER_COUNTER_OFFER SELLER_COUNTER_OFFER REQUEST_FOR_REPAIR BUYER_CONTINGENCY_REMOVAL LEAD_BASED_PAINT; do
  curl -s -X POST http://localhost:3000/api/v1/documents/generate \
    -H "Content-Type: application/json" \
    -d "{\"templateCode\": \"$t\", \"formData\": {\"propertyAddress\": \"Test\"}, \"transactionId\": \"perf-test\"}" > /dev/null
done

# Run comprehensive automated validation (generates detailed report)
node scripts/validate-6-forms.js
```

### Quick Win Opportunities
- Implement 2-3 more forms using the proven 30-minute pattern
- Add basic filtering to document list API
- Create simple document viewer component

---

*Use this checklist at the start of each development session to quickly orient and prioritize work.*