import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoController } from '../../stores/demoController';
import { DemoSearch } from './DemoSearch';
import { DemoPropertyDetails } from './DemoPropertyDetails';
import { DemoDocumentGeneration } from './DemoDocumentGeneration';
import { DemoSignature } from './DemoSignature';
import { DemoComplete } from './DemoComplete';

const viewComponents = {
  'search': DemoSearch,
  'property-details': DemoPropertyDetails,
  'document-generation': DemoDocumentGeneration,
  'signature': DemoSignature,
  'transaction-complete': DemoComplete,
} as const;

export const DemoContainer = () => {
  const { currentView, currentScenario, isAutoProgressing } = useDemoController();

  // Remove automatic demo start - scenarios are now controlled manually
  useEffect(() => {
    // Optional: Add any initialization logic here if needed
  }, []);

  const CurrentView = viewComponents[currentView as keyof typeof viewComponents] || DemoSearch;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scenario Status Indicator */}
      <div className="fixed top-4 right-4 z-40">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-mono border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Scenario:</span>
            <span className="font-medium text-gray-900">
              {currentScenario === 'happy-path' ? 'Happy Path' :
               currentScenario === 'power-user' ? 'Power User' :
               'Problem Demo'}
            </span>
            {isAutoProgressing && (
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
          </div>
        </div>
      </div>

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