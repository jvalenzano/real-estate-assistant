import { useEffect } from 'react';
import { useDemoController, ViewMode } from '../stores/demoController';
import { motion, AnimatePresence } from 'framer-motion';

// Smart View Toggle Button Component
const ViewToggle = () => {
  const { currentScenario, viewMode, toggleViewMode } = useDemoController();
  
  // Format scenario name for display
  const formatScenarioName = (scenario: string) => {
    const names = {
      'happy-path': 'Happy Path',
      'power-user': 'Power User', 
      'problem-demo': 'Problem Demo'
    };
    return names[scenario as keyof typeof names] || scenario;
  };

  const getButtonConfig = (mode: ViewMode) => {
    switch (mode) {
      case 'demo':
        return {
          color: 'bg-green-600 hover:bg-green-700',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          ),
          text: `Scenario: ${formatScenarioName(currentScenario)}`,
          chevron: (
            <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )
        };
      case 'metrics':
        return {
          color: 'bg-blue-600 hover:bg-blue-700',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          text: 'Performance Metrics',
          chevron: (
            <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )
        };
      case 'live-app':
      default:
        // Fallback to demo mode if somehow in live-app state
        return {
          color: 'bg-green-600 hover:bg-green-700',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          ),
          text: `Scenario: ${formatScenarioName(currentScenario)}`,
          chevron: (
            <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )
        };
    }
  };

  const config = getButtonConfig(viewMode);

  return (
    <div className="fixed bottom-6 right-6 z-[60] group">
      {/* Main FAB Button */}
      <button
        onClick={toggleViewMode}
        className={`relative w-14 h-14 rounded-full shadow-lg cursor-pointer transition-all duration-300 flex items-center justify-center text-white font-medium hover:scale-110 hover:shadow-xl ${config.color}`}
        aria-label={`Switch from ${viewMode} view`}
      >
        {config.icon}
        
        {/* Active indicator dot for metrics view */}
        {viewMode === 'metrics' && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse">
            <div className="w-full h-full bg-yellow-400 rounded-full animate-ping"></div>
          </div>
        )}
      </button>
      
      {/* Tooltip/Label that appears on hover */}
      <div className="absolute bottom-16 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className={`px-3 py-2 rounded-lg shadow-lg text-white text-sm font-medium whitespace-nowrap ${config.color.split(' ')[0]}`}>
          {config.text}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-current"></div>
        </div>
      </div>
    </div>
  );
};

interface DemoControllerProps {
  onLogout?: () => void;
}

export const DemoController = ({ onLogout }: DemoControllerProps) => {
  const {
    viewMode,
    currentScenario,
    metrics,
    demoSpeed,
    isAutoProgressing,
    isRunning,
    toggleViewMode,
    setViewMode,
    resetDemo,
    jumpToDocGeneration,
    jumpToSuccess,
    setDemoSpeed,
    setScenario,
    startScenario,
    pauseScenario,
    resumeScenario,
  } = useDemoController();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!e.ctrlKey) return;

      switch (e.key) {
        case 'd':
          e.preventDefault();
          toggleViewMode();
          break;
        case 'i': // Info view (Live App View)
          e.preventDefault();
          setViewMode('live-app');
          break;
        case '1':
          e.preventDefault();
          jumpToDocGeneration();
          break;
        case '2':
          e.preventDefault();
          jumpToSuccess();
          break;
        case 'r':
          e.preventDefault();
          resetDemo();
          break;
        case ' ': // Spacebar for play/pause
          e.preventDefault();
          if (isAutoProgressing) {
            pauseScenario();
          } else {
            resumeScenario();
          }
          break;
        case 's': // Start scenario
          e.preventDefault();
          startScenario();
          break;
        case '3': // Fast speed
          e.preventDefault();
          setDemoSpeed('fast');
          break;
        case '4': // Normal speed
          e.preventDefault();
          setDemoSpeed('normal');
          break;
        case '5': // Instant speed
          e.preventDefault();
          setDemoSpeed('instant');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleViewMode, isAutoProgressing, startScenario, pauseScenario, resumeScenario]);

  const progressPercentage = (metrics.stepsCompleted / metrics.totalSteps) * 100;
  const isCompleted = metrics.status === 'completed';

  return (
    <>
      {/* Smart View Toggle Button - Always Visible */}
      <ViewToggle />
      
      {/* Live App View Overlay */}
      <AnimatePresence>
        {viewMode === 'live-app' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-6 text-sm font-mono z-50 border border-gray-200 max-h-[calc(100vh-2rem)] overflow-y-auto"
          >
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-700 mb-2">🔍 Live Application View</div>
                <div className="text-sm text-gray-600 mb-4">
                  This is the actual application state at the current step
                </div>
                
                {/* Current App State */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-sm font-medium text-purple-700 mb-2">Current Step</div>
                  <div className="text-lg font-bold text-purple-900">{metrics.currentStep}</div>
                  <div className="text-sm text-purple-600 mt-2">
                    Step {metrics.stepsCompleted} of {metrics.totalSteps}
                  </div>
                </div>

                {/* App State Details */}
                <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Application State</div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div>• Current View: <span className="font-mono">{metrics.currentStep}</span></div>
                    <div>• Progress: {Math.round((metrics.stepsCompleted / metrics.totalSteps) * 100)}% complete</div>
                    <div>• Documents Generated: {metrics.documentsGenerated}</div>
                    <div>• Time Elapsed: {metrics.timeElapsed}</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Tap the button above to return to demo view or see performance metrics
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Demo Controller Overlay */}
      <AnimatePresence>
        {viewMode === 'metrics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-6 text-sm font-mono z-50 border border-gray-200 max-h-[calc(100vh-2rem)] overflow-y-auto"
          >
            <div className="space-y-4">
              {/* Live Timer Widget - Prominent when running */}
              <AnimatePresence>
                {isRunning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-4 rounded-lg border-2 text-center ${
                      isAutoProgressing 
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-yellow-50 border-yellow-300'
                    }`}
                  >
                    <div className="text-xs font-medium text-gray-600 mb-1">
                      ⏱️ LIVE TIMER
                    </div>
                    <div className={`text-4xl font-bold font-mono ${
                      isAutoProgressing ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {metrics.timeElapsed}
                    </div>
                    <div className="text-xs mt-1 flex items-center justify-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        isAutoProgressing ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                      }`}></span>
                      <span className="text-gray-600">
                        {isAutoProgressing ? 'RUNNING' : 'PAUSED'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scenario Selection */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Demo Scenario</div>
                <div className="flex gap-2">
                  {(['happy-path', 'power-user', 'problem-demo'] as const).map((scenario) => (
                    <button
                      key={scenario}
                      onClick={() => setScenario(scenario)}
                      className={`px-3 py-1 text-xs rounded ${
                        currentScenario === scenario
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {scenario === 'happy-path' ? 'Happy Path (90s)' :
                       scenario === 'power-user' ? 'Power User (3m)' :
                       'Problem Demo (30s)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenario Controls */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Scenario Controls</div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={startScenario}
                    className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                  >
                    ▶ Start
                  </button>
                  <button
                    onClick={isAutoProgressing ? pauseScenario : resumeScenario}
                    className="px-3 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 flex items-center gap-1"
                  >
                    {isAutoProgressing ? '⏸ Pause' : '▶ Resume'}
                  </button>
                  <button
                    onClick={resetDemo}
                    className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-1"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>

              {/* Emergency Controls - Touch Friendly */}
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="text-sm font-medium text-red-700 mb-2">Quick Jump Controls</div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={jumpToDocGeneration}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                  >
                    📄 Jump to Docs
                  </button>
                  <button
                    onClick={jumpToSuccess}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                  >
                    ✅ Jump to Success
                  </button>
                </div>
                <div className="text-xs text-red-600 mt-1">
                  Emergency controls for demo recovery
                </div>
              </div>

              {/* Speed Controls - Touch Friendly */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-700 mb-2">Demo Speed</div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setDemoSpeed('fast')}
                    className={`px-3 py-2 text-sm rounded flex items-center gap-1 ${
                      demoSpeed === 'fast' 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-white text-yellow-700 border border-yellow-300 hover:bg-yellow-50'
                    }`}
                  >
                    ⚡ Fast (0.5x)
                  </button>
                  <button
                    onClick={() => setDemoSpeed('normal')}
                    className={`px-3 py-2 text-sm rounded flex items-center gap-1 ${
                      demoSpeed === 'normal' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    ▶ Normal (1x)
                  </button>
                  <button
                    onClick={() => setDemoSpeed('instant')}
                    className={`px-3 py-2 text-sm rounded flex items-center gap-1 ${
                      demoSpeed === 'instant' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white text-red-700 border border-red-300 hover:bg-red-50'
                    }`}
                  >
                    🚀 Instant (0.1x)
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Current Step */}
              <div className="text-center text-gray-800 font-medium text-base">
                {metrics.currentStep}
                {isAutoProgressing && <span className="ml-2 text-green-600">●</span>}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-blue-700">Time Elapsed</div>
                  <div className="text-lg font-bold text-blue-900">{metrics.timeElapsed}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-green-700">Time Saved</div>
                  <div className="text-lg font-bold text-green-900">{metrics.timeSaved}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-purple-700">Progress</div>
                  <div className="text-lg font-bold text-purple-900">
                    {metrics.stepsCompleted}/{metrics.totalSteps} steps
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-orange-700">Documents</div>
                  <div className="text-lg font-bold text-orange-900">{metrics.documentsGenerated}</div>
                </div>
              </div>

              {/* Completion Celebration */}
              <AnimatePresence>
                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg text-center"
                  >
                    <span className="text-green-600 font-medium text-base">✅ Transaction Complete!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Keyboard Shortcuts Reference - Collapsible */}
              <div className="pt-4 border-t border-gray-200">
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                    ⌨️ Keyboard Shortcuts
                    <span className="text-xs text-gray-500 group-open:hidden">(click to expand)</span>
                  </summary>
                  <div className="mt-3 text-xs text-gray-500 space-y-1">
                    <div className="grid grid-cols-2 gap-x-4">
                      <div>Ctrl+S: Start Scenario</div>
                      <div>Ctrl+Space: Play/Pause</div>
                      <div>Ctrl+1: Jump to Docs</div>
                      <div>Ctrl+2: Jump to Success</div>
                      <div>Ctrl+R: Reset Demo</div>
                      <div>Ctrl+D: Toggle Metrics</div>
                      <div>Ctrl+3: Fast Speed</div>
                      <div>Ctrl+4: Normal Speed</div>
                      <div>Ctrl+5: Instant Speed</div>
                    </div>
                  </div>
                </details>
              </div>

              {/* Sign Out Button */}
              {onLogout && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={onLogout}
                    className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-1 transition-colors"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 