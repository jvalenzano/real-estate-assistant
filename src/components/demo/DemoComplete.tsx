import { motion } from 'framer-motion'
import { useDemoController } from '../../stores/demoController'

export function DemoComplete() {
  const { metrics, currentScenario } = useDemoController()
  const isProblemDemo = currentScenario === 'problem-demo'

  if (isProblemDemo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-4xl mx-auto p-6"
      >
        {/* Problem Demo Success Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">🎉 TRANSFORMATION COMPLETE! 🎉</h1>
          <p className="text-xl text-gray-600 mb-2">From 2-3 hours to 5 minutes</p>
          <p className="text-lg text-green-600 font-semibold">The future of real estate is here!</p>
        </div>

        {/* Dramatic Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200 text-center"
          >
            <div className="text-4xl font-bold text-green-600 mb-2">97%</div>
            <div className="text-sm font-medium text-green-800">Time Reduction</div>
            <div className="text-xs text-green-600 mt-1">2-3 hrs → 5 min</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200 text-center"
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">94%</div>
            <div className="text-sm font-medium text-blue-800">Error Reduction</div>
            <div className="text-xs text-blue-600 mt-1">15-20 → 1-2 errors</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border-2 border-yellow-200 text-center"
          >
            <div className="text-4xl font-bold text-yellow-600 mb-2">85%</div>
            <div className="text-sm font-medium text-yellow-800">Cost Savings</div>
            <div className="text-xs text-yellow-600 mt-1">$500-800 → $50-100</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200 text-center"
          >
            <div className="text-4xl font-bold text-purple-600 mb-2">109%</div>
            <div className="text-sm font-medium text-purple-800">Satisfaction Boost</div>
            <div className="text-xs text-purple-600 mt-1">2.3 → 4.8 stars</div>
          </motion.div>
        </div>

        {/* ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-8 text-white text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">💰 INCREDIBLE ROI POTENTIAL 💰</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">$450-700</div>
              <div className="text-sm opacity-90">Saved per transaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold">×100</div>
              <div className="text-sm opacity-90">Transactions per year</div>
            </div>
            <div>
              <div className="text-4xl font-bold">$45K-70K</div>
              <div className="text-sm opacity-90">Annual savings</div>
            </div>
          </div>
          <div className="mt-6 text-lg font-semibold">
            🚀 Break-even in just 2-3 transactions!
          </div>
        </motion.div>

        {/* Investment Opportunity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-gray-900 text-white rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">🎯 Ready to Transform Your Business?</h2>
          <p className="text-lg mb-6 text-gray-300">
            Join the real estate revolution. Be among the first to offer 5-minute transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
              🚀 Schedule Investment Call
            </button>
            <button className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              📊 See Full Demo
            </button>
            <button className="px-8 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors">
              💼 Request Proposal
            </button>
          </div>
        </motion.div>

        {/* Competitive Advantage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-yellow-800 mb-3">⚡ First-Mover Advantage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div>
              <p>✅ Capture market share before competitors</p>
              <p>✅ Attract top agents with cutting-edge tools</p>
              <p>✅ Increase transaction volume by 300%</p>
            </div>
            <div>
              <p>✅ Reduce operational costs dramatically</p>
              <p>✅ Improve client satisfaction scores</p>
              <p>✅ Scale without proportional staff increases</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

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