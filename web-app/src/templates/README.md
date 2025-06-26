# RealeAgent Document Templates

## Overview
This directory contains all California real estate form templates organized by transaction stage.

## Directory Structure

```
templates/
├── 01-buyers-offer/        # Buyer's Offer and Negotiation Stage
├── 02-contingency-removal/ # Contingency Removal and Closing
├── 03-escrow-contingency/  # Escrow and Contingency Stage
├── 04-final-disclosures/   # Final Disclosures & Delivery
├── 05-specific-situations/ # Forms Used in Specific Situations
└── 06-listing-stage/       # Listing Stage
```

## Implementation Status

### ✅ Implemented Forms
- **CA_RPA** - California Residential Purchase Agreement (01-buyers-offer)

### ⏳ Pending Implementation (49+ forms)
All other forms have placeholder templates ready for implementation.

## Form Categories

### 01 - Buyer's Offer and Negotiation Stage
Forms used during the initial offer and negotiation phase:
- California Residential Purchase Agreement (CA_RPA) ✅
- Addendum No #1
- Buyer Early Occupancy Addendum
- Buyer's Investigation Advisory
- Interim Occupancy Agreement
- Lead Based Paint Disclosure
- Request for Repair
- Seller License to Remain in Possession

### 02 - Contingency Removal and Closing
Forms for removing contingencies:
- Buyer Contingency Removal #1
- Demand to Close Escrow
- Notice to Buyer to Perform
- Receipt for Reports
- Verification of Property Condition

### 03 - Escrow and Contingency Stage
Documents during escrow:
- Buyer Counter Offer #1
- Disclosure Information Advisory
- Seller Counter Offer #1
- Seller Response and Buyer Reply
- Tenancy In Common Advisory
- Water-Conserving Plumbing Notice

### 04 - Final Disclosures & Delivery
Required disclosures:
- Confirmation Real Estate Agency Relationships
- Estimated Buyer Costs
- Possible Representation Disclosure
- Wire Fraud Advisory

### 05 - Forms Used in Specific Situations
Situational forms:
- Buyer Pre-Occupancy Storage Addendum
- Buyer Representation Agreement
- Manufactured Home Purchase Addendum
- Notice to Buyer to Perform
- Statewide Buyer and Seller Advisory

### 06 - Listing Stage
Listing-related documents:
- Residential Listing Agreement
- Agent Visual Inspection Disclosure
- Estimated Seller Proceeds
- Lead Based Paint Hazards Disclosure
- Real Estate Transfer Disclosure
- Seller Instructions to Exclude
- Seller Property Questionnaire
- Statewide Advisory

## Implementation Guide

To implement a new form:

1. **Obtain Official Form**: Get the latest version from C.A.R.
2. **Convert to HTML**: Maintain exact layout and styling
3. **Update template.html**: Replace placeholder with actual form
4. **Define fields.json**: Map all input fields with proper types
5. **Map signatures**: Define all signature/initial locations
6. **Update metadata**: Set implemented flags to true
7. **Test thoroughly**: Verify data merge and PDF generation
8. **Update registry**: Set implemented: true in index.ts

## Technical Notes

- Templates use Handlebars for variable substitution
- All measurements are in pixels at 72 DPI
- Signature coordinates are relative to page top-left
- Field names must be unique across the template
- Use semantic HTML5 elements where possible

## File Structure Per Form

Each form directory contains:
- `template.html` - The HTML template for the form
- `fields.json` - Field definitions and validation rules
- `signature-fields.json` - Signature and initial placement coordinates
- `metadata.json` - Form metadata and version information

## Usage Example

```typescript
import { TEMPLATE_REGISTRY, getFormById } from '@/templates';

// Get a specific form
const rpaForm = getFormById('CA_RPA');

// Check if form is available
if (rpaForm?.implemented) {
  // Load and use the form
}

// Get all forms in a category
const buyerForms = getFormsByCategory('01');
```

## Contributing

When adding new forms:
1. Follow the existing naming conventions
2. Update the registry in `index.ts`
3. Test with sample data before marking as implemented
4. Document any special requirements in metadata.json