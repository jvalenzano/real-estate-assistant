import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDemoController } from '../../stores/demoController';

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
  image: '/assets/properties/8615.jpg',
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
  images: [
    '/assets/properties/8615.jpg',
    '/assets/properties/8615-2.jpg',
    '/assets/properties/8615-3.jpg'
  ],
  location: {
    lat: 33.1192,
    lng: -117.0864
  }
};

export const DemoPropertyDetails = () => {
  const { trackAction, demoSpeed } = useDemoController();
  const [isGeneratingRPA, setIsGeneratingRPA] = useState(false);

  // Auto-advance demo based on speed
  useEffect(() => {
    const timers: number[] = [];
    const baseTiming = {
      normal: 8000,
      fast: 4000,
      instant: 500
    }[demoSpeed];

    // Advance to document generation after viewing property
    timers.push(
      window.setTimeout(() => {
        setIsGeneratingRPA(true);
        trackAction('rpa_generation_started');
      }, baseTiming)
    );

    return () => timers.forEach(clearTimeout);
  }, [demoSpeed, trackAction]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hero Section with Image Gallery */}
        <div className="relative h-96 bg-gray-100">
          <motion.img
            src={demoProperty.images[0]}
            alt={demoProperty.address}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">{demoProperty.price}</h1>
            <p className="text-white/90">{demoProperty.address}</p>
          </div>
        </div>

        {/* Generate RPA Button */}
        <div className="p-6 border-b border-gray-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              isGeneratingRPA 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isGeneratingRPA}
            onClick={() => {
              setIsGeneratingRPA(true);
              trackAction('rpa_generation_started');
            }}
          >
            {isGeneratingRPA ? 'Generating RPA...' : 'Generate RPA'}
          </motion.button>
        </div>

        {/* Investment Metrics Grid */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Cap Rate"
              value={demoProperty.metrics.capRate}
              highlight
            />
            <MetricCard
              label="Monthly Cash Flow"
              value={demoProperty.metrics.cashFlow}
              highlight
            />
            <MetricCard
              label="ROI"
              value={demoProperty.metrics.roi}
            />
            <MetricCard
              label="Price/Sqft"
              value={demoProperty.metrics.pricePerSqft}
            />
            <MetricCard
              label="Days on Market"
              value={demoProperty.metrics.daysOnMarket}
            />
            <MetricCard
              label="Market Appreciation"
              value={demoProperty.metrics.marketAppreciation}
            />
            <MetricCard
              label="Rent Growth"
              value={demoProperty.metrics.rentGrowth}
            />
            <MetricCard
              label="Monthly Rent"
              value={demoProperty.metrics.monthlyRent}
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Beds</span>
              <p className="font-medium text-gray-900">{demoProperty.beds}</p>
            </div>
            <div>
              <span className="text-gray-500">Baths</span>
              <p className="font-medium text-gray-900">{demoProperty.baths}</p>
            </div>
            <div>
              <span className="text-gray-500">Square Feet</span>
              <p className="font-medium text-gray-900">{demoProperty.sqft.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-500">City</span>
              <p className="font-medium text-gray-900">{demoProperty.city}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-600">{demoProperty.description}</p>
        </div>
      </div>
    </div>
  );
};

// Helper component for metric cards
const MetricCard = ({ 
  label, 
  value, 
  highlight = false 
}: { 
  label: string; 
  value: string; 
  highlight?: boolean;
}) => (
  <div className={`p-4 rounded-lg ${
    highlight 
      ? 'bg-blue-50 border border-blue-100' 
      : 'bg-gray-50 border border-gray-100'
  }`}>
    <span className="text-sm text-gray-500">{label}</span>
    <p className={`font-semibold ${
      highlight ? 'text-blue-600' : 'text-gray-900'
    }`}>{value}</p>
  </div>
); 