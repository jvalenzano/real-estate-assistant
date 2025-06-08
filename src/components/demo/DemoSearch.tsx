import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoController } from '../../stores/demoController';

import { getPropertyImage } from '../../data/propertyImages';

interface Property {
  id: string;
  address: string;
  city: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  description: string;
}

// Mock property data for the demo
const demoProperties: Property[] = [
  {
    id: '8615-circle-r',
    address: '8615 Circle R Course Ln',
    city: 'San Diego',
    price: '$1,250,000',
    beds: 4,
    baths: 3,
    sqft: 2450,
    image: getPropertyImage('8615-circle-r', 'thumbnail'),
    description: 'Beautiful family home in a quiet neighborhood. Recently renovated kitchen and bathrooms.'
  },
  {
    id: '1234-main-st',
    address: '1234 Main St',
    city: 'San Diego',
    price: '$950,000',
    beds: 3,
    baths: 2,
    sqft: 1800,
    image: getPropertyImage('1234-main-st', 'thumbnail'),
    description: 'Charming home with a large backyard. Perfect for entertaining.'
  }
];

// Traditional workflow steps for Problem Demo
const traditionalSteps = [
  { id: 1, text: "Call multiple agents", status: "pending", time: "15 min" },
  { id: 2, text: "Schedule property visits", status: "pending", time: "30 min" },
  { id: 3, text: "Research comparable sales", status: "pending", time: "45 min" },
  { id: 4, text: "Analyze market trends", status: "pending", time: "30 min" },
  { id: 5, text: "Calculate investment metrics", status: "pending", time: "20 min" },
  { id: 6, text: "Review property disclosures", status: "pending", time: "25 min" },
  { id: 7, text: "Coordinate inspections", status: "pending", time: "40 min" },
];

export const DemoSearch = () => {
  const { trackAction, demoSpeed, currentScenario } = useDemoController();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  
  // Problem Demo specific state
  const [showTraditionalWorkflow, setShowTraditionalWorkflow] = useState(false);
  const [traditionalStepIndex, setTraditionalStepIndex] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  // Progressive search states
  const [isSearching, setIsSearching] = useState(false);

  const isProblemDemo = currentScenario === 'problem-demo';



  // Initialize search query and show results for happy path
  useEffect(() => {
    setSearchQuery('Circle R');
    if (!isProblemDemo) {
      // For happy path, show results immediately
      setTimeout(() => {
        setShowResults(true);
        setSelectedProperty('8615-circle-r');
      }, 100);
    }
  }, [isProblemDemo]);

  // Auto-advance demo based on speed and scenario
  useEffect(() => {
    const timers: number[] = [];

    if (isProblemDemo) {
      // Problem Demo: Show traditional workflow complexity
      timers.push(
        window.setTimeout(() => {
          setShowTraditionalWorkflow(true);
          trackAction('show_traditional_workflow');
        }, demoSpeed === 'instant' ? 0 : 500)
      );

      // Animate through traditional steps to show complexity
      traditionalSteps.forEach((_, index) => {
        timers.push(
          window.setTimeout(() => {
            setTraditionalStepIndex(index + 1);
          }, demoSpeed === 'instant' ? 0 : 1000 + (index * 400))
        );
      });

      // Show errors and frustration
      timers.push(
        window.setTimeout(() => {
          setShowErrors(true);
        }, demoSpeed === 'instant' ? 0 : 4000)
      );

    } else {
      // Happy Path and Power User: Enhanced flow with progressive states
      


              // Start search after delay
        timers.push(
          window.setTimeout(() => {
            setIsSearching(true);
          }, demoSpeed === 'instant' ? 0 : 2500)
        );

      // Show search results
      timers.push(
        window.setTimeout(() => {
          setIsSearching(false);
          setShowResults(true);
        }, demoSpeed === 'instant' ? 0 : 3500)
      );

      // Auto-select property
      timers.push(
        window.setTimeout(() => {
          setSelectedProperty('8615-circle-r');
        }, demoSpeed === 'instant' ? 0 : 4500)
      );

      // Track completion
      timers.push(
        window.setTimeout(() => {
          trackAction('property_selected');
        }, demoSpeed === 'instant' ? 0 : 5500)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [demoSpeed, trackAction, isProblemDemo, currentScenario]);

  if (isProblemDemo && showTraditionalWorkflow) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-lg p-4 sm:p-6 border-2 border-red-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-800">
              Traditional Real Estate Process
            </h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-red-600 font-semibold">Estimated Time:</span>
              <span className="text-2xl font-bold text-red-800">2-3 Hours</span>
              <span className="text-red-600">• 47 Manual Steps</span>
            </div>
          </div>

          {/* Traditional Workflow Steps */}
          <div className="space-y-3 mb-6">
            {traditionalSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: index < traditionalStepIndex ? 1 : 0.3,
                  x: 0,
                  backgroundColor: index < traditionalStepIndex ? '#FEF2F2' : '#F9FAFB'
                }}
                className={`p-4 rounded-lg border-2 flex items-center justify-between ${
                  index < traditionalStepIndex 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < traditionalStepIndex 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <span className={`font-medium ${
                    index < traditionalStepIndex ? 'text-red-800' : 'text-gray-600'
                  }`}>
                    {step.text}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${
                    index < traditionalStepIndex ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {step.time}
                  </span>
                  {index < traditionalStepIndex && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Error Messages */}
          <AnimatePresence>
            {showErrors && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-red-800">Common Problems:</span>
                  </div>
                  <ul className="text-red-700 space-y-1 text-sm">
                    <li>• 15-20 errors per transaction</li>
                    <li>• Missed deadlines and delays</li>
                    <li>• Inconsistent document formatting</li>
                    <li>• Manual data entry mistakes</li>
                    <li>• Poor client communication</li>
                  </ul>
                </div>

                <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="font-semibold text-orange-800">Cost Impact:</span>
                  </div>
                  <div className="text-orange-700 text-sm">
                    <p>• $500-800 per transaction in labor costs</p>
                    <p>• Lost deals due to slow response times</p>
                    <p>• Client dissatisfaction: 2.3/5 stars</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Property Search
        </h1>

        {/* Search Input */}
        <div className="relative mb-4 sm:mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery || "Circle R"}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties..."
              className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
              readOnly
            />

          </div>

          {/* Search Button */}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>



        {/* Search Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3 sm:space-y-4"
            >
              {demoProperties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    borderColor: selectedProperty === property.id ? '#1976D2' : '#E5E7EB',
                    backgroundColor: selectedProperty === property.id ? '#EFF6FF' : '#FFFFFF'
                  }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedProperty === property.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => setSelectedProperty(property.id)}
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <img
                      src={property.image}
                      alt={property.address}
                      className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{property.address}</h3>
                      <p className="text-gray-600">{property.city}</p>
                      <p className="text-lg font-semibold text-blue-600 mt-1">{property.price}</p>
                      <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 text-sm text-gray-500">
                        <span>{property.beds} beds</span>
                        <span>{property.baths} baths</span>
                        <span>{property.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 