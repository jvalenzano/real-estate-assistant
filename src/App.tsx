import { useState, useEffect } from 'react'
import './App.css';
import { DemoController } from './components/DemoController';
import { GlobalPauseButton } from './components/GlobalPauseButton';
import { ARIAAssistant } from './components/ARIAAssistant';
import { DemoContainer } from './components/demo/DemoContainer';
import { LoginPage } from './components/auth/LoginPage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AIDiscoveryDemo } from './components/demo/AIDiscoveryDemo';
import { useDemoController } from './stores/demoController';
import { preloadPropertyImages, getDemoImageSet } from './data/propertyImages';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string; avatar: string } | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showAIDiscovery, setShowAIDiscovery] = useState(false)
  const { setScenario, demoSpeed } = useDemoController()

  // Preload property images for smooth demo performance
  useEffect(() => {
    const preloadImages = async () => {
      try {
        // Preload images for all demo scenarios
        const allPropertyIds = [
          ...getDemoImageSet('happy-path'),
          ...getDemoImageSet('power-user'),
          ...getDemoImageSet('problem-demo')
        ];
        
        // Remove duplicates
        const uniquePropertyIds = [...new Set(allPropertyIds)];
        
        await preloadPropertyImages(uniquePropertyIds);
      } catch (error) {
        console.warn('Failed to preload some property images:', error);
      }
    };

    preloadImages();
  }, [])

  const handleLogin = (email: string) => {
    // Demo user mapping
    const userMap: Record<string, { name: string; role: string; avatar: string }> = {
      'sarah@realeai.com': { 
        name: 'Sarah Johnson', 
        role: 'Top Producer',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
      },
      'mike@realeai.com': { 
        name: 'Mike Chen', 
        role: 'Managing Broker',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
      },
      'investor@realeai.com': { 
        name: 'James Liu', 
        role: 'Series A Investor',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80'
      }
    }

    const user = userMap[email]
    if (user) {
      setCurrentUser({ email, ...user })
      setIsAuthenticated(true)
      setShowWelcome(true)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setShowWelcome(true)
  }

  const handleScenarioSelect = (scenario: 'happy-path' | 'power-user' | 'problem-demo') => {
    setScenario(scenario)
    setShowWelcome(false)
    setShowAIDiscovery(false)
  }

  const handleAIDiscovery = () => {
    setShowWelcome(false)
    setShowAIDiscovery(true)
  }

  const handleAIDiscoveryComplete = () => {
    setShowAIDiscovery(false)
    setScenario('happy-path') // Default to happy path after AI discovery
    setShowWelcome(false)
  }

  const handleBackToWelcome = () => {
    setShowWelcome(true)
    setShowAIDiscovery(false)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (showAIDiscovery && currentUser) {
    return (
      <AIDiscoveryDemo 
        onComplete={handleAIDiscoveryComplete}
        onScenarioSelect={handleScenarioSelect}
        demoSpeed={demoSpeed}
      />
    )
  }

  if (showWelcome && currentUser) {
    return (
      <WelcomeScreen 
        user={currentUser}
        onScenarioSelect={handleScenarioSelect}
        onAIDiscovery={handleAIDiscovery}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header with Reale Agent Branding */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-lg">🏠</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Reale Agent</div>
              <div className="text-xs text-gray-500">by Reale AI</div>
            </div>
          </div>
          
          {/* User Info and Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (currentUser?.name) {
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1976d2&color=fff&size=150`;
                  }
                }}
              />
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{currentUser?.name}</div>
                <div className="text-xs text-gray-500">{currentUser?.role}</div>
              </div>
            </div>
            <button
              onClick={handleBackToWelcome}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg font-medium transition-colors mr-4"
            >
              ← Back to Scenarios
            </button>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 px-3 py-2 rounded-lg font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Application */}
      <main className="relative">
        <DemoContainer />
        <DemoController />
        <GlobalPauseButton />
        <ARIAAssistant />
      </main>
    </div>
  );
}

export default App;
