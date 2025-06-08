import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoController } from '../stores/demoController';

interface ARIAMessage {
  id: string;
  title: string;
  content: string[];
  metrics?: string;
  scenario: 'happy-path' | 'power-user' | 'problem-demo';
  view: string;
  timing: number; // milliseconds after view loads
}

// ARIA intervention messages based on strategic framework
const ariaMessages: ARIAMessage[] = [
  // Happy Path - Property Search (8s mark)
  {
    id: 'happy-path-search',
    title: 'Sarah, I just analyzed 2,847 properties in 0.3 seconds!',
    content: [
      'While you\'d normally be making 15+ phone calls to check availability, I\'ve already:',
      '✅ Verified this property is active',
      '✅ Pulled comparable sales data',
      '✅ Calculated investment metrics',
      '✅ Checked school district ratings'
    ],
    metrics: 'This alone saves you 45 minutes of research time.',
    scenario: 'happy-path',
    view: 'search',
    timing: 4000
  },
  
  // Happy Path - Document Generation (25s mark)
  {
    id: 'happy-path-documents',
    title: 'This is the magic moment, Sarah! 🎉',
    content: [
      'I\'m generating 12 legal documents simultaneously:',
      '• Residential Purchase Agreement (RPA)',
      '• Property Disclosure Statement',
      '• Inspection Addendum',
      '• 9 additional compliance forms'
    ],
    metrics: 'Traditional lawyers charge $800-1,200 for this work. I\'m doing it perfectly in 30 seconds.',
    scenario: 'happy-path',
    view: 'document-generation',
    timing: 25000
  },

  // Happy Path - Signature Workflow (12s mark)
  {
    id: 'happy-path-signature',
    title: 'I\'m orchestrating a complex 3-party signature workflow.',
    content: [
      'Behind the scenes, I\'m:',
      '📧 Sending personalized emails to all parties',
      '📋 Including property photos and key details',
      '⏰ Setting up automated reminders',
      '📊 Tracking completion status in real-time'
    ],
    metrics: 'No more "Did everyone sign yet?" phone calls!',
    scenario: 'happy-path',
    view: 'signature',
    timing: 12000
  },

  // Power User - Property Comparison (25s mark)
  {
    id: 'power-user-comparison',
    title: 'Mike, I\'ve run advanced investment analysis on all 3 properties.',
    content: [
      '🏆 My recommendation: 7890 Oak Avenue',
      '',
      'Here\'s why it\'s superior:',
      '• ROI: 9.2% vs 8.4% (Circle R) vs 7.8% (Maple)',
      '• Cap Rate: 6.8% (highest of the three)',
      '• Appreciation Trend: +5.1% annually (above market)',
      '• Rental Demand: 97% occupancy rate in this area'
    ],
    metrics: 'This analysis would take a traditional agent 3+ hours.',
    scenario: 'power-user',
    view: 'property-details',
    timing: 25000
  },

  // Power User - RPA Customization (40s mark)
  {
    id: 'power-user-customization',
    title: 'I notice this is a cash offer over $1M. Let me suggest power user optimizations:',
    content: [
      'Recommended Customizations:',
      '⚡ Inspection Period: 7 days → 5 days (competitive advantage)',
      '📅 Closing Timeline: 30 days → 21 days (seller preference)',
      '💰 Earnest Money: Standard 1% → 2% (stronger offer)',
      '📋 Contingencies: Remove appraisal (cash deal strength)'
    ],
    metrics: 'These optimizations increase acceptance probability by 34%.',
    scenario: 'power-user',
    view: 'document-generation',
    timing: 40000
  },

  // Problem Demo - Traditional Workflow Pain (5s mark)
  {
    id: 'problem-demo-pain',
    title: 'This is what real estate professionals face every single day.',
    content: [
      'The Traditional Reality:',
      '⏰ 2-3 hours per transaction minimum',
      '📋 47 manual steps with high error rates',
      '💸 $500-800 in hidden costs per deal',
      '😰 15-20 errors per transaction average',
      '📞 Countless phone calls and follow-ups'
    ],
    metrics: 'This outdated process is costing the industry $8.2 billion annually.',
    scenario: 'problem-demo',
    view: 'search',
    timing: 5000
  },

  // Problem Demo - Solution Reveal (15s mark)
  {
    id: 'problem-demo-solution',
    title: 'Now watch what happens with Reale AI automation!',
    content: [
      'The Automated Reality:',
      '⚡ 5 minutes total transaction time',
      '🤖 3 automated steps with zero errors',
      '💰 $50-100 total processing cost',
      '🎯 99.7% accuracy rate guaranteed',
      '📱 One-touch workflow from search to signature'
    ],
    metrics: 'Same transaction. 97% faster. 90% fewer errors. 85% cost reduction.',
    scenario: 'problem-demo',
    view: 'property-details',
    timing: 15000
  }
];

export const ARIAAssistant = () => {
  const { currentScenario, currentView, isRunning } = useDemoController();
  const [currentMessage, setCurrentMessage] = useState<ARIAMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewStartTime, setViewStartTime] = useState<number>(0);

  // Track when view changes to reset timing
  useEffect(() => {
    setViewStartTime(Date.now());
    setCurrentMessage(null);
    setIsVisible(false);
    setDisplayText('');
    setIsTyping(false);
  }, [currentView]);

  // Find and show appropriate ARIA message
  useEffect(() => {
    if (!isRunning || !currentScenario) return;

    const relevantMessage = ariaMessages.find(
      msg => msg.scenario === currentScenario && msg.view === currentView
    );

    if (!relevantMessage) return;

    const timer = setTimeout(() => {
      setCurrentMessage(relevantMessage);
      setIsVisible(true);
      setIsTyping(true);
      
      // Typing animation for the content
      const fullText = relevantMessage.content.join('\n');
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30); // 30ms per character for realistic typing

      return () => clearInterval(typingInterval);
    }, relevantMessage.timing);

    return () => clearTimeout(timer);
  }, [currentScenario, currentView, isRunning, viewStartTime]);

  // Auto-hide after 15 seconds
  useEffect(() => {
    if (!isVisible) return;

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 15000);

    return () => clearTimeout(hideTimer);
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!currentMessage || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 400, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-20 right-4 w-80 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-2xl p-4 border border-white/20 z-[60]"
      >
        {/* ARIA Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                <path d="M18 8H6C4.9 8 4 8.9 4 10V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM8 16C7.4 16 7 15.6 7 15S7.4 14 8 14S9 14.4 9 15S8.6 16 8 16ZM16 16C15.4 16 15 15.6 15 15S15.4 14 16 14S17 14.4 17 15S16.6 16 16 16ZM16 12H8V11H16V12Z"/>
                <circle cx="8" cy="11" r="1"/>
                <circle cx="16" cy="11" r="1"/>
              </svg>
            </div>
                          <div>
                <div className="font-bold text-lg tracking-wide text-white drop-shadow-lg">ARIA</div>
                <div className="text-xs text-white/80">AI Real Estate Assistant</div>
              </div>
          </div>
          <button
            onClick={handleDismiss}
            className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message Title */}
        <div className="font-bold text-sm mb-2 leading-tight">
          {currentMessage.title}
        </div>

        {/* Message Content */}
        <div className="text-sm leading-relaxed mb-3 min-h-[120px]">
          <pre className="whitespace-pre-wrap font-sans text-white/90">
            {displayText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-white ml-1"
              />
            )}
          </pre>
        </div>

        {/* Metrics */}
        {currentMessage.metrics && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs bg-white/20 rounded-lg p-2 font-medium"
          >
            💡 {currentMessage.metrics}
          </motion.div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-1 text-xs text-white/70">
            <div className="flex gap-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-1 h-1 bg-white/70 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-1 h-1 bg-white/70 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-1 h-1 bg-white/70 rounded-full"
              />
            </div>
            <span>ARIA is analyzing...</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}; 