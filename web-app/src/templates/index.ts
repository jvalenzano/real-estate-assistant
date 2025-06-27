/**
 * Central registry for all California real estate form templates
 * Maps form IDs to their locations, metadata, and implementation status
 */

export interface TemplateRegistryEntry {
  id: string;
  name: string;
  fileName: string;  // Original filename from blank forms
  category: string;
  categoryNumber: string;  // '01' through '06'
  path: string;
  implemented: boolean;
  commonlyUsed: boolean;
  sortOrder: number;
  carFormNumber?: string;  // C.A.R. form number if applicable
}

export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  // Category 01: Buyer's Offer and Negotiation Stage
  'CA_RPA': {
    id: 'CA_RPA',
    name: 'California Residential Purchase Agreement',
    fileName: 'California_Residential_Purchase_Agreement___12_24.pdf',
    category: 'buyers-offer',
    categoryNumber: '01',
    path: '01-buyers-offer/CA_RPA',
    implemented: true,  // PRIMARY IMPLEMENTATION
    commonlyUsed: true,
    sortOrder: 101,
    carFormNumber: 'RPA 12/24'
  },
  'ADDENDUM_1': {
    id: 'ADDENDUM_1',
    name: 'Addendum No #1',
    fileName: 'Addendum No #1 - 12_21.pdf',
    category: 'buyers-offer',
    categoryNumber: '01',
    path: '01-buyers-offer/addendum-1',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 102
  },
  'BUYER_EARLY_OCCUPANCY': {
    id: 'BUYER_EARLY_OCCUPANCY',
    name: 'Buyer Early Occupancy Addendum',
    fileName: 'Buyer_Early_Occupancy_Addendum___12_21.pdf',
    category: 'buyers-offer',
    categoryNumber: '01',
    path: '01-buyers-offer/buyer-early-occupancy',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 103
  },
  'BUYER_INVESTIGATION': {
    id: 'BUYER_INVESTIGATION',
    name: 'Buyer\'s Investigation Advisory',
    fileName: 'Buyer_s_Investigation_Advisory___6_23.pdf',
    category: 'buyers-offer',
    categoryNumber: '01',
    path: '01-buyers-offer/buyer-investigation',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 104
  },
  'INTERIM_OCCUPANCY': {
    id: 'INTERIM_OCCUPANCY',
    name: 'Interim Occupancy Agreement',
    fileName: 'Interim_Occupancy_Agreement___12_19.pdf',
    category: 'buyers-offer',
    categoryNumber: '01',
    path: '01-buyers-offer/interim-occupancy',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 105
  },
  'LEAD_BASED_PAINT': {
    id: 'LEAD_BASED_PAINT',
    name: 'Lead Based Paint Disclosure',
    fileName: 'Lead_Based_Paint_Disclosure___12_22.pdf',
    category: 'buyers-offer',
    categoryNumber: '01',
    path: '01-buyers-offer/lead-based-paint',
    carFormNumber: 'FLD',
    implemented: true,
    commonlyUsed: true,
    sortOrder: 106
  },
  'REQUEST_FOR_REPAIR': {
    id: 'REQUEST_FOR_REPAIR',
    name: 'Request for Repair',
    fileName: 'Request_for_Repair___6_24.pdf',
    category: 'buyers-offer',
    categoryNumber: '01',
    path: '01-buyers-offer/request-for-repair',
    implemented: true,
    commonlyUsed: true,
    sortOrder: 107,
    carFormNumber: 'RR 6/24'
  },
  'SELLER_LICENSE_REMAIN': {
    id: 'SELLER_LICENSE_REMAIN',
    name: 'Seller License to Remain in Possession',
    fileName: 'Seller_License_to_Remain_in_Possession_After_Close_of_Escrow___12_19.pdf',
    category: 'buyers-offer',
    categoryNumber: '01',
    path: '01-buyers-offer/seller-license-remain',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 108
  },
  
  // Category 02: Contingency Removal and Closing
  'BUYER_CONTINGENCY_REMOVAL': {
    id: 'BUYER_CONTINGENCY_REMOVAL',
    name: 'Buyer Contingency Removal #1',
    fileName: 'Buyer Contingency Removal #1 - 6_24.pdf',
    category: 'contingency-removal',
    categoryNumber: '02',
    path: '02-contingency-removal/buyer-contingency-removal',
    carFormNumber: 'CR',
    implemented: true,
    commonlyUsed: true,
    sortOrder: 201
  },
  'DEMAND_TO_CLOSE': {
    id: 'DEMAND_TO_CLOSE',
    name: 'Demand to Close Escrow',
    fileName: 'Demand_to_Close_Escrow___12_21.pdf',
    category: 'contingency-removal',
    categoryNumber: '02',
    path: '02-contingency-removal/demand-to-close',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 202
  },
  'NOTICE_TO_BUYER': {
    id: 'NOTICE_TO_BUYER',
    name: 'Notice to Buyer to Perform',
    fileName: 'Notice_to_Buyer_to_Perform___12_21.pdf',
    category: 'contingency-removal',
    categoryNumber: '02',
    path: '02-contingency-removal/notice-to-buyer',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 203
  },
  'RECEIPT_FOR_REPORTS': {
    id: 'RECEIPT_FOR_REPORTS',
    name: 'Receipt for Reports',
    fileName: 'Receipt_for_Reports___12_15.pdf',
    category: 'contingency-removal',
    categoryNumber: '02',
    path: '02-contingency-removal/receipt-for-reports',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 204
  },
  'VERIFICATION_PROPERTY': {
    id: 'VERIFICATION_PROPERTY',
    name: 'Verification of Property Condition',
    fileName: 'Verification_of_Property_Condition___12_21.pdf',
    category: 'contingency-removal',
    categoryNumber: '02',
    path: '02-contingency-removal/verification-property',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 205
  },
  
  // Category 03: Escrow and Contingency Stage
  'BUYER_COUNTER_OFFER': {
    id: 'BUYER_COUNTER_OFFER',
    name: 'Buyer Counter Offer #1',
    fileName: 'Buyer Counter Offer #1 - 12_24.pdf',
    category: 'escrow-contingency',
    categoryNumber: '03',
    path: '03-escrow-contingency/buyer-counter-offer',
    implemented: true,
    commonlyUsed: true,
    sortOrder: 301,
    carFormNumber: 'BCO 12/24'
  },
  'DISCLOSURE_INFO_ADVISORY': {
    id: 'DISCLOSURE_INFO_ADVISORY',
    name: 'Disclosure Information Advisory',
    fileName: 'Disclosure_Information_Advisory___6_18.pdf',
    category: 'escrow-contingency',
    categoryNumber: '03',
    path: '03-escrow-contingency/disclosure-info-advisory',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 302
  },
  'SELLER_COUNTER_OFFER': {
    id: 'SELLER_COUNTER_OFFER',
    name: 'Seller Counter Offer #1',
    fileName: 'Seller Counter Offer #1 - 12_24.pdf',
    category: 'escrow-contingency',
    categoryNumber: '03',
    path: '03-escrow-contingency/seller-counter-offer',
    implemented: true,
    commonlyUsed: true,
    sortOrder: 303,
    carFormNumber: 'SCO 12/24'
  },
  'SELLER_RESPONSE_BUYER': {
    id: 'SELLER_RESPONSE_BUYER',
    name: 'Seller Response and Buyer Reply',
    fileName: 'Seller_Response_and_Buyer_Reply___12_21.pdf',
    category: 'escrow-contingency',
    categoryNumber: '03',
    path: '03-escrow-contingency/seller-response-buyer',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 304
  },
  'TENANCY_IN_COMMON': {
    id: 'TENANCY_IN_COMMON',
    name: 'Tenancy In Common Advisory',
    fileName: 'Tenancy_In_Common_Advisory___12_20.pdf',
    category: 'escrow-contingency',
    categoryNumber: '03',
    path: '03-escrow-contingency/tenancy-in-common',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 305
  },
  'WATER_CONSERVING': {
    id: 'WATER_CONSERVING',
    name: 'Water-Conserving Plumbing Notice',
    fileName: 'Water_Conserving_Plumbing_Fixtures_and_Carbon_Monoxide_Detector_Notice___12_22.pdf',
    category: 'escrow-contingency',
    categoryNumber: '03',
    path: '03-escrow-contingency/water-conserving',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 306
  },
  
  // Category 04: Final Disclosures & Delivery
  'CONFIRMATION_AGENCY': {
    id: 'CONFIRMATION_AGENCY',
    name: 'Confirmation Real Estate Agency Relationships',
    fileName: 'Confirmation Real Estate Agency Relationships - 12_21.pdf',
    category: 'final-disclosures',
    categoryNumber: '04',
    path: '04-final-disclosures/confirmation-agency',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 401
  },
  'ESTIMATED_BUYER_COSTS': {
    id: 'ESTIMATED_BUYER_COSTS',
    name: 'Estimated Buyer Costs',
    fileName: 'Estimated_Buyer_Costs___6_21.pdf',
    category: 'final-disclosures',
    categoryNumber: '04',
    path: '04-final-disclosures/estimated-buyer-costs',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 402
  },
  'POSSIBLE_REPRESENTATION': {
    id: 'POSSIBLE_REPRESENTATION',
    name: 'Possible Representation Disclosure',
    fileName: 'Possible_Representation_of_More_Than_One_Buyer_or_Seller___12_23.pdf',
    category: 'final-disclosures',
    categoryNumber: '04',
    path: '04-final-disclosures/possible-representation',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 403
  },
  'WIRE_FRAUD_ADVISORY': {
    id: 'WIRE_FRAUD_ADVISORY',
    name: 'Wire Fraud Advisory',
    fileName: 'Wire_Fraud_Advisory___6_24.pdf',
    category: 'final-disclosures',
    categoryNumber: '04',
    path: '04-final-disclosures/wire-fraud-advisory',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 404
  },
  
  // Category 05: Forms Used in Specific Situations
  'BUYER_PRE_OCCUPANCY': {
    id: 'BUYER_PRE_OCCUPANCY',
    name: 'Buyer Pre-Occupancy Storage Addendum',
    fileName: 'Buyer Pre-Occupancy Storage Addendum - 12_21.pdf',
    category: 'specific-situations',
    categoryNumber: '05',
    path: '05-specific-situations/buyer-pre-occupancy',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 501
  },
  'BUYER_REPRESENTATION': {
    id: 'BUYER_REPRESENTATION',
    name: 'Buyer Representation Agreement',
    fileName: 'Buyer_Representation_Agreement___Non_Exclusive___11_24.pdf',
    category: 'specific-situations',
    categoryNumber: '05',
    path: '05-specific-situations/buyer-representation',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 502
  },
  'MANUFACTURED_HOME': {
    id: 'MANUFACTURED_HOME',
    name: 'Manufactured Home Purchase Addendum',
    fileName: 'Manufactured_Home_Purchase_Addendum___12_21.pdf',
    category: 'specific-situations',
    categoryNumber: '05',
    path: '05-specific-situations/manufactured-home',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 503
  },
  'NOTICE_TO_BUYER_PERFORM_2': {
    id: 'NOTICE_TO_BUYER_PERFORM_2',
    name: 'Notice to Buyer to Perform',
    fileName: 'Notice_to_Buyer_to_Perform___12_21 (1).pdf',
    category: 'specific-situations',
    categoryNumber: '05',
    path: '05-specific-situations/notice-to-buyer-perform',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 504
  },
  'STATEWIDE_ADVISORY': {
    id: 'STATEWIDE_ADVISORY',
    name: 'Statewide Buyer and Seller Advisory',
    fileName: 'Statewide_Buyer_and_Seller_Advisory___7_24.pdf',
    category: 'specific-situations',
    categoryNumber: '05',
    path: '05-specific-situations/statewide-advisory',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 505
  },
  
  // Category 06: Listing Stage
  'RESIDENTIAL_LISTING': {
    id: 'RESIDENTIAL_LISTING',
    name: 'Residential Listing Agreement - Exclusive',
    fileName: '_Residential_Listing_Agreement___Exclusive___12_24 (4).pdf',
    category: 'listing-stage',
    categoryNumber: '06',
    path: '06-listing-stage/residential-listing',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 601
  },
  'AGENT_VISUAL_INSPECTION': {
    id: 'AGENT_VISUAL_INSPECTION',
    name: 'Agent Visual Inspection Disclosure',
    fileName: 'Agent_Visual_Inspection_Disclosure___12_22.pdf',
    category: 'listing-stage',
    categoryNumber: '06',
    path: '06-listing-stage/agent-visual-inspection',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 602
  },
  'ESTIMATED_SELLER': {
    id: 'ESTIMATED_SELLER',
    name: 'Estimated Seller Proceeds',
    fileName: 'Estimated_Seller_Proceeds___12_21.pdf',
    category: 'listing-stage',
    categoryNumber: '06',
    path: '06-listing-stage/estimated-seller',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 603
  },
  'LEAD_PAINT_DISCLOSURE': {
    id: 'LEAD_PAINT_DISCLOSURE',
    name: 'Lead Based Paint Hazards Disclosure',
    fileName: 'Lead_Based_Paint_Hazards_Disclosure__Acknowledgement__and_Addendum___12_21.pdf',
    category: 'listing-stage',
    categoryNumber: '06',
    path: '06-listing-stage/lead-paint-disclosure',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 604
  },
  'REAL_ESTATE_TRANSFER': {
    id: 'REAL_ESTATE_TRANSFER',
    name: 'Real Estate Transfer Disclosure',
    fileName: 'Real_Estate_Transfer_Disclosure___1_22.pdf',
    category: 'listing-stage',
    categoryNumber: '06',
    path: '06-listing-stage/real-estate-transfer',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 605
  },
  'SELLER_INSTRUCTIONS': {
    id: 'SELLER_INSTRUCTIONS',
    name: 'Seller Instructions to Exclude',
    fileName: 'Seller_s_Instructions_to_Exclude_Listing_from_MLS___12_20.pdf',
    category: 'listing-stage',
    categoryNumber: '06',
    path: '06-listing-stage/seller-instructions',
    implemented: false,
    commonlyUsed: false,
    sortOrder: 606
  },
  'SELLER_PROPERTY_QUESTIONNAIRE': {
    id: 'SELLER_PROPERTY_QUESTIONNAIRE',
    name: 'Seller Property Questionnaire',
    fileName: 'Seller_Property_Questionnaire___12_23.pdf',
    category: 'listing-stage',
    categoryNumber: '06',
    path: '06-listing-stage/seller-property-questionnaire',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 607
  },
  'STATEWIDE_ADVISORY_LISTING': {
    id: 'STATEWIDE_ADVISORY_LISTING',
    name: 'Statewide Advisory',
    fileName: 'Statewide_Buyer_and_Seller_Advisory___7_24 (1).pdf',
    category: 'listing-stage',
    categoryNumber: '06',
    path: '06-listing-stage/statewide-advisory',
    implemented: false,
    commonlyUsed: true,
    sortOrder: 608
  }
};

// Helper functions
export function getFormsByCategory(categoryNumber: string): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY)
    .filter(template => template.categoryNumber === categoryNumber)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getImplementedForms(): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY)
    .filter(template => template.implemented)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCommonlyUsedForms(): TemplateRegistryEntry[] {
  return Object.values(TEMPLATE_REGISTRY)
    .filter(template => template.commonlyUsed)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFormById(templateId: string): TemplateRegistryEntry | undefined {
  return TEMPLATE_REGISTRY[templateId];
}

export const CATEGORY_NAMES = {
  '01': 'Buyer\'s Offer and Negotiation Stage',
  '02': 'Contingency Removal and Closing',
  '03': 'Escrow and Contingency Stage',
  '04': 'Final Disclosures & Delivery',
  '05': 'Forms Used in Specific Situations',
  '06': 'Listing Stage'
};

// Register helpers for Handlebars templates
export function registerTemplateHelpers() {
  // Currency formatter
  if (typeof window !== 'undefined' && (window as any).Handlebars) {
    const Handlebars = (window as any).Handlebars;
    
    Handlebars.registerHelper('formatCurrency', function(amount: number) {
      if (!amount) return '0.00';
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    });
    
    Handlebars.registerHelper('formatDate', function(date: string) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US');
    });
    
    Handlebars.registerHelper('eq', function(a: any, b: any) {
      return a === b;
    });
    
    Handlebars.registerHelper('not', function(value: any) {
      return !value;
    });
  }
}