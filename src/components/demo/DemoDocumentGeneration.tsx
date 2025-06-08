import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoController } from '../../stores/demoController';

// Document types from our data structure
interface Document {
  id: string;
  type: 'RPA' | 'Disclosure';
  propertyId: string;
  title: string;
  status: 'pending-signature' | 'signed';
  createdBy: string;
  createdAt: string;
  pdf: string;
}

// Mock RPA data for the demo
const demoRPA: Document = {
  id: 'doc-rpa-8615',
  type: 'RPA',
  propertyId: 'prop-8615',
  title: 'Residential Purchase Agreement',
  status: 'pending-signature',
  createdBy: 'user-agent-1',
  createdAt: '2024-06-01T10:00:00Z',
  pdf: '/assets/documents/rpa-8615.pdf'
};

// Form fields that will be auto-filled
interface RPAFields {
  propertyAddress: string;
  purchasePrice: string;
  buyerName: string;
  sellerName: string;
  agentName: string;
  escrowCompany: string;
  closingDate: string;
  earnestMoney: string;
  loanAmount: string;
  downPayment: string;
}

// Additional Power User customization fields
interface PowerUserFields extends RPAFields {
  contingencyPeriod: string;
  inspectionPeriod: string;
  appraisalContingency: string;
  loanContingency: string;
  sellerCredits: string;
  personalProperty: string;
  additionalTerms: string;
}

// Mock form data for auto-fill animation
const demoRPAData: RPAFields = {
  propertyAddress: '8615 Circle R Course Ln, Escondido, CA 92026',
  purchasePrice: '$1,250,000',
  buyerName: 'John Smith',
  sellerName: 'Jane Doe',
  agentName: 'Sarah Johnson',
  escrowCompany: 'First American Title',
  closingDate: 'July 15, 2024',
  earnestMoney: '$25,000',
  loanAmount: '$1,000,000',
  downPayment: '$250,000'
};

// Power User enhanced data
const powerUserRPAData: PowerUserFields = {
  ...demoRPAData,
  propertyAddress: '7890 Oak Avenue, San Diego, CA 92120', // Updated for selected property
  purchasePrice: '$1,320,000',
  loanAmount: '$1,056,000',
  downPayment: '$264,000',
  earnestMoney: '$30,000',
  contingencyPeriod: '17 days',
  inspectionPeriod: '10 days',
  appraisalContingency: 'Yes, 17 days',
  loanContingency: 'Yes, 21 days',
  sellerCredits: '$5,000 for closing costs',
  personalProperty: 'Pool equipment, window coverings',
  additionalTerms: 'Seller to provide home warranty'
};

// Customization options for Power User
const customizationOptions = [
  {
    id: 'contingency',
    label: 'Contingency Period',
    description: 'Adjust buyer protection timeframes',
    icon: '🛡️'
  },
  {
    id: 'financing',
    label: 'Financing Terms',
    description: 'Customize loan and down payment terms',
    icon: '💰'
  },
  {
    id: 'inspection',
    label: 'Inspection Terms',
    description: 'Set inspection and repair requirements',
    icon: '🔍'
  },
  {
    id: 'closing',
    label: 'Closing Details',
    description: 'Configure closing costs and credits',
    icon: '📋'
  }
];

// Problem Demo comparison data
const comparisonMetrics = {
  traditional: {
    time: '2-3 Hours',
    steps: '47 Manual Steps',
    errors: '15-20 Errors',
    cost: '$500-800',
    satisfaction: '2.3/5 ⭐',
    documents: 'Manual Creation'
  },
  automated: {
    time: '5 Minutes',
    steps: '3 Automated Steps',
    errors: '1-2 Errors',
    cost: '$50-100',
    satisfaction: '4.8/5 ⭐',
    documents: 'AI Generated'
  }
};

export const DemoDocumentGeneration = () => {
  const { trackAction, demoSpeed, currentScenario } = useDemoController();
  const [isGenerating, setIsGenerating] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [currentField, setCurrentField] = useState<keyof PowerUserFields | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizationStep, setCustomizationStep] = useState(0);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  
  // Problem Demo specific state
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonStep, setComparisonStep] = useState(0);
  const [showSavingsAnimation, setShowSavingsAnimation] = useState(false);

  // Power User scenario logic
  const isPowerUser = currentScenario === 'power-user';
  const isProblemDemo = currentScenario === 'problem-demo';
  const formData = isPowerUser ? powerUserRPAData : demoRPAData;

  // Auto-advance demo based on speed and scenario
  useEffect(() => {
    const timers: number[] = [];
    
    if (isProblemDemo) {
      // Problem Demo: Show dramatic before/after comparison
      timers.push(
        window.setTimeout(() => {
          setShowComparison(true);
          trackAction('show_time_comparison');
        }, demoSpeed === 'instant' ? 0 : 500)
      );

      // Animate comparison reveal
      timers.push(
        window.setTimeout(() => {
          setComparisonStep(1);
        }, demoSpeed === 'instant' ? 0 : 1500)
      );

      timers.push(
        window.setTimeout(() => {
          setComparisonStep(2);
        }, demoSpeed === 'instant' ? 0 : 3000)
      );

      // Show dramatic savings animation
      timers.push(
        window.setTimeout(() => {
          setShowSavingsAnimation(true);
        }, demoSpeed === 'instant' ? 0 : 5000)
      );

    } else {
      // Happy Path and Power User scenarios
      const baseTiming = {
        normal: isPowerUser ? 40000 : 1200,  // 40s for power user, 1.2s for happy path
        fast: isPowerUser ? 20000 : 600,
        instant: isPowerUser ? 4000 : 100
      }[demoSpeed];

      // Get all form fields
      const fields = Object.keys(formData) as (keyof PowerUserFields)[];

      // Start generation
      timers.push(
        window.setTimeout(() => {
          setIsGenerating(true);
          trackAction('rpa_generation_started');
        }, 0)
      );

      if (isPowerUser) {
        // Power User: Show customization options first
        timers.push(
          window.setTimeout(() => {
            setShowCustomization(true);
            trackAction('rpa_customization');
          }, baseTiming * 0.1)
        );

        // Cycle through customization options
        customizationOptions.forEach((_, index) => {
          timers.push(
            window.setTimeout(() => {
              setCustomizationStep(index + 1);
              setSelectedCustomizations(prev => [...prev, customizationOptions[index].id]);
            }, baseTiming * (0.2 + index * 0.1))
          );
        });

        // Start form filling after customization
        timers.push(
          window.setTimeout(() => {
            setShowCustomization(false);
          }, baseTiming * 0.6)
        );
      }

      // Auto-fill fields with animation
      const startFillTime = isPowerUser ? baseTiming * 0.65 : baseTiming * 0.1;
      const fillDuration = isPowerUser ? baseTiming * 0.3 : baseTiming * 0.8;
      
      fields.forEach((field, index) => {
        timers.push(
          window.setTimeout(() => {
            setCurrentField(field);
          }, startFillTime + (index * fillDuration) / fields.length)
        );
      });

      // Complete generation
      timers.push(
        window.setTimeout(() => {
          setIsGenerating(false);
          setIsComplete(true);
          trackAction('rpa_generated');
        }, baseTiming * 0.95)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [demoSpeed, trackAction, isPowerUser, isProblemDemo, currentScenario]);

  if (isProblemDemo && showComparison) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-lg shadow-lg p-4 sm:p-6 border-2 border-yellow-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-yellow-800">
              Before vs. After Comparison
            </h1>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Traditional Process */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ 
                opacity: comparisonStep >= 1 ? 1 : 0.3,
                x: 0 
              }}
              className="bg-red-100 border-2 border-red-300 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-red-800">Traditional Process</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-700 font-medium">Time Required:</span>
                  <span className="text-xl font-bold text-red-800">{comparisonMetrics.traditional.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-700 font-medium">Manual Steps:</span>
                  <span className="text-lg font-semibold text-red-800">{comparisonMetrics.traditional.steps}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-700 font-medium">Typical Errors:</span>
                  <span className="text-lg font-semibold text-red-800">{comparisonMetrics.traditional.errors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-700 font-medium">Cost per Transaction:</span>
                  <span className="text-lg font-semibold text-red-800">{comparisonMetrics.traditional.cost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-700 font-medium">Client Satisfaction:</span>
                  <span className="text-lg font-semibold text-red-800">{comparisonMetrics.traditional.satisfaction}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-700 font-medium">Document Creation:</span>
                  <span className="text-lg font-semibold text-red-800">{comparisonMetrics.traditional.documents}</span>
                </div>
              </div>
            </motion.div>

            {/* Our Automated Solution */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: comparisonStep >= 2 ? 1 : 0.3,
                x: 0 
              }}
              className="bg-green-100 border-2 border-green-300 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-green-800">Our Automated Solution</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">Time Required:</span>
                  <span className="text-xl font-bold text-green-800">{comparisonMetrics.automated.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">Automated Steps:</span>
                  <span className="text-lg font-semibold text-green-800">{comparisonMetrics.automated.steps}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">Typical Errors:</span>
                  <span className="text-lg font-semibold text-green-800">{comparisonMetrics.automated.errors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">Cost per Transaction:</span>
                  <span className="text-lg font-semibold text-green-800">{comparisonMetrics.automated.cost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">Client Satisfaction:</span>
                  <span className="text-lg font-semibold text-green-800">{comparisonMetrics.automated.satisfaction}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">Document Creation:</span>
                  <span className="text-lg font-semibold text-green-800">{comparisonMetrics.automated.documents}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Dramatic Savings Animation */}
          <AnimatePresence>
            {showSavingsAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-yellow-400 to-green-400 rounded-lg p-6 text-center"
              >
                <h2 className="text-2xl font-bold text-white mb-4">🎉 INCREDIBLE SAVINGS! 🎉</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/20 rounded-lg p-4"
                  >
                    <div className="text-3xl font-bold">97%</div>
                    <div className="text-sm">Time Reduction</div>
                    <div className="text-xs mt-1">2-3 hrs → 5 min</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/20 rounded-lg p-4"
                  >
                    <div className="text-3xl font-bold">94%</div>
                    <div className="text-sm">Error Reduction</div>
                    <div className="text-xs mt-1">15-20 → 1-2 errors</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/20 rounded-lg p-4"
                  >
                    <div className="text-3xl font-bold">85%</div>
                    <div className="text-sm">Cost Savings</div>
                    <div className="text-xs mt-1">$500-800 → $50-100</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/20 rounded-lg p-4"
                  >
                    <div className="text-3xl font-bold">109%</div>
                    <div className="text-sm">Satisfaction Boost</div>
                    <div className="text-xs mt-1">2.3 → 4.8 stars</div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="mt-6 text-lg font-semibold text-white"
                >
                  💰 ROI: $450-700 saved per transaction × 100 transactions = $45,000-70,000 annual savings!
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Document Header */}
        <div className="bg-blue-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {isPowerUser ? 'Custom RPA Generation' : 'RPA Document Generation'}
              </h1>
              <p className="text-blue-100 mt-1">
                {isPowerUser ? 'Advanced customization for sophisticated investors' : 'Automated document creation'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Document ID</div>
              <div className="font-mono text-lg text-white">{demoRPA.id}</div>
            </div>
          </div>
        </div>

        {/* Power User: Customization Panel */}
        <AnimatePresence>
          {isPowerUser && showCustomization && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-purple-50 border-b border-purple-200 p-6"
            >
              <h2 className="text-lg font-semibold text-purple-800 mb-4">
                🎯 Advanced Customization Options
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customizationOptions.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: customizationStep > index ? 1 : 0.3,
                      x: 0,
                      backgroundColor: selectedCustomizations.includes(option.id) ? '#F3E8FF' : '#FAFAFA'
                    }}
                    className={`p-4 rounded-lg border-2 ${
                      selectedCustomizations.includes(option.id)
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{option.label}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      {selectedCustomizations.includes(option.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generation Status */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-900 font-medium">
                  {isPowerUser ? 'Generating custom RPA with your specifications...' : 'Generating RPA document...'}
                </span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-700 font-bold">
                  {isPowerUser ? 'Custom RPA generated successfully!' : 'RPA document generated successfully!'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <motion.div
                key={key}
                className={`p-3 border rounded-lg transition-colors ${
                  currentField === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                animate={{
                  borderColor: currentField === key ? '#3B82F6' : '#E5E7EB',
                  backgroundColor: currentField === key ? '#EFF6FF' : '#F9FAFB'
                }}
              >
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <div className={`font-semibold ${
                  currentField === key ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {value}
                </div>
                {currentField === key && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-0.5 bg-blue-500 mt-2"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Document Preview */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Preview</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900">{demoRPA.title}</h4>
                  <p className="text-sm text-gray-600">Ready for signatures</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>• All fields automatically populated</p>
                <p>• Legal compliance verified</p>
                <p>• Ready for electronic signatures</p>
                {isPowerUser && <p>• Custom terms and conditions applied</p>}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 