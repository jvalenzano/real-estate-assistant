import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDemoController } from '../../stores/demoController';
import { getPropertyImage, getPropertyGallery } from '../../data/propertyImages';
import { PropertyImageCarousel } from './PropertyImageCarousel';

// Base property type from DemoSearch
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

// Extended property type with investment metrics
interface PropertyMetrics {
  capRate: string;
  monthlyRent: string;
  roi: string;
  cashFlow: string;
  pricePerSqft: string;
  daysOnMarket: string;
  marketAppreciation: string;
  rentGrowth: string;
}

interface PropertyDetails extends Property {
  metrics: PropertyMetrics;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
}

// Mock property data for the demo
const demoProperty: PropertyDetails = {
  id: '8615-circle-r',
  address: '8615 Circle R Course Ln',
  city: 'San Diego',
  price: '$1,250,000',
  beds: 4,
  baths: 3,
  sqft: 2450,
  image: getPropertyImage('8615-circle-r'),
  description: 'Beautiful family home in a quiet neighborhood. Recently renovated kitchen and bathrooms.',
  metrics: {
    capRate: '6.2%',
    monthlyRent: '$4,200',
    roi: '8.4%',
    cashFlow: '+$1,850/mo',
    pricePerSqft: '$286',
    daysOnMarket: '12 days',
    marketAppreciation: '+4.2% YoY',
    rentGrowth: '+3.8% YoY'
  },
  images: getPropertyGallery('8615-circle-r'),
  location: {
    lat: 33.1192,
    lng: -117.0864
  }
};

// Additional properties for Power User comparison
const comparisonProperties: PropertyDetails[] = [
  {
    id: '4521-maple-st',
    address: '4521 Maple Street',
    city: 'San Diego',
    price: '$1,180,000',
    beds: 3,
    baths: 2,
    sqft: 2200,
    image: getPropertyImage('4521-maple-st'),
    description: 'Modern townhome with updated finishes and great location.',
    metrics: {
      capRate: '5.8%',
      monthlyRent: '$3,900',
      roi: '7.9%',
      cashFlow: '+$1,650/mo',
      pricePerSqft: '$295',
      daysOnMarket: '8 days',
      marketAppreciation: '+3.9% YoY',
      rentGrowth: '+3.5% YoY'
    },
    images: getPropertyGallery('4521-maple-st'),
    location: { lat: 33.1150, lng: -117.0820 }
  },
  {
    id: '7890-oak-ave',
    address: '7890 Oak Avenue',
    city: 'San Diego',
    price: '$1,320,000',
    beds: 4,
    baths: 3,
    sqft: 2600,
    image: getPropertyImage('7890-oak-ave'),
    description: 'Spacious home with pool and large backyard.',
    metrics: {
      capRate: '6.5%',
      monthlyRent: '$4,500',
      roi: '8.8%',
      cashFlow: '+$2,100/mo',
      pricePerSqft: '$275',
      daysOnMarket: '15 days',
      marketAppreciation: '+4.5% YoY',
      rentGrowth: '+4.1% YoY'
    },
    images: getPropertyGallery('7890-oak-ave'),
    location: { lat: 33.1220, lng: -117.0900 }
  }
];

// Automated solution steps for Problem Demo
const automatedSteps = [
  { id: 1, text: "AI analyzes property data", time: "2 sec", icon: "robot" },
  { id: 2, text: "Auto-generates investment metrics", time: "1 sec", icon: "📊" },
  { id: 3, text: "Instant document preparation", time: "2 sec", icon: "📄" },
];

export const DemoPropertyDetails = () => {
  const { trackAction, demoSpeed, currentScenario, setView } = useDemoController();
  const [isGeneratingRPA, setIsGeneratingRPA] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetails>(demoProperty);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonStep, setComparisonStep] = useState(0);
  
  // Problem Demo specific state
  const [showAutomatedSolution, setShowAutomatedSolution] = useState(false);
  const [automatedStepIndex, setAutomatedStepIndex] = useState(0);
  const [showSolutionBenefits, setShowSolutionBenefits] = useState(false);

  // Power User scenario logic
  const isPowerUser = currentScenario === 'power-user';
  const isProblemDemo = currentScenario === 'problem-demo';

  // Handler for neighborhood insights navigation
  const handleExploreNeighborhood = () => {
    setView('neighborhood-dashboard');
    trackAction('neighborhood_dashboard_viewed');
  };

  // Auto-advance demo based on speed and scenario
  useEffect(() => {
    const timers: number[] = [];
    
    if (isProblemDemo) {
      // Problem Demo: Show our automated solution
      timers.push(
        window.setTimeout(() => {
          setShowAutomatedSolution(true);
          trackAction('show_our_solution');
        }, demoSpeed === 'instant' ? 0 : 500)
      );

      // Animate through automated steps to show efficiency
      automatedSteps.forEach((_, index) => {
        timers.push(
          window.setTimeout(() => {
            setAutomatedStepIndex(index + 1);
          }, demoSpeed === 'instant' ? 0 : 1000 + (index * 800))
        );
      });

      // Show solution benefits
      timers.push(
        window.setTimeout(() => {
          setShowSolutionBenefits(true);
        }, demoSpeed === 'instant' ? 0 : 4000)
      );

    } else {
      // Happy Path and Power User scenarios
      const baseTiming = {
        normal: isPowerUser ? 25000 : 8000, // 25s for power user, 8s for happy path
        fast: isPowerUser ? 12500 : 4000,
        instant: isPowerUser ? 2500 : 500
      }[demoSpeed];

      if (isPowerUser) {
        // Power User: Show comparison after 5 seconds
        timers.push(
          window.setTimeout(() => {
            setShowComparison(true);
            trackAction('properties_compared');
          }, baseTiming * 0.2)
        );

        // Cycle through comparison steps
        timers.push(
          window.setTimeout(() => setComparisonStep(1), baseTiming * 0.4)
        );
        timers.push(
          window.setTimeout(() => setComparisonStep(2), baseTiming * 0.6)
        );

        // Select best property and advance
        timers.push(
          window.setTimeout(() => {
            setSelectedProperty(comparisonProperties[1]); // Select Oak Avenue (best ROI)
            setIsGeneratingRPA(true);
            trackAction('rpa_generation_started');
          }, baseTiming * 0.8)
        );
      } else {
        // Happy Path: Direct advance to document generation
        timers.push(
          window.setTimeout(() => {
            setIsGeneratingRPA(true);
            trackAction('rpa_generation_started');
          }, baseTiming)
        );
      }
    }

    return () => timers.forEach(clearTimeout);
  }, [demoSpeed, trackAction, isPowerUser, isProblemDemo, currentScenario]);

  if (isProblemDemo && showAutomatedSolution) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-4 sm:p-6 border-2 border-green-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-800">
              Our Automated Solution
            </h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-600 font-semibold">Total Time:</span>
              <span className="text-2xl font-bold text-green-800">5 Minutes</span>
              <span className="text-green-600">• 3 Automated Steps</span>
            </div>
          </div>

          {/* Automated Solution Steps */}
          <div className="space-y-4 mb-6">
            {automatedSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: index < automatedStepIndex ? 1 : 0.3,
                  x: 0,
                  backgroundColor: index < automatedStepIndex ? '#F0FDF4' : '#F9FAFB'
                }}
                className={`p-6 rounded-lg border-2 flex items-center justify-between ${
                  index < automatedStepIndex 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {step.icon === "robot" ? (
                      <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                        <path d="M18 8H6C4.9 8 4 8.9 4 10V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM8 16C7.4 16 7 15.6 7 15S7.4 14 8 14S9 14.4 9 15S8.6 16 8 16ZM16 16C15.4 16 15 15.6 15 15S15.4 14 16 14S17 14.4 17 15S16.6 16 16 16ZM16 12H8V11H16V12Z"/>
                        <circle cx="8" cy="11" r="1"/>
                        <circle cx="16" cy="11" r="1"/>
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < automatedStepIndex 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <span className={`font-medium text-lg ${
                    index < automatedStepIndex ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {step.text}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-semibold ${
                    index < automatedStepIndex ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.time}
                  </span>
                  {index < automatedStepIndex && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solution Benefits */}
          {showSolutionBenefits && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-bold text-green-800 text-lg">Key Benefits:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">⚡ Speed:</span>
                    <span>97% faster processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">🎯 Accuracy:</span>
                    <span>94% fewer errors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">💰 Cost:</span>
                    <span>85% cost reduction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">😊 Satisfaction:</span>
                    <span>4.8/5 star rating</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="font-bold text-blue-800 text-lg">Instant Results:</span>
                </div>
                <div className="text-blue-700 space-y-2">
                  <p>✅ Property analysis completed automatically</p>
                  <p>✅ Investment metrics calculated instantly</p>
                  <p>✅ Documents ready for review</p>
                  <p>✅ Zero manual data entry required</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Power User: Property Comparison View */}
      {isPowerUser && showComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[demoProperty, ...comparisonProperties].map((property, index) => (
              <motion.div
                key={property.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProperty.id === property.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${comparisonStep > index ? 'opacity-100' : 'opacity-50'}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: comparisonStep > index ? 1 : 0.5,
                  scale: comparisonStep > index ? 1 : 0.9
                }}
                onClick={() => setSelectedProperty(property)}
              >
                <img
                  src={property.image}
                  alt={property.address}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-gray-900 mb-1">{property.address}</h3>
                <p className="text-lg font-bold text-blue-600 mb-2">{property.price}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cap Rate:</span>
                    <span className="font-semibold text-green-600">{property.metrics.capRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI:</span>
                    <span className="font-semibold text-green-600">{property.metrics.roi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cash Flow:</span>
                    <span className="font-semibold text-green-600">{property.metrics.cashFlow}</span>
                  </div>
                </div>
                
                {selectedProperty.id === property.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-2 bg-blue-100 rounded text-center text-sm font-semibold text-blue-800"
                  >
                    Selected - Best ROI
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Property Details */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <PropertyImageCarousel
            images={selectedProperty.images}
            propertyAddress={selectedProperty.address}
            autoAdvance={true}
            autoAdvanceDelay={5000}
          />
          
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">{selectedProperty.address}</h1>
            <p className="text-lg text-gray-600">{selectedProperty.city}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="text-3xl font-bold text-blue-600">{selectedProperty.price}</div>
            <div className="flex gap-4 text-gray-600">
              <span>{selectedProperty.beds} beds</span>
              <span>{selectedProperty.baths} baths</span>
              <span>{selectedProperty.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{selectedProperty.description}</p>

          {/* Investment Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard label="Cap Rate" value={selectedProperty.metrics.capRate} highlight />
            <MetricCard label="Monthly Rent" value={selectedProperty.metrics.monthlyRent} />
            <MetricCard label="ROI" value={selectedProperty.metrics.roi} highlight />
            <MetricCard label="Cash Flow" value={selectedProperty.metrics.cashFlow} />
          </div>

          {/* Neighborhood Insights Button */}
          <motion.button
            onClick={handleExploreNeighborhood}
            className="w-full py-3 px-6 mb-4 rounded-lg font-semibold text-blue-600 bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <span>🏡</span>
              Explore Neighborhood Insights
            </div>
          </motion.button>

          {/* Generate RPA Button */}
          <motion.button
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              isGeneratingRPA
                ? 'bg-green-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isGeneratingRPA}
            whileHover={{ scale: isGeneratingRPA ? 1 : 1.02 }}
            whileTap={{ scale: isGeneratingRPA ? 1 : 0.98 }}
          >
            {isGeneratingRPA ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating RPA...
              </div>
            ) : (
              'Generate Purchase Agreement'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ 
  label, 
  value, 
  highlight = false 
}: { 
  label: string; 
  value: string; 
  highlight?: boolean;
}) => (
  <div className={`p-3 rounded-lg border ${
    highlight ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
  }`}>
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className={`font-semibold ${
      highlight ? 'text-green-600' : 'text-gray-900'
    }`}>{value}</div>
  </div>
); 