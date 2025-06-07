import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoController } from '../../stores/demoController';

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
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=8615+Circle+R',
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
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=1234+Main+St',
    description: 'Charming home with a large backyard. Perfect for entertaining.'
  }
];

export const DemoSearch = () => {
  const { trackAction, demoSpeed } = useDemoController();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Auto-advance demo based on speed
  useEffect(() => {
    const timers: number[] = [];

    // Show search results after a delay
    timers.push(
      window.setTimeout(() => {
        setSearchQuery('Circle R');
        setShowResults(true);
      }, demoSpeed === 'instant' ? 0 : 1000)
    );

    // Select property after results appear
    timers.push(
      window.setTimeout(() => {
        setSelectedProperty('8615-circle-r');
      }, demoSpeed === 'instant' ? 0 : 2000)
    );

    // Advance to property details
    timers.push(
      window.setTimeout(() => {
        trackAction('property_selected');
      }, demoSpeed === 'instant' ? 0 : 3000)
    );

    return () => timers.forEach(clearTimeout);
  }, [demoSpeed, trackAction]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Property Search
        </h1>

        {/* Search Input */}
        <div className="relative mb-4 sm:mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showResults ? 1 : 0 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
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