import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoController } from '../stores/demoController';

interface WelcomeScreenProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  onScenarioSelect: (scenario: 'happy-path' | 'power-user' | 'problem-demo') => void;
  onAIDiscovery: () => void;
  onLogout: () => void;
}

const scenarios = [
  {
    id: 'happy-path' as const,
    number: '1',
    title: 'The 5-Minute Miracle',
    subtitle: 'Happy Path Demo',
    duration: '90 seconds',
    description: 'Watch a complete offer process that normally takes 2-3 hours. Experience the seamless property search to signed contract workflow.',
    roiMetrics: '90 seconds | Saves $400/transaction',
    highlights: [
      'Instant property search and analysis',
      'Automated document generation',
      'Digital signature workflow',
      'Complete transaction in 5 minutes'
    ],
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    icon: '⏱️'
  },
  {
    id: 'power-user' as const,
    number: '2', 
    title: 'Advanced Features Demo',
    subtitle: 'Power User Experience',
    duration: '3 minutes',
    description: 'Explore multiple properties, comparisons, and customization options. Demonstrates professional tools and flexibility.',
    roiMetrics: '3 minutes | 10x faster than competitors',
    highlights: [
      'Multi-property comparison',
      'Advanced filtering and analysis',
      'Custom document templates',
      'Professional workflow tools'
    ],
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'from-blue-50 to-indigo-50', 
    borderColor: 'border-blue-200',
    icon: '🔧'
  },
  {
    id: 'problem-demo' as const,
    number: '3',
    title: 'The $10,000 Time Savings Demo',
    subtitle: 'Problem/Solution Demo',
    duration: '30 seconds',
    description: 'See exactly how much money and time agents save per transaction. Dramatic contrast between traditional real estate chaos and our automated solution.',
    roiMetrics: '30 seconds | ROI: 847% time savings',
    highlights: [
      'Traditional process problems',
      'Manual workflow frustrations', 
      'Instant transformation reveal',
      'ROI and efficiency metrics'
    ],
    color: 'from-orange-500 to-red-600',
    bgColor: 'from-orange-50 to-red-50',
    borderColor: 'border-orange-200', 
    icon: '📊'
  }
];

// Simple icon components
const HelpCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <circle cx="12" cy="17" r="1"></circle>
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const WelcomeScreen = ({ user, onScenarioSelect, onAIDiscovery, onLogout }: WelcomeScreenProps) => {
  const { resetDemo, startScenario } = useDemoController();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleScenarioSelect = (scenarioId: 'happy-path' | 'power-user' | 'problem-demo') => {
    resetDemo();
    onScenarioSelect(scenarioId);
    // Auto-start the demo scenario
    setTimeout(() => {
      startScenario();
    }, 100); // Small delay to ensure scenario is set
  };

  // Keyboard shortcuts
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === '1') handleScenarioSelect('happy-path');
    if (event.key === '2') handleScenarioSelect('power-user');
    if (event.key === '3') handleScenarioSelect('problem-demo');
  };

  // Add keyboard event listener
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Panel control
  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  // Escape key to close panel
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPanelOpen) {
        setIsPanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isPanelOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-xl">🏠</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 reale-logo">Reale Agent</h1>
                <p className="text-xs text-gray-600 reale-tagline">by Reale AI</p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1976d2&color=fff&size=150`;
                  }}
                />
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-600">{user.role}</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            See How Top Agents Close Deals in Minutes
          </h1>
          <p className="text-xl text-blue-100 mb-2">
            Choose your demonstration scenario
          </p>
          <p className="text-blue-200 text-sm">
            Press 1, 2, or 3 on your keyboard for quick selection
          </p>
        </motion.div>

        {/* AI Discovery Demo Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center text-white">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                  <path d="M18 8H6C4.9 8 4 8.9 4 10V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM8 16C7.4 16 7 15.6 7 15S7.4 14 8 14S9 14.4 9 15S8.6 16 8 16ZM16 16C15.4 16 15 15.6 15 15S15.4 14 16 14S17 14.4 17 15S16.6 16 16 16ZM16 12H8V11H16V12Z"/>
                  <circle cx="8" cy="11" r="1"/>
                  <circle cx="16" cy="11" r="1"/>
                </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Meet ARIA First</h2>
                  <p className="text-lg text-purple-100">Experience AI-Powered Property Discovery</p>
                </div>
              </div>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Before diving into the efficiency demos, see how ARIA understands client needs and discovers the perfect property match through natural conversation.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAIDiscovery}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                🚀 Experience ARIA's Intelligence
              </motion.button>
              <p className="text-sm text-purple-200 mt-3">
                2-minute conversation • See the magic before the efficiency
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scenario Cards - FAANG-Inspired Horizontal Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`demo-card-horizontal bg-gradient-to-br ${scenario.bgColor} rounded-2xl shadow-xl border-2 ${scenario.borderColor} overflow-hidden cursor-pointer relative h-full flex flex-col`}
              onClick={() => handleScenarioSelect(scenario.id)}
            >
              {/* Bold Number Badge - Top Left */}
              <div className={`absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br ${scenario.color} rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10`}>
                <span className="text-white font-black text-2xl">{scenario.number}</span>
              </div>

              {/* Card Header - Compact Horizontal Design */}
              <div className={`bg-gradient-to-r ${scenario.color} p-6 text-white flex-shrink-0`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{scenario.icon}</div>
                  <div className="text-right">
                    <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                      {scenario.duration}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 leading-tight">{scenario.title}</h3>
                <p className="text-sm opacity-90 font-medium">{scenario.subtitle}</p>
              </div>

              {/* Card Body - Optimized for Horizontal Scanning */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                    {scenario.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-gradient-to-r ${scenario.color} text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    Start {scenario.duration === '90 seconds' ? '90-Second' : scenario.duration === '3 minutes' ? '3-Minute' : '30-Second'} Demo
                  </motion.button>

                  {/* ROI Metrics Badge - Bottom Position */}
                  <div className={`text-xs font-semibold text-center py-2 px-3 rounded-lg ${
                    scenario.id === 'happy-path' ? 'text-green-700 bg-green-100 border border-green-200' :
                    scenario.id === 'power-user' ? 'text-blue-700 bg-blue-100 border border-blue-200' :
                    'text-orange-700 bg-orange-100 border border-orange-200'
                  }`}>
                    {scenario.roiMetrics}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Help Button */}
      <button
        onClick={togglePanel}
        className="fixed bottom-4 left-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-40"
        aria-label="Open presenter guide"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={togglePanel}
          />
        )}
      </AnimatePresence>

      {/* Slide-Out Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 sm:w-96 lg:w-80 bg-gradient-to-b from-blue-900/95 to-purple-900/95 backdrop-blur-lg transform transition-transform duration-300 z-50 ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                📋 Presenter Guide
              </h2>
              <button 
                onClick={togglePanel} 
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Close presenter guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-2">Master your demo with these controls</p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Speed Controls Section */}
            <div>
              <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                ⚡ Speed Controls
              </h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-4 border-l-4 border-green-400">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">Normal Speed</span>
                    <kbd className="bg-white/20 px-2 py-1 rounded text-xs text-white">Default</kbd>
                  </div>
                  <p className="text-blue-200 text-sm">Perfect for first-time viewers. Realistic pace that builds credibility.</p>
                  <p className="text-green-300 text-xs mt-1">💡 Best for: Initial investor presentations</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border-l-4 border-yellow-400">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">Fast Speed</span>
                    <kbd className="bg-white/20 px-2 py-1 rounded text-xs text-white">F Key</kbd>
                  </div>
                  <p className="text-blue-200 text-sm">Great for follow-up demos or experienced audiences.</p>
                  <p className="text-yellow-300 text-xs mt-1">💡 Best for: Second meetings, technical teams</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border-l-4 border-red-400">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">Instant Speed</span>
                    <kbd className="bg-white/20 px-2 py-1 rounded text-xs text-white">I Key</kbd>
                  </div>
                  <p className="text-blue-200 text-sm">Jump directly to results for quick feature highlights.</p>
                  <p className="text-red-300 text-xs mt-1">💡 Best for: Specific feature demos, time-pressed meetings</p>
                </div>
              </div>
            </div>

            {/* Emergency Controls Section */}
            <div>
              <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                🚨 Emergency Controls
              </h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">Jump to Document Generation</span>
                    <kbd className="bg-white/20 px-2 py-1 rounded text-xs text-white">Ctrl+1</kbd>
                  </div>
                  <p className="text-blue-200 text-sm">Skip to the "magic moment" of automated document creation.</p>
                  <p className="text-orange-300 text-xs mt-1">🎯 Use when: "How does the automation actually work?"</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">Jump to Success State</span>
                    <kbd className="bg-white/20 px-2 py-1 rounded text-xs text-white">Ctrl+2</kbd>
                  </div>
                  <p className="text-blue-200 text-sm">Show final results and completion metrics instantly.</p>
                  <p className="text-orange-300 text-xs mt-1">🎯 Use when: Need to show ROI quickly</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">Reset Demo</span>
                    <kbd className="bg-white/20 px-2 py-1 rounded text-xs text-white">Ctrl+R</kbd>
                  </div>
                  <p className="text-blue-200 text-sm">Fresh start for new audience or if demo gets stuck.</p>
                  <p className="text-orange-300 text-xs mt-1">🎯 Use when: Technical issues or new presentation</p>
                </div>
              </div>
            </div>

            {/* Metrics Overlay Section */}
            <div>
              <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                📊 Performance Metrics
              </h3>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">Show/Hide Metrics Overlay</span>
                  <kbd className="bg-white/20 px-2 py-1 rounded text-xs text-white">Ctrl+D</kbd>
                </div>
                <p className="text-blue-200 text-sm">Toggle stealth mode - reveal real-time time savings and ROI data.</p>
                <div className="mt-3 space-y-1 text-xs">
                  <p className="text-purple-300">📈 Shows: Time elapsed, time saved, cost savings</p>
                  <p className="text-purple-300">⚡ Updates: Real-time during demo progression</p>
                  <p className="text-purple-300">🎯 Perfect for: "How much time does this actually save?"</p>
                </div>
              </div>
            </div>

            {/* Pro Tips Section */}
            <div>
              <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                💡 Pro Presenter Tips
              </h3>
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 border border-purple-400/30">
                <ul className="space-y-2 text-sm text-blue-200">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Start with Normal speed to build credibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Keep Ctrl+D ready for ROI questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Use Instant speed for "wow" moments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Practice all shortcuts before demo day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">⚡</span>
                    <span>Have Ctrl+1 ready if they ask "show me the automation"</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 