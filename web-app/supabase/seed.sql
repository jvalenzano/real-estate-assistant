-- Seed data for document templates
-- Based on the 50+ California real estate forms

-- Clear existing data (if any)
TRUNCATE TABLE document_templates CASCADE;

-- Insert all document templates
INSERT INTO document_templates (template_code, name, description, category, category_number, file_name, car_form_number, is_active, is_commonly_used, sort_order, fields_schema, signatures_schema) VALUES

-- Category 01: Buyer's Offer and Negotiation Stage
('CA_RPA', 'California Residential Purchase Agreement', 'The primary contract for residential real estate transactions in California', 'buyers-offer', '01', 'California_Residential_Purchase_Agreement___12_24.pdf', 'RPA 12/24', true, true, 101, 
'{"buyer_info": {"type": "object"}, "seller_info": {"type": "object"}, "property_info": {"type": "object"}, "price_terms": {"type": "object"}, "financing_terms": {"type": "object"}, "contingencies": {"type": "object"}, "escrow_info": {"type": "object"}, "closing_info": {"type": "object"}}',
'[{"id": "buyer_signature", "type": "buyer", "required": true}, {"id": "seller_signature", "type": "seller", "required": true}, {"id": "buyer_agent_signature", "type": "agent", "required": false}, {"id": "seller_agent_signature", "type": "agent", "required": false}]'),

('ADDENDUM_1', 'Addendum No #1', 'General purpose addendum for additional terms and conditions', 'buyers-offer', '01', 'Addendum No #1 - 12_21.pdf', 'ADM 12/21', true, true, 102, '{}', '[]'),

('BUYER_EARLY_OCCUPANCY', 'Buyer Early Occupancy Addendum', 'Allows buyer to occupy property before close of escrow', 'buyers-offer', '01', 'Buyer_Early_Occupancy_Addendum___12_21.pdf', 'BEO 12/21', true, false, 103, '{}', '[]'),

('BUYER_INVESTIGATION', 'Buyer''s Investigation Advisory', 'Advises buyers about property investigation rights and responsibilities', 'buyers-offer', '01', 'Buyer_s_Investigation_Advisory___6_23.pdf', 'BIA 6/23', true, true, 104, '{}', '[]'),

('INTERIM_OCCUPANCY', 'Interim Occupancy Agreement', 'For temporary occupancy between signing and closing', 'buyers-offer', '01', 'Interim_Occupancy_Agreement___12_19.pdf', 'IOA 12/19', true, false, 105, '{}', '[]'),

('LEAD_BASED_PAINT', 'Lead Based Paint Disclosure', 'Federal requirement for properties built before 1978', 'buyers-offer', '01', 'Lead_Based_Paint_Disclosure___12_22.pdf', 'FLD 12/22', true, true, 106, '{}', '[]'),

('REQUEST_FOR_REPAIR', 'Request for Repair', 'Buyer''s request for repairs after inspections', 'buyers-offer', '01', 'Request_for_Repair___6_24.pdf', 'RR 6/24', true, true, 107, '{}', '[]'),

('SELLER_LICENSE_REMAIN', 'Seller License to Remain in Possession', 'Allows seller to stay in property after close', 'buyers-offer', '01', 'Seller_License_to_Remain_in_Possession_After_Close_of_Escrow___12_19.pdf', 'SLRP 12/19', true, false, 108, '{}', '[]'),

-- Category 02: Contingency Removal and Closing
('BUYER_CONTINGENCY_REMOVAL', 'Buyer Contingency Removal #1', 'Form for buyer to remove contingencies', 'contingency-removal', '02', 'Buyer Contingency Removal #1 - 6_24.pdf', 'CR 6/24', true, true, 201, '{}', '[]'),

('DEMAND_TO_CLOSE', 'Demand to Close Escrow', 'Notice demanding close of escrow by specific date', 'contingency-removal', '02', 'Demand_to_Close_Escrow___12_21.pdf', 'DCE 12/21', true, false, 202, '{}', '[]'),

('NOTICE_TO_BUYER', 'Notice to Buyer to Perform', 'Seller notice to buyer to remove contingencies', 'contingency-removal', '02', 'Notice_to_Buyer_to_Perform___12_21.pdf', 'NBP 12/21', true, true, 203, '{}', '[]'),

('RECEIPT_FOR_REPORTS', 'Receipt for Reports', 'Acknowledgment of receipt of inspection reports', 'contingency-removal', '02', 'Receipt_for_Reports___12_15.pdf', 'RFR 12/15', true, false, 204, '{}', '[]'),

('VERIFICATION_PROPERTY', 'Verification of Property Condition', 'Final walkthrough verification form', 'contingency-removal', '02', 'Verification_of_Property_Condition___12_21.pdf', 'VPC 12/21', true, false, 205, '{}', '[]'),

-- Category 03: Escrow and Contingency Stage
('BUYER_COUNTER_OFFER', 'Buyer Counter Offer #1', 'Buyer''s counter offer to seller''s terms', 'escrow-contingency', '03', 'Buyer Counter Offer #1 - 12_24.pdf', 'BCO 12/24', true, true, 301, '{}', '[]'),

('DISCLOSURE_INFO_ADVISORY', 'Disclosure Information Advisory', 'Advisory about disclosure requirements', 'escrow-contingency', '03', 'Disclosure_Information_Advisory___6_18.pdf', 'DIA 6/18', true, true, 302, '{}', '[]'),

('SELLER_COUNTER_OFFER', 'Seller Counter Offer #1', 'Seller''s counter offer to buyer''s terms', 'escrow-contingency', '03', 'Seller Counter Offer #1 - 12_24.pdf', 'SCO 12/24', true, true, 303, '{}', '[]'),

('SELLER_RESPONSE_BUYER', 'Seller Response and Buyer Reply', 'Form for negotiating inspection items', 'escrow-contingency', '03', 'Seller_Response_and_Buyer_Reply___12_21.pdf', 'SRBR 12/21', true, false, 304, '{}', '[]'),

('TENANCY_IN_COMMON', 'Tenancy In Common Advisory', 'Advisory about TIC ownership', 'escrow-contingency', '03', 'Tenancy_In_Common_Advisory___12_20.pdf', 'TIC 12/20', true, false, 305, '{}', '[]'),

('WATER_CONSERVING', 'Water-Conserving Plumbing Notice', 'Disclosure about water conservation requirements', 'escrow-contingency', '03', 'Water_Conserving_Plumbing_Fixtures_and_Carbon_Monoxide_Detector_Notice___12_22.pdf', 'WCN 12/22', true, false, 306, '{}', '[]'),

-- Category 04: Final Disclosures & Delivery
('CONFIRMATION_AGENCY', 'Confirmation Real Estate Agency Relationships', 'Confirms agency relationships in transaction', 'final-disclosures', '04', 'Confirmation Real Estate Agency Relationships - 12_21.pdf', 'AC 12/21', true, true, 401, '{}', '[]'),

('ESTIMATED_BUYER_COSTS', 'Estimated Buyer Costs', 'Worksheet for estimating buyer''s closing costs', 'final-disclosures', '04', 'Estimated_Buyer_Costs___6_21.pdf', 'EBC 6/21', true, true, 402, '{}', '[]'),

('POSSIBLE_REPRESENTATION', 'Possible Representation Disclosure', 'Disclosure of possible dual agency', 'final-disclosures', '04', 'Possible_Representation_of_More_Than_One_Buyer_or_Seller___12_23.pdf', 'PRD 12/23', true, false, 403, '{}', '[]'),

('WIRE_FRAUD_ADVISORY', 'Wire Fraud Advisory', 'Warning about wire fraud in real estate', 'final-disclosures', '04', 'Wire_Fraud_Advisory___6_24.pdf', 'WFA 6/24', true, true, 404, '{}', '[]'),

-- Category 05: Forms Used in Specific Situations
('BUYER_PRE_OCCUPANCY', 'Buyer Pre-Occupancy Storage Addendum', 'Allows buyer to store items before closing', 'specific-situations', '05', 'Buyer Pre-Occupancy Storage Addendum - 12_21.pdf', 'BPSA 12/21', true, false, 501, '{}', '[]'),

('BUYER_REPRESENTATION', 'Buyer Representation Agreement', 'Agreement between buyer and agent', 'specific-situations', '05', 'Buyer_Representation_Agreement___Non_Exclusive___11_24.pdf', 'BRE 11/24', true, true, 502, '{}', '[]'),

('MANUFACTURED_HOME', 'Manufactured Home Purchase Addendum', 'Addendum for manufactured home purchases', 'specific-situations', '05', 'Manufactured_Home_Purchase_Addendum___12_21.pdf', 'MHA 12/21', true, false, 503, '{}', '[]'),

('NOTICE_TO_BUYER_PERFORM_2', 'Notice to Buyer to Perform', 'Alternative notice form', 'specific-situations', '05', 'Notice_to_Buyer_to_Perform___12_21 (1).pdf', 'NBP2 12/21', true, false, 504, '{}', '[]'),

('STATEWIDE_ADVISORY', 'Statewide Buyer and Seller Advisory', 'Comprehensive advisory for all parties', 'specific-situations', '05', 'Statewide_Buyer_and_Seller_Advisory___7_24.pdf', 'SBSA 7/24', true, true, 505, '{}', '[]'),

-- Category 06: Listing Stage
('RESIDENTIAL_LISTING', 'Residential Listing Agreement - Exclusive', 'Exclusive listing agreement between seller and agent', 'listing-stage', '06', '_Residential_Listing_Agreement___Exclusive___12_24 (4).pdf', 'RLA 12/24', true, true, 601, '{}', '[]'),

('AGENT_VISUAL_INSPECTION', 'Agent Visual Inspection Disclosure', 'Agent''s visual inspection findings', 'listing-stage', '06', 'Agent_Visual_Inspection_Disclosure___12_22.pdf', 'AVID 12/22', true, true, 602, '{}', '[]'),

('ESTIMATED_SELLER', 'Estimated Seller Proceeds', 'Worksheet for estimating seller''s net proceeds', 'listing-stage', '06', 'Estimated_Seller_Proceeds___12_21.pdf', 'ESP 12/21', true, true, 603, '{}', '[]'),

('LEAD_PAINT_DISCLOSURE', 'Lead Based Paint Hazards Disclosure', 'Lead paint disclosure for sellers', 'listing-stage', '06', 'Lead_Based_Paint_Hazards_Disclosure__Acknowledgement__and_Addendum___12_21.pdf', 'LPD 12/21', true, true, 604, '{}', '[]'),

('REAL_ESTATE_TRANSFER', 'Real Estate Transfer Disclosure', 'Seller''s property condition disclosure', 'listing-stage', '06', 'Real_Estate_Transfer_Disclosure___1_22.pdf', 'TDS 1/22', true, true, 605, '{}', '[]'),

('SELLER_INSTRUCTIONS', 'Seller Instructions to Exclude', 'Instructions to exclude listing from MLS', 'listing-stage', '06', 'Seller_s_Instructions_to_Exclude_Listing_from_MLS___12_20.pdf', 'SEL 12/20', true, false, 606, '{}', '[]'),

('SELLER_PROPERTY_QUESTIONNAIRE', 'Seller Property Questionnaire', 'Detailed property condition questionnaire', 'listing-stage', '06', 'Seller_Property_Questionnaire___12_23.pdf', 'SPQ 12/23', true, true, 607, '{}', '[]'),

('STATEWIDE_ADVISORY_LISTING', 'Statewide Advisory', 'Statewide advisory for listing stage', 'listing-stage', '06', 'Statewide_Buyer_and_Seller_Advisory___7_24 (1).pdf', 'SBSA2 7/24', true, true, 608, '{}', '[]');

-- Update the CA_RPA template with full field schema
UPDATE document_templates 
SET fields_schema = '{
  "property": {
    "address": {"type": "string", "required": true},
    "city": {"type": "string", "required": true},
    "county": {"type": "string", "required": true},
    "zipCode": {"type": "string", "required": true},
    "apn": {"type": "string", "required": false},
    "legalDescription": {"type": "string", "required": false}
  },
  "price": {
    "purchasePrice": {"type": "number", "required": true},
    "initialDeposit": {"type": "number", "required": true},
    "increasedDeposit": {"type": "number", "required": false},
    "downPayment": {"type": "number", "required": true},
    "loanAmount": {"type": "number", "required": true}
  },
  "parties": {
    "buyers": {"type": "array", "required": true, "minItems": 1},
    "sellers": {"type": "array", "required": true, "minItems": 1},
    "buyerAgent": {"type": "object", "required": false},
    "sellerAgent": {"type": "object", "required": false}
  },
  "dates": {
    "offerDate": {"type": "date", "required": true},
    "acceptanceDate": {"type": "date", "required": false},
    "closingDate": {"type": "date", "required": true},
    "possessionDate": {"type": "date", "required": true}
  },
  "contingencies": {
    "inspection": {"type": "object", "required": true},
    "appraisal": {"type": "object", "required": true},
    "loan": {"type": "object", "required": true},
    "saleOfBuyerProperty": {"type": "object", "required": false}
  },
  "escrow": {
    "escrowHolder": {"type": "string", "required": true},
    "escrowNumber": {"type": "string", "required": false},
    "titleCompany": {"type": "string", "required": true}
  }
}'::jsonb,
signatures_schema = '[
  {
    "id": "buyer_signature_1",
    "type": "buyer",
    "required": true,
    "page": 10,
    "position": {"x": 100, "y": 600}
  },
  {
    "id": "buyer_signature_2",
    "type": "buyer",
    "required": false,
    "page": 10,
    "position": {"x": 300, "y": 600}
  },
  {
    "id": "seller_signature_1",
    "type": "seller",
    "required": true,
    "page": 10,
    "position": {"x": 100, "y": 700}
  },
  {
    "id": "seller_signature_2",
    "type": "seller",
    "required": false,
    "page": 10,
    "position": {"x": 300, "y": 700}
  },
  {
    "id": "buyer_initials_1",
    "type": "buyer",
    "subtype": "initials",
    "required": true,
    "pages": [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  {
    "id": "seller_initials_1",
    "type": "seller",
    "subtype": "initials",
    "required": true,
    "pages": [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
]'::jsonb
WHERE template_code = 'CA_RPA';

-- Add indexes for performance
CREATE INDEX idx_templates_commonly_used ON document_templates(is_commonly_used) WHERE is_commonly_used = true;