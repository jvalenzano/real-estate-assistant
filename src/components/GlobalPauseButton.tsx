import { motion, AnimatePresence } from 'framer-motion';
import { useDemoController } from '../stores/demoController';

export const GlobalPauseButton = () => {
  const {
    isAutoProgressing,
    isRunning,
    pauseScenario,
    resumeScenario,
    resetDemo,
    metrics
  } = useDemoController();

  // Don't show if demo isn't running
  if (!isRunning) return null;

  const handleTogglePause = () => {
    if (isAutoProgressing) {
      pauseScenario();
    } else {
      resumeScenario();
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetDemo();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[70] group"
    >
      {/* Main Pause/Resume Button */}
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 px-4 py-2">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isAutoProgressing ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
          }`} />
          <span className="text-sm font-medium text-gray-700">
            {isAutoProgressing ? 'Running' : 'Paused'}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-gray-300" />

        {/* Timer Display */}
        <div className="text-sm font-mono text-gray-600">
          {metrics.timeElapsed}
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-gray-300" />

        {/* Control Buttons */}
        <div className="flex items-center gap-1">
          {/* Pause/Resume Button */}
          <motion.button
            onClick={handleTogglePause}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full transition-colors ${
              isAutoProgressing 
                ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' 
                : 'bg-green-100 hover:bg-green-200 text-green-700'
            }`}
            aria-label={isAutoProgressing ? 'Pause demo' : 'Resume demo'}
          >
            {isAutoProgressing ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21"></polygon>
              </svg>
            )}
          </motion.button>

          {/* Reset Button */}
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            aria-label="Reset demo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
          {isAutoProgressing ? 'Click to pause (Ctrl+Space)' : 'Click to resume (Ctrl+Space)'}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
        </div>
      </div>

      {/* Pulsing Ring When Paused */}
      <AnimatePresence>
        {!isAutoProgressing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 