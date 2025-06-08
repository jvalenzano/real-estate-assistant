import { useEffect } from 'react';
import { useDemoController } from '../stores/demoController';
import { motion, AnimatePresence } from 'framer-motion';

export const DemoController = () => {
  const {
    isVisible,
    currentScenario,
    metrics,
    demoSpeed,
    isAutoProgressing,
    toggleVisibility,
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
          toggleVisibility();
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
        case 'ArrowUp':
          e.preventDefault();
          setDemoSpeed('fast');
          break;
        case 'ArrowDown':
          e.preventDefault();
          setDemoSpeed('normal');
          break;
        case 'ArrowRight':
          e.preventDefault();
          setDemoSpeed('instant');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleVisibility, isVisible, isAutoProgressing, startScenario, pauseScenario, resumeScenario]);

  if (!isVisible) return null;

  const progressPercentage = (metrics.stepsCompleted / metrics.totalSteps) * 100;
  const isCompleted = metrics.status === 'completed';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-6 text-sm font-mono z-50 border border-gray-200 max-h-[calc(100vh-2rem)] overflow-y-auto"
        >
          <div className="space-y-4">
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
              <div className="flex gap-2">
                <button
                  onClick={startScenario}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ▶ Start
                </button>
                <button
                  onClick={isAutoProgressing ? pauseScenario : resumeScenario}
                  className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  {isAutoProgressing ? '⏸ Pause' : '▶ Resume'}
                </button>
                <button
                  onClick={resetDemo}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  🔄 Reset
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

            {/* Speed Indicator */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Speed:</span>
                <span className={`font-medium text-sm ${
                  demoSpeed === 'fast' ? 'text-yellow-600' :
                  demoSpeed === 'instant' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {demoSpeed.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500">
                <div>Ctrl+S: Start Scenario</div>
                <div>Ctrl+Space: Play/Pause</div>
                <div>Ctrl+1: Jump to Docs</div>
                <div>Ctrl+2: Jump to Success</div>
                <div>Ctrl+R: Reset Demo</div>
                <div>Ctrl+D: Toggle Metrics</div>
                <div>Ctrl+↑: Fast Speed</div>
                <div>Ctrl+↓: Normal Speed</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 