import { motion } from 'framer-motion'
import { useDemoController } from '../../stores/demoController'

export function DemoComplete() {
  const { metrics } = useDemoController()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction Complete!</h2>
        <p className="text-gray-600">Your real estate transaction has been successfully processed.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 p-4 rounded-lg"
        >
          <div className="text-sm font-medium text-blue-700">Time Saved</div>
          <div className="text-2xl font-bold text-blue-900">{metrics.timeSaved}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 p-4 rounded-lg"
        >
          <div className="text-sm font-medium text-green-700">Documents Generated</div>
          <div className="text-2xl font-bold text-green-900">{metrics.documentsGenerated}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-purple-50 p-4 rounded-lg"
        >
          <div className="text-sm font-medium text-purple-700">Steps Completed</div>
          <div className="text-2xl font-bold text-purple-900">{metrics.stepsCompleted}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-orange-50 p-4 rounded-lg"
        >
          <div className="text-sm font-medium text-orange-700">Total Time</div>
          <div className="text-2xl font-bold text-orange-900">{metrics.timeSpent}s</div>
        </motion.div>
      </div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-50 p-6 rounded-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600">Review all generated documents in your dashboard</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600">Share documents with all parties involved</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600">Schedule a follow-up call with your agent</span>
          </li>
        </ul>
      </motion.div>

      {/* Feedback Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-500">
          How was your experience? We'd love to hear your feedback!
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Share Feedback
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
            Start New Transaction
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
} 