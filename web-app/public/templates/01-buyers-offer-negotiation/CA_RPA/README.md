# California Residential Purchase Agreement (CA_RPA)

## Overview
The California Residential Purchase Agreement and Joint Escrow Instructions (C.A.R. Form RPA-CA) is the primary contract used for residential real estate purchases in California.

## Template Structure

### Files
- `template.hbs` - Handlebars template for generating the HTML/PDF document
- `fields.json` - Field definitions and validation rules
- `signatures.json` - Signature placement and requirements
- `metadata.json` - Template metadata and configuration

### Sections
1. **Buyer Information** - Buyer details and contact information
2. **Property Information** - Property address and parcel details
3. **Financial Terms** - Purchase price, deposits, and loan information
4. **Closing Terms** - Closing date and occupancy details
5. **Seller Information** - Seller details and contact information
6. **Agency Information** - Real estate agent and broker details
7. **Contingencies** - Inspection, loan, and appraisal contingencies
8. **Title and Vesting** - How title will be held

### Key Features
- Dynamic field rendering based on selections (e.g., loan type)
- Conditional sections (e.g., co-buyer fields)
- Automatic calculations (e.g., down payment percentage)
- Multi-page layout with proper page breaks
- Signature blocks for all parties

## Usage

### Generating a Document
```javascript
const templateService = new TemplateService();
const html = await templateService.renderTemplate('CA_RPA', {
  buyerName: 'John Doe',
  propertyAddress: '123 Main St',
  purchasePrice: 750000,
  // ... other fields
});
```

### Required Fields
The following fields must be provided:
- Buyer name and contact information
- Property address
- Purchase price
- Initial deposit amount
- Down payment
- Loan amount and type
- Closing date
- Seller name and contact information
- Agent information

### Signature Requirements
- All buyers must sign
- All sellers must sign (acceptance)
- Both listing and selling agents must sign

## Customization

### Modifying the Template
Edit `template.hbs` to change the layout or add custom content. The template uses Handlebars syntax with helpers for formatting.

### Adding Fields
1. Add field definition to `fields.json`
2. Update `template.hbs` to display the field
3. Add any validation rules
4. Update signature positions if needed

### Styling
The template includes embedded CSS for consistent formatting. Modify the `<style>` section in `template.hbs` to change appearance.

## Legal Disclaimer
This form has been approved by the California Association of REALTORS®. No representation is made as to the legal validity or accuracy of any provision in any specific transaction. Consult appropriate professionals for legal and tax advice.