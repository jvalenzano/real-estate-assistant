/**
 * Form field type definitions
 */

export interface FormField {
  id: string;
  name: string;
  type: FormFieldType;
  label: string;
  value?: any;
  defaultValue?: any;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  touched?: boolean;
  validation?: FormFieldValidation;
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'currency'
  | 'percentage'
  | 'date'
  | 'datetime'
  | 'time'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  | 'file'
  | 'signature'
  | 'address'
  | 'hidden';

export interface FormFieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp | string;
  email?: boolean;
  url?: boolean;
  phone?: boolean;
  custom?: (value: any, form?: FormData) => boolean | string;
  messages?: {
    required?: string;
    min?: string;
    max?: string;
    minLength?: string;
    maxLength?: string;
    pattern?: string;
    email?: string;
    url?: string;
    phone?: string;
    custom?: string;
  };
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  visible?: boolean;
  collapsed?: boolean;
  icon?: string;
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormTouched {
  [key: string]: boolean;
}

export interface FormState {
  values: FormData;
  errors: FormErrors;
  touched: FormTouched;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

export interface FormConfig {
  fields: FormField[];
  sections?: FormSection[];
  initialValues?: FormData;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  validateOnMount?: boolean;
  enableReinitialize?: boolean;
}

// Specific field configurations
export interface AddressField extends FormField {
  type: 'address';
  value?: AddressValue;
  config?: {
    includeCountry?: boolean;
    includeApartment?: boolean;
    autocomplete?: boolean;
    googleMapsApiKey?: string;
  };
}

export interface AddressValue {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SignatureField extends FormField {
  type: 'signature';
  value?: string; // Base64 encoded signature
  config?: {
    penColor?: string;
    backgroundColor?: string;
    width?: number;
    height?: number;
    format?: 'png' | 'jpg' | 'svg';
  };
}

export interface FileField extends FormField {
  type: 'file';
  value?: File | File[];
  config?: {
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in bytes
    maxFiles?: number;
  };
}

export interface SelectField extends FormField {
  type: 'select' | 'multiselect';
  options: SelectOption[];
  value?: string | string[];
  config?: {
    searchable?: boolean;
    clearable?: boolean;
    loading?: boolean;
    loadOptions?: (query: string) => Promise<SelectOption[]>;
  };
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: string;
  description?: string;
}

export interface DateField extends FormField {
  type: 'date' | 'datetime' | 'time';
  value?: string | Date;
  config?: {
    minDate?: string | Date;
    maxDate?: string | Date;
    disabledDates?: (string | Date)[];
    format?: string;
    timezone?: string;
  };
}

export interface CurrencyField extends FormField {
  type: 'currency';
  value?: number;
  config?: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  };
}

// Form builder types
export interface FormBuilderConfig {
  fields: FormFieldConfig[];
  layout?: FormLayout;
  theme?: FormTheme;
  actions?: FormAction[];
}

export interface FormFieldConfig {
  type: FormFieldType;
  name: string;
  label: string;
  section?: string;
  column?: number;
  width?: number;
  config?: any;
}

export interface FormLayout {
  type: 'single' | 'multi-column' | 'wizard';
  columns?: number;
  gutter?: number;
  responsive?: boolean;
}

export interface FormTheme {
  primaryColor?: string;
  errorColor?: string;
  successColor?: string;
  borderRadius?: number;
  fontSize?: number;
}

export interface FormAction {
  type: 'submit' | 'reset' | 'cancel' | 'custom';
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  handler?: (form: FormState) => void;
}