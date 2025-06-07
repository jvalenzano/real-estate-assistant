import { useEffect } from 'react'
import { useDemoController, type DemoScenario, type DemoSpeed } from '../../stores/demoController'

export function DemoController() {
  const {
    isVisible,
    currentScenario,
    demoSpeed,
    isRunning,
    startTime,
    metrics,
    toggleVisibility,
    setScenario,
    setDemoSpeed,
    startDemo,
    resetDemo,
    jumpToDocGeneration,
    jumpToSuccess,
    updateMetrics,
  } = useDemoController()

  // Update time spent metric
  useEffect(() => {
    if (!isRunning || !startTime) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      updateMetrics({ timeSpent: elapsed })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, startTime, updateMetrics])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-2 sm:right-4 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-lg bg-white p-4 shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Demo Controller</h3>
        <button
          onClick={toggleVisibility}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <div className="text-sm font-medium text-blue-700 mb-1">
          Time Spent: {metrics.timeSpent}s
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Time Saved: {metrics.timeSaved}</div>
          <div>Cost Savings: {metrics.costSaving}</div>
          <div>Error Reduction: {metrics.errorReduction}</div>
          <div>Customer Satisfaction: {metrics.customerSat}</div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Scenario
        </label>
        <select
          value={currentScenario}
          onChange={(e) => setScenario(e.target.value as DemoScenario)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="happy-path">Happy Path (90s)</option>
          <option value="power-user">Power User (3m)</option>
          <option value="problem-demo">Problem Demo (30s)</option>
        </select>
      </div>

      {/* Speed Controls */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Speed
        </label>
        <div className="flex space-x-2">
          {(['normal', 'fast', 'instant'] as DemoSpeed[]).map((speed) => (
            <button
              key={speed}
              onClick={() => setDemoSpeed(speed)}
              className={`flex-1 py-1 px-2 text-sm rounded ${
                demoSpeed === speed
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="space-y-2">
        <button
          onClick={startDemo}
          disabled={isRunning}
          className="w-full py-1.5 px-3 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isRunning ? 'Demo Running...' : 'Start Demo'}
        </button>
        <button
          onClick={resetDemo}
          className="w-full py-1.5 px-3 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200"
        >
          Reset Demo (Ctrl+R)
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={jumpToDocGeneration}
            className="py-1.5 px-3 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-700"
          >
            Jump to Doc Gen (Ctrl+1)
          </button>
          <button
            onClick={jumpToSuccess}
            className="py-1.5 px-3 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-700"
          >
            Jump to Success (Ctrl+2)
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded">D</kbd> to toggle this panel
        </p>
      </div>
    </div>
  )
} 