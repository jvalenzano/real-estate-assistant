import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type DemoScenario = 'happy-path' | 'power-user' | 'problem-demo'
export type DemoSpeed = 'normal' | 'fast' | 'instant'
export type DemoStatus = 'running' | 'paused' | 'completed'
export type DemoStep = 1 | 2 | 3 | 4 | 5 | 6

export type DemoAction = 
  | 'search_initiated'
  | 'property_selected'
  | 'rpa_generation_started'
  | 'rpa_generated'
  | 'signature_sent'
  | 'transaction_completed'
  | 'properties_compared'
  | 'rpa_customization'
  | 'signature_workflow'
  | 'show_traditional_workflow'
  | 'show_our_solution'
  | 'show_time_comparison'

interface DemoMetrics {
  timeElapsed: string
  timeSaved: string
  currentStep: string
  stepsCompleted: number
  totalSteps: number
  status: DemoStatus
  documentsGenerated: number
  timeSpent: number
  costSaving: string
  errorReduction: string
  customerSat: string
}

// Add scenario timing configurations
const scenarioConfigs = {
  'happy-path': {
    totalDuration: 90000, // 90 seconds
    steps: [
      { view: 'search', duration: 8000, action: 'search_initiated' as DemoAction },
      { view: 'property-details', duration: 15000, action: 'property_selected' as DemoAction },
      { view: 'document-generation', duration: 25000, action: 'rpa_generation_started' as DemoAction },
      { view: 'document-generation', duration: 20000, action: 'rpa_generated' as DemoAction },
      { view: 'signature', duration: 12000, action: 'signature_sent' as DemoAction },
      { view: 'transaction-complete', duration: 10000, action: 'transaction_completed' as DemoAction }
    ]
  },
  'power-user': {
    totalDuration: 180000, // 3 minutes
    steps: [
      { view: 'search', duration: 10000, action: 'search_initiated' as DemoAction },
      { view: 'property-details', duration: 25000, action: 'properties_compared' as DemoAction },
      { view: 'document-generation', duration: 40000, action: 'rpa_customization' as DemoAction },
      { view: 'document-generation', duration: 30000, action: 'rpa_generated' as DemoAction },
      { view: 'signature', duration: 45000, action: 'signature_workflow' as DemoAction },
      { view: 'transaction-complete', duration: 30000, action: 'transaction_completed' as DemoAction }
    ]
  },
  'problem-demo': {
    totalDuration: 30000, // 30 seconds
    steps: [
      { view: 'search', duration: 5000, action: 'show_traditional_workflow' as DemoAction },
      { view: 'property-details', duration: 8000, action: 'show_our_solution' as DemoAction },
      { view: 'document-generation', duration: 7000, action: 'show_time_comparison' as DemoAction },
      { view: 'transaction-complete', duration: 10000, action: 'transaction_completed' as DemoAction }
    ]
  }
}

interface DemoState {
  // Core state
  currentScenario: DemoScenario
  isDemoMode: boolean
  demoSpeed: DemoSpeed
  startTime: number | null
  isVisible: boolean
  isRunning: boolean
  
  // View state (for hybrid routing)
  currentView: string
  
  // Metrics
  metrics: DemoMetrics
  isMetricsVisible: boolean
  
  // Add scenario automation properties
  currentStepIndex: number
  isAutoProgressing: boolean
  stepTimeoutId: number | null
  
  // Actions
  setScenario: (scenario: DemoScenario) => void
  setDemoSpeed: (speed: DemoSpeed) => void
  toggleMetrics: () => void
  toggleVisibility: () => void
  resetDemo: () => void
  jumpToDocGeneration: () => void
  jumpToSuccess: () => void
  startDemo: () => void
  trackAction: (action: DemoAction) => void
  updateMetrics: (metrics: Partial<DemoMetrics>) => void
  startScenario: () => void
  pauseScenario: () => void
  resumeScenario: () => void
  nextStep: () => void
}

const traditionalTimeMap: Record<DemoStep, string> = {
  1: "15 minutes",  // Manual property research
  2: "45 minutes",  // Property analysis  
  3: "90 minutes",  // Form preparation
  4: "120 minutes", // Form review/editing
  5: "150 minutes", // Signature coordination
  6: "165 minutes"  // Final coordination
}

const calculateTimeSaved = (currentStep: number, startTime: number | null): string => {
  const traditionalTime = traditionalTimeMap[currentStep as DemoStep] || "0 minutes"
  const elapsedTime = formatElapsedTime(Date.now() - (startTime || Date.now()))
  return `${traditionalTime} → ${elapsedTime}`
}

const formatElapsedTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getActionDetails = (action: DemoAction) => {
  const actions = {
    'search_initiated': { step: 1, message: "Searching properties..." },
    'property_selected': { step: 2, message: "Property selected" },
    'rpa_generation_started': { step: 3, message: "Generating RPA..." },
    'rpa_generated': { step: 4, message: "RPA ready for review" },
    'signature_sent': { step: 5, message: "Sent for signatures" },
    'transaction_completed': { step: 6, message: "TRANSACTION COMPLETE" },
    'properties_compared': { step: 2, message: "Comparing properties..." },
    'rpa_customization': { step: 3, message: "Customizing RPA..." },
    'signature_workflow': { step: 5, message: "Managing signatures..." },
    'show_traditional_workflow': { step: 1, message: "Traditional workflow..." },
    'show_our_solution': { step: 2, message: "Our automated solution..." },
    'show_time_comparison': { step: 3, message: "Time savings comparison..." }
  }
  
  return actions[action] || { step: 0, message: "Unknown action" }
}

const initialState = {
  currentScenario: 'happy-path' as DemoScenario,
  isDemoMode: true,
  demoSpeed: 'normal' as DemoSpeed,
  startTime: null,
  isVisible: false,
  isRunning: false,
  currentView: 'search',
  metrics: {
    timeElapsed: "00:00",
    timeSaved: "0 minutes → starting...",
    currentStep: "Ready to start demo",
    stepsCompleted: 0,
    totalSteps: 6,
    status: 'paused' as DemoStatus,
    documentsGenerated: 0,
    timeSpent: 0,
    costSaving: "$0",
    errorReduction: "0%",
    customerSat: "0%"
  },
  isMetricsVisible: false
}

export const useDemoController = create<DemoState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      currentStepIndex: 0,
      isAutoProgressing: false,
      stepTimeoutId: null,

      setScenario: (scenario) => {
        const state = get()
        // Clear any existing timeouts
        if (state.stepTimeoutId) {
          clearTimeout(state.stepTimeoutId)
        }
        
        const newState = {
          ...initialState,
          currentScenario: scenario,
          currentStepIndex: 0,
          isAutoProgressing: false,
          stepTimeoutId: null
        }
        set(newState)
      },
      
      setDemoSpeed: (speed) => set({ demoSpeed: speed }),
      
      toggleMetrics: () => set((state) => ({ 
        isMetricsVisible: !state.isMetricsVisible 
      })),
      
      toggleVisibility: () => set((state) => {
        return {
          isVisible: !state.isVisible
        };
      }),
      
      resetDemo: () => {
        const state = get()
        // Clear any existing timeouts
        if (state.stepTimeoutId) {
          clearTimeout(state.stepTimeoutId)
        }
        
        set({
          ...initialState,
          currentScenario: state.currentScenario, // Preserve current scenario
          currentStepIndex: 0,
          isAutoProgressing: false,
          stepTimeoutId: null
        })
      },
      
      startDemo: () => {
        const state = get()
        const config = scenarioConfigs[state.currentScenario]
        
        set({
          startTime: Date.now(),
          isRunning: true,
          isAutoProgressing: true,
          currentStepIndex: 0,
          currentView: config.steps[0].view,
          metrics: {
            ...state.metrics,
            status: 'running',
            currentStep: "Starting scenario...",
            totalSteps: config.steps.length
          }
        })
        
        // Start the first step
        get().nextStep()
      },
      
      trackAction: (action) => {
        const { step, message } = getActionDetails(action)
        const state = get()
        
        set({
          metrics: {
            ...state.metrics,
            currentStep: message,
            stepsCompleted: step,
            timeElapsed: formatElapsedTime(Date.now() - (state.startTime || Date.now())),
            timeSaved: calculateTimeSaved(step, state.startTime),
            status: step === 6 ? 'completed' : 'running',
            documentsGenerated: action === 'rpa_generated' ? state.metrics.documentsGenerated + 1 : state.metrics.documentsGenerated
          }
        })
      },
      
      jumpToDocGeneration: () => {
        const state = get()
        set({
          currentView: 'document-generation',
          metrics: {
            ...state.metrics,
            currentStep: "Generating RPA...",
            stepsCompleted: 3,
            timeElapsed: formatElapsedTime(Date.now() - (state.startTime || Date.now())),
            timeSaved: calculateTimeSaved(3, state.startTime)
          }
        })
        
        // Secondary: Update URL (will be implemented when router is added)
        // router.push('/demo/document-generation', { replace: true })
      },
      
      jumpToSuccess: () => {
        const state = get()
        set({
          currentView: 'transaction-complete',
          metrics: {
            ...state.metrics,
            currentStep: "TRANSACTION COMPLETE",
            stepsCompleted: 6,
            timeElapsed: formatElapsedTime(Date.now() - (state.startTime || Date.now())),
            timeSaved: calculateTimeSaved(6, state.startTime),
            status: 'completed'
          }
        })
        
        // Secondary: Update URL (will be implemented when router is added)
        // router.push('/demo/complete', { replace: true })
      },

      updateMetrics: (newMetrics) => set((state) => ({
        metrics: {
          ...state.metrics,
          ...newMetrics
        }
      })),

      startScenario: () => {
        const state = get()
        const config = scenarioConfigs[state.currentScenario]
        
        set({
          startTime: Date.now(),
          isRunning: true,
          isAutoProgressing: true,
          currentStepIndex: 0,
          currentView: config.steps[0].view,
          metrics: {
            ...state.metrics,
            status: 'running',
            currentStep: "Starting scenario...",
            totalSteps: config.steps.length
          }
        })
        
        // Start the first step
        get().nextStep()
      },

      pauseScenario: () => {
        const state = get()
        if (state.stepTimeoutId) {
          clearTimeout(state.stepTimeoutId)
        }
        set({
          isAutoProgressing: false,
          stepTimeoutId: null
        })
      },

      resumeScenario: () => {
        const state = get()
        if (!state.isAutoProgressing && state.isRunning) {
          set({ isAutoProgressing: true })
          get().nextStep()
        }
      },

      nextStep: () => {
        const state = get()
        const config = scenarioConfigs[state.currentScenario]
        
        if (state.currentStepIndex >= config.steps.length) {
          // Scenario complete
          set({
            isAutoProgressing: false,
            stepTimeoutId: null,
            metrics: {
              ...state.metrics,
              status: 'completed',
              currentStep: "Scenario complete!"
            }
          })
          return
        }

        const currentStep = config.steps[state.currentStepIndex]
        const speedMultiplier = state.demoSpeed === 'fast' ? 0.5 : 
                               state.demoSpeed === 'instant' ? 0.1 : 1.0

        // Update current view and track action
        set({
          currentView: currentStep.view,
          currentStepIndex: state.currentStepIndex + 1
        })
        
        // Track the action for metrics
        get().trackAction(currentStep.action)

        // Schedule next step if auto-progressing
        if (state.isAutoProgressing && state.currentStepIndex < config.steps.length) {
          const timeoutId = window.setTimeout(() => {
            if (get().isAutoProgressing) {
              get().nextStep()
            }
          }, currentStep.duration * speedMultiplier)
          
          set({ stepTimeoutId: timeoutId })
        }
      },
    }),
    { name: 'DemoController' }
  )
)

// Keyboard shortcuts for emergency controls
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
      const demo = useDemoController.getState()
      
      switch (e.key) {
        case '1':
          e.preventDefault()
          demo.jumpToDocGeneration()
          break
        case '2':
          e.preventDefault()
          demo.jumpToSuccess()
          break
        case 'r':
          e.preventDefault()
          demo.resetDemo()
          break
        case 'd':
          e.preventDefault()
          demo.toggleVisibility()
          break
      }
    }
  })
} 