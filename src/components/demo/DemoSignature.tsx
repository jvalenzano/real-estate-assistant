import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoController } from '../../stores/demoController';

export const DemoSignature = () => {
  const { trackAction, demoSpeed } = useDemoController();
  const [signatures, setSignatures] = useState({
    buyer: false,
    seller: false,
    agent: false
  });
  const [currentSigner, setCurrentSigner] = useState<'buyer' | 'seller' | 'agent' | null>(null);

  // Auto-advance demo based on speed
  useEffect(() => {
    const timers: number[] = [];
    const baseTiming = {
      normal: 3000,
      fast: 1500,
      instant: 500
    }[demoSpeed];

    // Simulate signature workflow
    if (!signatures.buyer) {
      timers.push(
        window.setTimeout(() => {
          setCurrentSigner('buyer');
          trackAction('signature_workflow');
        }, baseTiming)
      );
      timers.push(
        window.setTimeout(() => {
          setSignatures(prev => ({ ...prev, buyer: true }));
          setCurrentSigner(null);
        }, baseTiming * 2)
      );
    } else if (!signatures.seller) {
      timers.push(
        window.setTimeout(() => {
          setCurrentSigner('seller');
        }, baseTiming)
      );
      timers.push(
        window.setTimeout(() => {
          setSignatures(prev => ({ ...prev, seller: true }));
          setCurrentSigner(null);
        }, baseTiming * 2)
      );
    } else if (!signatures.agent) {
      timers.push(
        window.setTimeout(() => {
          setCurrentSigner('agent');
        }, baseTiming)
      );
      timers.push(
        window.setTimeout(() => {
          setSignatures(prev => ({ ...prev, agent: true }));
          setCurrentSigner(null);
          trackAction('transaction_completed');
        }, baseTiming * 2)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [demoSpeed, trackAction, signatures]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Digital Signatures</h1>
          <p className="text-gray-600 mt-1">Complete the transaction with secure digital signatures</p>
        </div>

        {/* Signature Status */}
        <div className="p-6 space-y-6">
          {/* Buyer Signature */}
          <div className={`p-4 rounded-lg border ${
            signatures.buyer 
              ? 'border-green-200 bg-green-50' 
              : currentSigner === 'buyer'
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Buyer Signature</h3>
                <p className="text-sm text-gray-600">John Smith</p>
              </div>
              <div className="flex items-center">
                {signatures.buyer ? (
                  <div className="text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : currentSigner === 'buyer' ? (
                  <div className="text-blue-600 animate-pulse">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seller Signature */}
          <div className={`p-4 rounded-lg border ${
            signatures.seller 
              ? 'border-green-200 bg-green-50' 
              : currentSigner === 'seller'
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Seller Signature</h3>
                <p className="text-sm text-gray-600">Jane Doe</p>
              </div>
              <div className="flex items-center">
                {signatures.seller ? (
                  <div className="text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : currentSigner === 'seller' ? (
                  <div className="text-blue-600 animate-pulse">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Agent Signature */}
          <div className={`p-4 rounded-lg border ${
            signatures.agent 
              ? 'border-green-200 bg-green-50' 
              : currentSigner === 'agent'
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Agent Signature</h3>
                <p className="text-sm text-gray-600">Sarah Johnson</p>
              </div>
              <div className="flex items-center">
                {signatures.agent ? (
                  <div className="text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : currentSigner === 'agent' ? (
                  <div className="text-blue-600 animate-pulse">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {signatures.agent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 bg-green-50 border-t border-green-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-green-900">All Signatures Complete</div>
                  <div className="text-sm text-green-600">Transaction is now legally binding</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 