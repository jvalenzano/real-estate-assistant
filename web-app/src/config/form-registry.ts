/**
 * Form registry configuration
 * Quick access to commonly used forms and their configurations
 */

import { TEMPLATE_REGISTRY } from '@/templates';

export interface FormQuickAccess {
  templateId: string;
  name: string;
  icon: string;
  color: string;
  shortcut?: string;
  description: string;
}

// Most commonly used forms for quick access
export const QUICK_ACCESS_FORMS: FormQuickAccess[] = [
  {
    templateId: 'CA_RPA',
    name: 'Purchase Agreement',
    icon: 'document-text',
    color: 'blue',
    shortcut: 'RPA',
    description: 'California Residential Purchase Agreement'
  },
  {
    templateId: 'BUYER_COUNTER_OFFER',
    name: 'Counter Offer',
    icon: 'arrows-expand',
    color: 'orange',
    shortcut: 'CO',
    description: 'Buyer Counter Offer'
  },
  {
    templateId: 'ADDENDUM_1',
    name: 'Addendum',
    icon: 'document-add',
    color: 'green',
    shortcut: 'ADD',
    description: 'General Addendum'
  },
  {
    templateId: 'REQUEST_FOR_REPAIR',
    name: 'Repair Request',
    icon: 'wrench',
    color: 'yellow',
    shortcut: 'RFR',
    description: 'Request for Repairs'
  },
  {
    templateId: 'BUYER_CONTINGENCY_REMOVAL',
    name: 'Remove Contingencies',
    icon: 'shield-check',
    color: 'purple',
    shortcut: 'BCR',
    description: 'Buyer Contingency Removal'
  },
  {
    templateId: 'RESIDENTIAL_LISTING',
    name: 'Listing Agreement',
    icon: 'home',
    color: 'red',
    shortcut: 'RLA',
    description: 'Residential Listing Agreement'
  }
];

// Form bundles for common scenarios
export const FORM_BUNDLES = {
  BUYER_OFFER_PACKAGE: {
    name: 'Complete Buyer Offer Package',
    description: 'All forms needed for a standard buyer offer',
    forms: [
      'CA_RPA',
      'BUYER_INVESTIGATION',
      'CONFIRMATION_AGENCY',
      'STATEWIDE_ADVISORY'
    ],
    requiredForms: ['CA_RPA'],
    optionalForms: ['LEAD_BASED_PAINT', 'ADDENDUM_1']
  },
  LISTING_PACKAGE: {
    name: 'Complete Listing Package',
    description: 'All forms needed to list a property',
    forms: [
      'RESIDENTIAL_LISTING',
      'SELLER_PROPERTY_QUESTIONNAIRE',
      'REAL_ESTATE_TRANSFER',
      'AGENT_VISUAL_INSPECTION'
    ],
    requiredForms: ['RESIDENTIAL_LISTING', 'REAL_ESTATE_TRANSFER'],
    optionalForms: ['LEAD_PAINT_DISCLOSURE', 'SELLER_INSTRUCTIONS']
  },
  COUNTER_OFFER_PACKAGE: {
    name: 'Counter Offer Package',
    description: 'Forms for negotiating counter offers',
    forms: [
      'BUYER_COUNTER_OFFER',
      'SELLER_COUNTER_OFFER',
      'SELLER_RESPONSE_BUYER'
    ],
    requiredForms: [],
    optionalForms: ['ADDENDUM_1']
  },
  CONTINGENCY_REMOVAL_PACKAGE: {
    name: 'Contingency Removal Package',
    description: 'Forms for removing contingencies',
    forms: [
      'BUYER_CONTINGENCY_REMOVAL',
      'VERIFICATION_PROPERTY',
      'RECEIPT_FOR_REPORTS'
    ],
    requiredForms: ['BUYER_CONTINGENCY_REMOVAL'],
    optionalForms: []
  },
  DISCLOSURE_PACKAGE: {
    name: 'Standard Disclosure Package',
    description: 'Common disclosure forms',
    forms: [
      'DISCLOSURE_INFO_ADVISORY',
      'CONFIRMATION_AGENCY',
      'WIRE_FRAUD_ADVISORY',
      'STATEWIDE_ADVISORY'
    ],
    requiredForms: ['CONFIRMATION_AGENCY'],
    optionalForms: ['POSSIBLE_REPRESENTATION']
  }
};

// Form workflow definitions
export const FORM_WORKFLOWS = {
  STANDARD_PURCHASE: {
    name: 'Standard Purchase Transaction',
    steps: [
      {
        name: 'Initial Offer',
        forms: ['CA_RPA', 'BUYER_INVESTIGATION', 'CONFIRMATION_AGENCY'],
        required: true
      },
      {
        name: 'Disclosures',
        forms: ['REAL_ESTATE_TRANSFER', 'LEAD_BASED_PAINT', 'STATEWIDE_ADVISORY'],
        required: true
      },
      {
        name: 'Negotiations',
        forms: ['BUYER_COUNTER_OFFER', 'SELLER_COUNTER_OFFER', 'ADDENDUM_1'],
        required: false
      },
      {
        name: 'Inspections',
        forms: ['REQUEST_FOR_REPAIR', 'SELLER_RESPONSE_BUYER'],
        required: false
      },
      {
        name: 'Contingency Removal',
        forms: ['BUYER_CONTINGENCY_REMOVAL', 'VERIFICATION_PROPERTY'],
        required: true
      },
      {
        name: 'Closing',
        forms: ['DEMAND_TO_CLOSE', 'ESTIMATED_BUYER_COSTS'],
        required: false
      }
    ]
  }
};

// Form validation rules by template
export const FORM_VALIDATION_RULES = {
  CA_RPA: {
    propertyAddress: { required: true },
    purchasePrice: { required: true, min: 0 },
    earnestMoneyDeposit: { required: true, min: 0 },
    buyerName: { required: true },
    sellerName: { required: true },
    closingDate: { required: true }
  },
  RESIDENTIAL_LISTING: {
    propertyAddress: { required: true },
    listPrice: { required: true, min: 0 },
    commissionRate: { required: true, min: 0, max: 100 },
    listingPeriod: { required: true, min: 1, max: 365 },
    sellerName: { required: true }
  }
};

// Get forms by transaction stage
export function getFormsByStage(stage: string): string[] {
  const workflow = FORM_WORKFLOWS.STANDARD_PURCHASE;
  const step = workflow.steps.find(s => s.name.toLowerCase().includes(stage.toLowerCase()));
  return step ? step.forms : [];
}

// Get required forms for a transaction type
export function getRequiredForms(transactionType: string): string[] {
  switch (transactionType) {
    case 'purchase':
      return ['CA_RPA', 'CONFIRMATION_AGENCY'];
    case 'listing':
      return ['RESIDENTIAL_LISTING', 'REAL_ESTATE_TRANSFER'];
    default:
      return [];
  }
}

// Check if all required forms are completed
export function checkRequiredFormsCompleted(
  completedForms: string[],
  transactionType: string
): { complete: boolean; missing: string[] } {
  const required = getRequiredForms(transactionType);
  const missing = required.filter(form => !completedForms.includes(form));
  
  return {
    complete: missing.length === 0,
    missing
  };
}