import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoController } from '../../stores/demoController';
import { DemoSearch } from './DemoSearch';
import { DemoPropertyDetails } from './DemoPropertyDetails';
import { DemoDocumentGeneration } from './DemoDocumentGeneration';
import { DemoSignature } from './DemoSignature';
import { DemoComplete } from './DemoComplete';
import { NeighborhoodDashboard } from './NeighborhoodDashboard';

const viewComponents = {
  'search': DemoSearch,
  'property-details': DemoPropertyDetails,
  'neighborhood-dashboard': NeighborhoodDashboard,
  'document-generation': DemoDocumentGeneration,
  'signature': DemoSignature,
  'transaction-complete': DemoComplete,
} as const;

export const DemoContainer = () => {
  const { currentView } = useDemoController();

  // Remove automatic demo start - scenarios are now controlled manually
  useEffect(() => {
    // Optional: Add any initialization logic here if needed
  }, []);

  const CurrentView = viewComponents[currentView as keyof typeof viewComponents] || DemoSearch;

  return (
    <div className="min-h-screen bg-gray-50">


      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 py-8"
        >
          <CurrentView />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 