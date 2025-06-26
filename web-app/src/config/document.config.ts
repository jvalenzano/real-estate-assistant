/**
 * Document system configuration
 */

export const DOCUMENT_CONFIG = {
  // Storage settings
  storage: {
    provider: process.env.NEXT_PUBLIC_STORAGE_PROVIDER || 'supabase',
    bucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'documents',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'image/png', 'image/jpeg'],
    publicPath: '/documents',
    privatePath: '/secure-documents'
  },

  // E-signature settings
  eSignature: {
    provider: process.env.NEXT_PUBLIC_ESIGN_PROVIDER || 'mock',
    defaultExpiration: 30, // days
    reminderDays: [7, 14, 21],
    maxSigners: 10,
    requireAuthentication: false
  },

  // PDF generation settings
  pdf: {
    format: 'A4',
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in'
    },
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size: 10px; text-align: center;">{{title}}</div>',
    footerTemplate: '<div style="font-size: 10px; text-align: center;">Page {{page}} of {{pages}}</div>',
    printBackground: true,
    preferCSSPageSize: true
  },

  // Template settings
  templates: {
    basePath: '/templates',
    cacheDuration: 3600, // seconds
    preloadCommon: true,
    enablePlaceholders: true
  },

  // Document lifecycle settings
  lifecycle: {
    draftRetention: 90, // days
    signedRetention: 2555, // days (7 years)
    autoArchive: true,
    requireApproval: false,
    allowDuplication: true
  },

  // UI/UX settings
  ui: {
    enablePreview: true,
    enablePrint: true,
    enableDownload: true,
    enableShare: true,
    enableComments: false,
    enableVersioning: true,
    showActivityLog: true,
    defaultView: 'grid', // 'grid' | 'list'
    itemsPerPage: 20
  },

  // Notification settings
  notifications: {
    email: {
      enabled: true,
      fromAddress: 'documents@realeagent.com',
      fromName: 'RealeAgent Documents'
    },
    sms: {
      enabled: false,
      provider: 'twilio'
    },
    inApp: {
      enabled: true,
      showBadge: true
    }
  },

  // Security settings
  security: {
    requireAuth: true,
    allowGuestView: false,
    encryptStorage: true,
    auditLog: true,
    ipWhitelist: [],
    maxLoginAttempts: 5
  },

  // API settings
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    timeout: 30000, // ms
    retryAttempts: 3,
    retryDelay: 1000 // ms
  }
};

// Document status configurations
export const DOCUMENT_STATUS = {
  DRAFT: {
    value: 'draft',
    label: 'Draft',
    color: 'gray',
    icon: 'edit',
    description: 'Document is being prepared'
  },
  PENDING_REVIEW: {
    value: 'pending_review',
    label: 'Pending Review',
    color: 'yellow',
    icon: 'eye',
    description: 'Document is awaiting review'
  },
  PENDING_SIGNATURE: {
    value: 'pending_signature',
    label: 'Pending Signature',
    color: 'blue',
    icon: 'pen',
    description: 'Document is awaiting signatures'
  },
  SIGNED: {
    value: 'signed',
    label: 'Signed',
    color: 'green',
    icon: 'check',
    description: 'Document has been signed'
  },
  COMPLETED: {
    value: 'completed',
    label: 'Completed',
    color: 'green',
    icon: 'check-circle',
    description: 'Document is fully executed'
  },
  CANCELLED: {
    value: 'cancelled',
    label: 'Cancelled',
    color: 'red',
    icon: 'x-circle',
    description: 'Document has been cancelled'
  },
  EXPIRED: {
    value: 'expired',
    label: 'Expired',
    color: 'red',
    icon: 'clock',
    description: 'Document has expired'
  }
} as const;

// Document categories
export const DOCUMENT_CATEGORIES = {
  '01': {
    number: '01',
    name: 'Buyer\'s Offer and Negotiation',
    color: 'blue',
    icon: 'document-text',
    description: 'Forms for making offers and negotiating terms'
  },
  '02': {
    number: '02',
    name: 'Contingency Removal',
    color: 'orange',
    icon: 'shield-check',
    description: 'Forms for removing contingencies'
  },
  '03': {
    number: '03',
    name: 'Escrow and Contingency',
    color: 'purple',
    icon: 'briefcase',
    description: 'Forms for escrow period'
  },
  '04': {
    number: '04',
    name: 'Final Disclosures',
    color: 'green',
    icon: 'information-circle',
    description: 'Required disclosure forms'
  },
  '05': {
    number: '05',
    name: 'Specific Situations',
    color: 'indigo',
    icon: 'puzzle',
    description: 'Forms for special circumstances'
  },
  '06': {
    number: '06',
    name: 'Listing Stage',
    color: 'red',
    icon: 'home',
    description: 'Forms for property listings'
  }
} as const;

// Validation rules
export const VALIDATION_RULES = {
  propertyAddress: {
    required: true,
    minLength: 10,
    maxLength: 200,
    pattern: /^[a-zA-Z0-9\s,.-]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    pattern: /^[\d\s()+-]+$/,
    minLength: 10,
    maxLength: 20
  },
  currency: {
    min: 0,
    max: 999999999
  },
  percentage: {
    min: 0,
    max: 100
  },
  date: {
    min: new Date().toISOString().split('T')[0], // Today
    max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year
  }
};

// Error messages
export const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  min: 'Value must be at least {{min}}',
  max: 'Value must be at most {{max}}',
  minLength: 'Must be at least {{minLength}} characters',
  maxLength: 'Must be at most {{maxLength}} characters',
  pattern: 'Invalid format',
  date: 'Please enter a valid date',
  currency: 'Please enter a valid amount',
  percentage: 'Please enter a value between 0 and 100'
};