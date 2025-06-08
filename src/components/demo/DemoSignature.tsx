import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoController } from '../../stores/demoController';

// Document types for Power User scenario
interface SignatureDocument {
  id: string;
  name: string;
  type: 'RPA' | 'Disclosure' | 'Addendum' | 'Inspection';
  required: boolean;
  signed: boolean;
  signingOrder: number;
}

// Power User documents (more comprehensive)
const powerUserDocuments: SignatureDocument[] = [
  { id: 'rpa', name: 'Residential Purchase Agreement', type: 'RPA', required: true, signed: false, signingOrder: 1 },
  { id: 'disclosure', name: 'Property Disclosure Statement', type: 'Disclosure', required: true, signed: false, signingOrder: 2 },
  { id: 'inspection', name: 'Inspection Addendum', type: 'Addendum', required: true, signed: false, signingOrder: 3 },
  { id: 'financing', name: 'Financing Addendum', type: 'Addendum', required: true, signed: false, signingOrder: 4 }
];

// Happy Path documents (simplified)
const happyPathDocuments: SignatureDocument[] = [
  { id: 'rpa', name: 'Residential Purchase Agreement', type: 'RPA', required: true, signed: false, signingOrder: 1 }
];

export const DemoSignature = () => {
  const { trackAction, demoSpeed, currentScenario } = useDemoController();
  const [signatures, setSignatures] = useState({
    buyer: false,
    seller: false,
    agent: false
  });
  const [currentSigner, setCurrentSigner] = useState<'buyer' | 'seller' | 'agent' | null>(null);
  const [documents, setDocuments] = useState<SignatureDocument[]>([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [signatureProgress, setSignatureProgress] = useState(0);

  // Power User scenario logic
  const isPowerUser = currentScenario === 'power-user';

  // Initialize documents based on scenario
  useEffect(() => {
    setDocuments(isPowerUser ? powerUserDocuments : happyPathDocuments);
  }, [isPowerUser]);

  // Auto-advance demo based on speed and scenario
  useEffect(() => {
    const timers: number[] = [];
    const baseTiming = {
      normal: isPowerUser ? 45000 : 3000, // 45s for power user, 3s for happy path
      fast: isPowerUser ? 22500 : 1500,
      instant: isPowerUser ? 4500 : 500
    }[demoSpeed];

    if (isPowerUser) {
      // Power User: Enhanced signature workflow with multiple documents
      const totalSteps = documents.length * 3; // 3 signers per document
      let stepIndex = 0;

      documents.forEach((doc, docIndex) => {
        ['buyer', 'seller', 'agent'].forEach((signer, signerIndex) => {
          const currentStepNumber = stepIndex;
          const stepDelay = (currentStepNumber * baseTiming) / totalSteps;
          
          // Start signing
          timers.push(
            window.setTimeout(() => {
              setCurrentDocumentIndex(docIndex);
              setCurrentSigner(signer as 'buyer' | 'seller' | 'agent');
              if (currentStepNumber === 0) trackAction('signature_workflow');
            }, stepDelay)
          );

          // Complete signing
          timers.push(
            window.setTimeout(() => {
              setSignatures(prev => ({ ...prev, [signer]: true }));
              
              // Calculate progress based on this specific step (capped at 100%)
              const progressPercentage = Math.min(((currentStepNumber + 1) / totalSteps) * 100, 100);
              setSignatureProgress(progressPercentage);
              
              // Mark document as signed when all signers complete
              if (signerIndex === 2) {
                setDocuments(prev => prev.map((d, i) => 
                  i === docIndex ? { ...d, signed: true } : d
                ));
              }
              
              // Complete transaction when all done
              if (currentStepNumber === totalSteps - 1) {
                trackAction('transaction_completed');
              }
              
              setCurrentSigner(null);
            }, stepDelay + baseTiming / totalSteps * 0.7)
          );

          stepIndex++;
        });
      });
    } else {
      // Happy Path: Simple signature workflow
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
    }

    return () => timers.forEach(clearTimeout);
  }, [demoSpeed, trackAction, signatures, isPowerUser, documents]);

  const allSignaturesComplete = signatures.buyer && signatures.seller && signatures.agent;
  const allDocumentsSigned = documents.every(doc => doc.signed);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isPowerUser ? 'Enhanced Digital Signatures' : 'Digital Signatures'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isPowerUser 
                  ? 'Complete the transaction with secure digital signatures across multiple documents'
                  : 'Complete the transaction with secure digital signatures'
                }
              </p>
            </div>
            {isPowerUser && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-lg font-bold text-purple-600">
                  {Math.round(signatureProgress)}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Power User: Document Progress */}
        {isPowerUser && (
          <div className="p-6 border-b border-gray-200 bg-purple-50">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Document Signing Progress</h3>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    doc.signed 
                      ? 'border-green-200 bg-green-50'
                      : index === currentDocumentIndex
                        ? 'border-purple-200 bg-purple-100'
                        : 'border-gray-200 bg-white'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      doc.signed 
                        ? 'bg-green-600 text-white'
                        : index === currentDocumentIndex
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                    }`}>
                      {doc.signed ? '✓' : index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{doc.name}</div>
                      <div className="text-sm text-gray-500">{doc.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.signed && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Complete
                      </span>
                    )}
                    {index === currentDocumentIndex && !doc.signed && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded animate-pulse">
                        Signing...
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Signature Status */}
        <div className="p-6 space-y-6">
          {/* Current Document Context for Power User */}
          {isPowerUser && documents[currentDocumentIndex] && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900">
                Currently Signing: {documents[currentDocumentIndex].name}
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Document {currentDocumentIndex + 1} of {documents.length}
              </p>
            </div>
          )}

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
                {isPowerUser && (
                  <p className="text-xs text-gray-500 mt-1">
                    Primary purchaser and decision maker
                  </p>
                )}
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
                {isPowerUser && (
                  <p className="text-xs text-gray-500 mt-1">
                    Property owner and seller representative
                  </p>
                )}
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
                {isPowerUser && (
                  <p className="text-xs text-gray-500 mt-1">
                    Licensed real estate agent and transaction coordinator
                  </p>
                )}
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
          {(isPowerUser ? allDocumentsSigned : allSignaturesComplete) && (
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
                  <div className="font-medium text-green-900">
                    {isPowerUser ? 'All Documents Signed Successfully!' : 'All Signatures Complete!'}
                  </div>
                  <div className="text-sm text-green-700">
                    {isPowerUser 
                      ? `${documents.length} documents signed by all parties. Transaction ready for closing.`
                      : 'Transaction is now complete and ready for closing.'
                    }
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 