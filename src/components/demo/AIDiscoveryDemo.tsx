import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIDiscoveryDemoProps {
  onComplete: () => void;
  onScenarioSelect: (scenario: 'happy-path' | 'power-user' | 'problem-demo') => void;
  demoSpeed: 'normal' | 'fast' | 'instant';
}

interface DemoMessage {
  id: number;
  sender: 'client' | 'ai';
  message: string;
  delay: number;
  typing?: number;
}

// Scripted conversation leading to 8615 Circle R discovery
const demoConversation: DemoMessage[] = [
  {
    id: 1,
    sender: "client",
    message: "Hi! We're looking for our first family home in San Diego. We have two young kids.",
    delay: 1000
  },
  {
    id: 2,
    sender: "ai",
    message: "I'd love to help you find the perfect family home! Tell me about your ideal lifestyle and what matters most to your family.",
    delay: 2000,
    typing: 1500
  },
  {
    id: 3,
    sender: "client", 
    message: "We need great schools, a safe neighborhood, and my husband commutes to downtown. A backyard for the kids would be amazing!",
    delay: 3000
  },
  {
    id: 4,
    sender: "ai",
    message: "Perfect! I'm analyzing properties that match your family's needs... 🏡",
    delay: 2000,
    typing: 1000
  },
  {
    id: 5,
    sender: "ai",
    message: "I found something special! 8615 Circle R Course Ln has everything you described:",
    delay: 4000,
    typing: 2000
  },
  {
    id: 6,
    sender: "ai",
    message: "✅ Top-rated schools (Poway Unified - 9.2/10 rating)\n✅ Family-friendly neighborhood (95% families)\n✅ 25-minute commute to downtown\n✅ Large backyard (0.25 acres)\n✅ 4 bedrooms, 3 baths, 2,450 sqft\n✅ Recently renovated, move-in ready",
    delay: 3000,
    typing: 2500
  },
  {
    id: 7,
    sender: "client",
    message: "That sounds absolutely perfect! Can we see it today?",
    delay: 2000
  },
  {
    id: 8,
    sender: "ai",
    message: "Absolutely! I'm generating all the paperwork now so we can move quickly if you love it. Let me show you the property details and we can have an offer ready in minutes! 🚀",
    delay: 2000,
    typing: 1500
  }
];

interface ChatMessage {
  message: string;
  sentTime: string;
  sender: string;
  direction: 'incoming' | 'outgoing';
  position: 'single';
}

export const AIDiscoveryDemo = ({ onComplete, onScenarioSelect, demoSpeed }: AIDiscoveryDemoProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Adjust timing based on demo speed
  const getAdjustedTiming = (originalTime: number) => {
    switch (demoSpeed) {
      case 'fast': return originalTime * 0.5;
      case 'instant': return originalTime * 0.1;
      default: return originalTime;
    }
  };

  useEffect(() => {
    if (currentStep < demoConversation.length && !isComplete) {
      const currentMessage = demoConversation[currentStep];
      
      const timer = setTimeout(() => {
        if (currentMessage.sender === 'ai') {
          // Show thinking dots first for AI responses
          setIsThinking(true);
          
          setTimeout(() => {
            setIsThinking(false);
            
            if (currentMessage.typing) {
              setIsTyping(true);
              
              setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, {
                  message: currentMessage.message,
                  sentTime: "just now",
                  sender: 'ARIA',
                  direction: 'incoming',
                  position: 'single'
                }]);
                setCurrentStep(prev => prev + 1);
              }, getAdjustedTiming(currentMessage.typing));
            } else {
              setMessages(prev => [...prev, {
                message: currentMessage.message,
                sentTime: "just now",
                sender: 'ARIA',
                direction: 'incoming',
                position: 'single'
              }]);
              setCurrentStep(prev => prev + 1);
            }
          }, getAdjustedTiming(1500)); // 1.5 seconds of thinking
        } else {
          // Client messages appear immediately
          setMessages(prev => [...prev, {
            message: currentMessage.message,
            sentTime: "just now", 
            sender: 'Sarah & Mike',
            direction: 'outgoing',
            position: 'single'
          }]);
          setCurrentStep(prev => prev + 1);
        }
      }, getAdjustedTiming(currentMessage.delay));

      return () => clearTimeout(timer);
    } else if (currentStep >= demoConversation.length && !isComplete) {
      // Conversation complete
      setIsComplete(true);
      setTimeout(() => setShowContinue(true), getAdjustedTiming(2000));
    }
  }, [currentStep, demoSpeed, isComplete]);



  const handleRestart = () => {
    setMessages([]);
    setCurrentStep(0);
    setIsTyping(false);
    setIsThinking(false);
    setShowContinue(false);
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                <path d="M18 8H6C4.9 8 4 8.9 4 10V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM8 16C7.4 16 7 15.6 7 15S7.4 14 8 14S9 14.4 9 15S8.6 16 8 16ZM16 16C15.4 16 15 15.6 15 15S15.4 14 16 14S17 14.4 17 15S16.6 16 16 16ZM16 12H8V11H16V12Z"/>
                <circle cx="8" cy="11" r="1"/>
                <circle cx="16" cy="11" r="1"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Meet ARIA
              </h1>
              <p className="text-lg text-gray-600">
                Your AI Real Estate Assistant
              </p>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch ARIA understand client needs and discover the perfect property match in real-time
          </p>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                    <path d="M18 8H6C4.9 8 4 8.9 4 10V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM8 16C7.4 16 7 15.6 7 15S7.4 14 8 14S9 14.4 9 15S8.6 16 8 16ZM16 16C15.4 16 15 15.6 15 15S15.4 14 16 14S17 14.4 17 15S16.6 16 16 16ZM16 12H8V11H16V12Z"/>
                    <circle cx="8" cy="11" r="1"/>
                    <circle cx="16" cy="11" r="1"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl tracking-wide text-white drop-shadow-lg">ARIA</h3>
                  <p className="text-sm opacity-90 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    AI Real Estate Assistant • Online
                  </p>
                </div>
                <div className="text-xs opacity-75 text-right">
                  <div>Demo Mode</div>
                  <div>Live Chat</div>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 ${message.direction === 'outgoing' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ring-2 ring-white shadow-md">
                    {message.direction === 'outgoing' ? (
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80" 
                        alt="Sarah & Mike"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                          <path d="M18 8H6C4.9 8 4 8.9 4 10V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM8 16C7.4 16 7 15.6 7 15S7.4 14 8 14S9 14.4 9 15S8.6 16 8 16ZM16 16C15.4 16 15 15.6 15 15S15.4 14 16 14S17 14.4 17 15S16.6 16 16 16ZM16 12H8V11H16V12Z"/>
                          <circle cx="8" cy="11" r="1"/>
                          <circle cx="16" cy="11" r="1"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-md ${message.direction === 'outgoing' ? 'text-right' : 'text-left'}`}>
                    {/* Sender Name */}
                    <div className={`text-xs font-medium mb-1 ${
                      message.direction === 'outgoing' 
                        ? 'text-blue-600' 
                        : 'text-purple-600'
                    }`}>
                      {message.sender}
                    </div>

                    {/* Message Content */}
                    <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                      message.direction === 'outgoing' 
                        ? 'bg-blue-500 text-white rounded-br-md' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                    }`}>
                      {/* Chat bubble tail */}
                      <div className={`absolute top-0 w-3 h-3 ${
                        message.direction === 'outgoing' 
                          ? 'right-0 bg-blue-500 transform rotate-45 translate-x-1 translate-y-2' 
                          : 'left-0 bg-white border-l border-b border-gray-200 transform rotate-45 -translate-x-1 translate-y-2'
                      }`}></div>

                      <div className="relative z-10 text-left">
                        {message.message.includes('✅') ? (
                          <div className="space-y-2">
                            {message.message.split('\n').map((line, lineIndex) => (
                              <div key={lineIndex} className="flex items-start gap-2">
                                {line.includes('✅') ? (
                                  <>
                                    <span className={`font-bold text-base mt-0.5 ${
                                      message.direction === 'outgoing' ? 'text-green-200' : 'text-green-500'
                                    }`}>✅</span>
                                    <span className="flex-1 leading-relaxed">{line.replace('✅ ', '')}</span>
                                  </>
                                ) : (
                                  <span className="leading-relaxed">{line}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="whitespace-pre-line leading-relaxed">{message.message}</div>
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className={`text-xs mt-1 ${
                      message.direction === 'outgoing' 
                        ? 'text-blue-500' 
                        : 'text-gray-500'
                    }`}>
                      {message.sentTime}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Thinking Indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  {/* ARIA Avatar */}
                  <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ring-2 ring-white shadow-md">
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                        <path d="M18 8H6C4.9 8 4 8.9 4 10V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM8 16C7.4 16 7 15.6 7 15S7.4 14 8 14S9 14.4 9 15S8.6 16 8 16ZM16 16C15.4 16 15 15.6 15 15S15.4 14 16 14S17 14.4 17 15S16.6 16 16 16ZM16 12H8V11H16V12Z"/>
                        <circle cx="8" cy="11" r="1"/>
                        <circle cx="16" cy="11" r="1"/>
                      </svg>
                    </div>
                  </div>

                  {/* Thinking Bubble */}
                  <div className="max-w-md text-left">
                    <div className="text-xs font-medium mb-1 text-purple-600">ARIA</div>
                    <div className="relative px-4 py-3 rounded-2xl rounded-bl-md shadow-sm bg-white text-gray-800 border border-gray-200">
                      {/* Chat bubble tail */}
                      <div className="absolute top-0 left-0 w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45 -translate-x-1 translate-y-2"></div>
                      
                      <div className="relative z-10 flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  {/* ARIA Avatar */}
                  <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ring-2 ring-white shadow-md">
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                        <path d="M18 8H6C4.9 8 4 8.9 4 10V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM8 16C7.4 16 7 15.6 7 15S7.4 14 8 14S9 14.4 9 15S8.6 16 8 16ZM16 16C15.4 16 15 15.6 15 15S15.4 14 16 14S17 14.4 17 15S16.6 16 16 16ZM16 12H8V11H16V12Z"/>
                        <circle cx="8" cy="11" r="1"/>
                        <circle cx="16" cy="11" r="1"/>
                      </svg>
                    </div>
                  </div>

                  {/* Typing Bubble */}
                  <div className="max-w-md text-left">
                    <div className="text-xs font-medium mb-1 text-purple-600">ARIA</div>
                    <div className="relative px-4 py-3 rounded-2xl rounded-bl-md shadow-sm bg-white text-gray-800 border border-gray-200">
                      {/* Chat bubble tail */}
                      <div className="absolute top-0 left-0 w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45 -translate-x-1 translate-y-2"></div>
                      
                      <div className="relative z-10 flex items-center gap-2">
                        <span className="text-gray-600">ARIA is analyzing and thinking</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6">
          <AnimatePresence>
            {showContinue && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Choose Your Demo Experience
                  </h3>
                  <p className="text-gray-600">
                    See how ARIA transforms different real estate scenarios
                  </p>
                </div>

                {/* Three Scenario Options - Vertical First Layout */}
                <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
                  {/* Happy Path */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                    onClick={() => onScenarioSelect('happy-path')}
                  >
                    {/* Header Section - Mixed alignment */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-white">#1</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 leading-tight text-left">
                            The 5-Minute Miracle
                          </h3>
                          <p className="text-gray-600 text-sm mt-1 text-left">
                            Happy Path Demo
                          </p>
                          <p className="text-gray-500 text-xs mt-1 text-left">
                            90 seconds
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description - LEFT ALIGNED for readability */}
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 text-sm leading-relaxed text-left">
                        Watch the complete property-to-contract workflow that normally takes 2-3 hours.
                      </p>
                    </div>
                    
                    {/* Button - CENTERED */}
                    <div className="px-6 pb-6">
                      <button className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-medium transition-colors text-center">
                        Start 90-Second Demo
                      </button>
                      {/* Stats - CENTERED */}
                      <div className="mt-3 text-center text-sm text-gray-600">
                        90 seconds | Saves $400/transaction
                      </div>
                    </div>
                  </motion.div>

                  {/* Power User */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                    onClick={() => onScenarioSelect('power-user')}
                  >
                    {/* Header Section - Mixed alignment */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-white">#2</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 leading-tight text-left">
                            Advanced Features Demo
                          </h3>
                          <p className="text-gray-600 text-sm mt-1 text-left">
                            Power User Experience
                          </p>
                          <p className="text-gray-500 text-xs mt-1 text-left">
                            3 minutes
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description - LEFT ALIGNED for readability */}
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 text-sm leading-relaxed text-left">
                        Explore multiple properties, comparisons, and professional customization tools.
                      </p>
                    </div>
                    
                    {/* Button - CENTERED */}
                    <div className="px-6 pb-6">
                      <button className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-medium transition-colors text-center">
                        Start 3-Minute Demo
                      </button>
                      {/* Stats - CENTERED */}
                      <div className="mt-3 text-center text-sm text-gray-600">
                        3 minutes | 10x faster than competitors
                      </div>
                    </div>
                  </motion.div>

                  {/* Problem Demo */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                    onClick={() => onScenarioSelect('problem-demo')}
                  >
                    {/* Header Section - Mixed alignment */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-white">#3</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 leading-tight text-left">
                            The $10,000 Time Savings Demo
                          </h3>
                          <p className="text-gray-600 text-sm mt-1 text-left">
                            Problem/Solution Demo
                          </p>
                          <p className="text-gray-500 text-xs mt-1 text-left">
                            30 seconds
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description - LEFT ALIGNED for readability */}
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 text-sm leading-relaxed text-left">
                        See the dramatic before/after comparison and ROI metrics that close deals.
                      </p>
                    </div>
                    
                    {/* Button - CENTERED */}
                    <div className="px-6 pb-6">
                      <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-lg font-medium transition-colors text-center">
                        Start 30-Second Demo
                      </button>
                      {/* Stats - CENTERED */}
                      <div className="mt-3 text-center text-sm text-gray-600">
                        30 seconds | ROI: 847% time savings
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Alternative Option */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <button
                    onClick={handleRestart}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors mr-4 border border-gray-300"
                  >
                    ↻ Restart Conversation
                  </button>
                  <button
                    onClick={onComplete}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    Skip to Property Details →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Demo Info */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            {isComplete 
              ? "Conversation complete - Continue to see ARIA in action!" 
              : `Step ${currentStep + 1} of ${demoConversation.length} - Watch ARIA understand and respond`
            }
          </p>
          <div className="flex justify-center mt-2">
            <div className="flex gap-1">
              {demoConversation.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index < currentStep ? 'bg-blue-600' : 
                    index === currentStep ? 'bg-blue-400' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 