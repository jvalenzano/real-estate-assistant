import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDemoController } from '../../stores/demoController';

export const NeighborhoodDashboard = () => {
  const { trackAction, demoSpeed, setView } = useDemoController();
  const [lifestyleFitScore, setLifestyleFitScore] = useState(0);
  const [showWowMoment, setShowWowMoment] = useState(false);

  // Animate the lifestyle fit score on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWowMoment(true);
      // Animate score counting up to 94%
      let currentScore = 0;
      const targetScore = 94;
      const increment = targetScore / 30; // 30 frames for smooth animation
      
      const scoreInterval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
          currentScore = targetScore;
          clearInterval(scoreInterval);
        }
        setLifestyleFitScore(Math.round(currentScore));
      }, 50); // 50ms intervals for smooth counting

      trackAction('neighborhood_dashboard_viewed');
      
      return () => clearInterval(scoreInterval);
    }, demoSpeed === 'instant' ? 0 : 500);

    return () => clearTimeout(timer);
  }, [demoSpeed, trackAction]);

  const handleBackToProperty = () => {
    setView('property-details');
    trackAction('back_to_property_from_neighborhood');
  };

  const handleProceedToDocuments = () => {
    setView('document-generation');
    trackAction('proceed_from_neighborhood_to_documents');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBackToProperty}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Property
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Neighborhood Intelligence</h1>
        <p className="text-lg text-gray-600">8615 Circle R Course Ln - Perfect for Sarah & Mike</p>
      </div>

      {/* Hero Section: Lifestyle Fit Score */}
      {showWowMoment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-8 mb-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-4"
            >
              <div className="text-6xl font-bold text-green-600 mb-2">
                {lifestyleFitScore}%
              </div>
              <div className="text-2xl font-semibold text-gray-800 mb-4">
                🎯 PERFECT LIFESTYLE MATCH
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${lifestyleFitScore}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-lg text-gray-700"
            >
              <span className="font-semibold text-green-700">15 of 16 boxes checked</span> on your family wishlist
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Magic Triangle Location Visualization */}
      {showWowMoment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🌟 The "Magic Triangle" Discovery
          </h2>
          
          <div className="relative max-w-md mx-auto">
            {/* Triangle Visualization */}
            <div className="relative h-64 flex items-center justify-center">
              {/* Top Point - Schools */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-blue-100 border-2 border-blue-300 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-1">🏫</div>
                <div className="font-semibold text-blue-800">Poway Unified Schools</div>
                <div className="text-sm text-blue-600">(Top 5% in California)</div>
              </motion.div>

              {/* Bottom Left - Your Home */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="absolute bottom-0 left-0 bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-semibold text-green-800">Your Home</div>
                <div className="text-sm text-green-600">8615 Circle R</div>
              </motion.div>

              {/* Bottom Right - Nature */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 }}
                className="absolute bottom-0 right-0 bg-emerald-100 border-2 border-emerald-300 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-1">🌳</div>
                <div className="font-semibold text-emerald-800">Kit Carson Park</div>
                <div className="text-sm text-emerald-600">(22-acre playground)</div>
              </motion.div>

              {/* Triangle Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.line
                  x1="50%" y1="20%" x2="15%" y2="80%"
                  stroke="#10b981" strokeWidth="2" strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                />
                <motion.line
                  x1="50%" y1="20%" x2="85%" y2="80%"
                  stroke="#10b981" strokeWidth="2" strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 2.0, duration: 0.8 }}
                />
                <motion.line
                  x1="15%" y1="80%" x2="85%" y2="80%"
                  stroke="#10b981" strokeWidth="2" strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 2.2, duration: 0.8 }}
                />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="text-center mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <div className="font-semibold text-gray-800 mb-2">Perfect Balance Achieved:</div>
              <div className="text-gray-600">Top schools + Nature access + Convenient location</div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Commute Reality Display */}
      {showWowMoment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🚗 Mike's Commute Reality</h2>
          
          {/* Route Visualization */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <span className="font-semibold text-gray-800">8615 Circle R</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="relative">
                  <div className="h-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"></div>
                  <motion.div
                    className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 2.0, duration: 2.0 }}
                  />
                </div>
                <div className="text-center text-sm text-gray-600 mt-1">SR-78 → I-15 Route</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏢</span>
                <span className="font-semibold text-gray-800">Downtown SD</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Morning Commute */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  🌅 Morning Commute (7:30 AM)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Time:</span>
                    <span className="font-semibold text-green-600">22 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Traffic Flow:</span>
                    <span className="font-semibold text-blue-600">Against rush</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stress Level:</span>
                    <span className="font-semibold text-green-600">Low 😌</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gas Cost:</span>
                    <span className="font-semibold text-green-600">$45/month</span>
                  </div>
                </div>
              </div>

              {/* Evening Commute */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  🌆 Evening Commute (6:00 PM)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Time:</span>
                    <span className="font-semibold text-blue-600">28 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Traffic Flow:</span>
                    <span className="font-semibold text-blue-600">Light traffic</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waze Rating:</span>
                    <span className="font-semibold text-yellow-600">4.8/5 ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scenic Drive:</span>
                    <span className="font-semibold text-purple-600">Mountain views 🏔️</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <div className="text-center text-green-800">
                <span className="font-semibold">💡 Traffic Hack:</span> Save $40/month vs current location + stress-free mornings!
              </div>
            </div>
          </div>

          {/* Location Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                🏔️ Elevation Benefits
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌅</span>
                  <span className="text-gray-700">City views from backyard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌡️</span>
                  <span className="text-gray-700">5°F cooler evenings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌬️</span>
                  <span className="text-gray-700">Natural cross-breeze</span>
                </div>
                <div className="mt-4 p-3 bg-purple-100 rounded text-sm text-purple-800">
                  ⭐ <strong>Bonus:</strong> Premium location without premium price!
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
                🎯 Strategic Location
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏫</span>
                  <span className="text-gray-700">Top schools (5 min)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛒</span>
                  <span className="text-gray-700">Shopping centers (8 min)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏥</span>
                  <span className="text-gray-700">Medical facilities (10 min)</span>
                </div>
                <div className="mt-4 p-3 bg-orange-100 rounded text-sm text-orange-800">
                  🎪 <strong>Sweet Spot:</strong> Everything you need within 15 minutes!
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Call-to-Action Buttons */}
      {showWowMoment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleProceedToDocuments}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            I'm Convinced - Let's Make an Offer!
          </button>
          
          <button
            onClick={handleBackToProperty}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-lg transition-colors"
          >
            Back to Property Details
          </button>
        </motion.div>
      )}

      {/* School Performance Deep Dive */}
      {showWowMoment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🏫 School Performance Deep Dive
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Poway Unified School District</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.span
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.0 + (star * 0.1) }}
                    className="text-2xl text-yellow-500"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <span className="text-lg font-semibold text-blue-800">9.2/10 GreatSchools Rating</span>
            </div>
            <p className="text-blue-700">Top 5% in California • Award-winning programs • Exceptional teacher quality</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Math Scores */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">📊 Math Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">State Average:</span>
                  <span className="text-gray-800">695</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Poway Unified:</span>
                  <span className="font-semibold text-green-600">856</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <motion.div
                    className="bg-green-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    transition={{ delay: 3.5, duration: 1.0 }}
                  />
                </div>
                <div className="text-center text-sm font-semibold text-green-600">+23% above state</div>
              </div>
            </div>

            {/* Reading Scores */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">📚 Reading Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">State Average:</span>
                  <span className="text-gray-800">707</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Poway Unified:</span>
                  <span className="font-semibold text-blue-600">841</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <motion.div
                    className="bg-blue-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ delay: 3.7, duration: 1.0 }}
                  />
                </div>
                <div className="text-center text-sm font-semibold text-blue-600">+19% above state</div>
              </div>
            </div>

            {/* Science Scores */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-3">🔬 Science Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">State Average:</span>
                  <span className="text-gray-800">684</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Poway Unified:</span>
                  <span className="font-semibold text-purple-600">863</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <motion.div
                    className="bg-purple-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "95%" }}
                    transition={{ delay: 3.9, duration: 1.0 }}
                  />
                </div>
                <div className="text-center text-sm font-semibold text-purple-600">+26% above state</div>
              </div>
            </div>
          </div>

          {/* Additional School Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">1:18</div>
              <div className="text-sm text-gray-600">Teacher-Student Ratio</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">34</div>
              <div className="text-sm text-gray-600">AP Courses</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">96%</div>
              <div className="text-sm text-gray-600">Graduation Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">🏆</div>
              <div className="text-sm text-gray-600">Award-Winning Arts</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Weekend Lifestyle Simulator */}
      {showWowMoment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            👨‍👩‍👧‍👦 Your Typical Weekend at 8615 Circle R
          </h2>
          
          <div className="space-y-6">
            {/* Saturday Morning */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.5 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6"
            >
              <h3 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
                🌅 Saturday Morning (8:00 AM)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">☕</span>
                  <div>
                    <div className="font-medium text-gray-800">Coffee on the deck</div>
                    <div className="text-sm text-gray-600">Mountain views & fresh air</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏡</span>
                  <div>
                    <div className="font-medium text-gray-800">Kids play in backyard</div>
                    <div className="text-sm text-gray-600">0.25-acre private space</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚶‍♀️</span>
                  <div>
                    <div className="font-medium text-gray-800">Walk to neighborhood park</div>
                    <div className="text-sm text-gray-600">5-minute stroll</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Saturday Afternoon */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.7 }}
              className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6"
            >
              <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                🌞 Saturday Afternoon (2:00 PM)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚽</span>
                  <div>
                    <div className="font-medium text-gray-800">Youth sports at Kit Carson</div>
                    <div className="text-sm text-gray-600">8-minute drive</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥕</span>
                  <div>
                    <div className="font-medium text-gray-800">Farmers market downtown</div>
                    <div className="text-sm text-gray-600">12-minute drive</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥾</span>
                  <div>
                    <div className="font-medium text-gray-800">Family hiking trails</div>
                    <div className="text-sm text-gray-600">15-minute drive</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sunday Evening */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.9 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6"
            >
              <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                🌙 Sunday Evening (6:00 PM)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="font-medium text-gray-800">BBQ in private backyard</div>
                    <div className="text-sm text-gray-600">Perfect for entertaining</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛣️</span>
                  <div>
                    <div className="font-medium text-gray-800">Quiet cul-de-sac</div>
                    <div className="text-sm text-gray-600">Safe for kids to play</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <div className="font-medium text-gray-800">Prep for school week</div>
                    <div className="text-sm text-gray-600">Top-rated district!</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lifestyle Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.2 }}
            className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg"
          >
            <div className="text-center">
              <div className="font-semibold text-green-800 mb-2">🎯 Perfect Lifestyle Balance</div>
              <div className="text-green-700">
                Nature access • Top schools • Family activities • Safe neighborhood • Mountain views
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Market Intelligence Dashboard */}
      {showWowMoment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.5, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            💰 Market Intelligence Dashboard
          </h2>
          
          {/* Market Opportunity Score */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 mb-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 5.0, duration: 0.6 }}
                className="mb-4"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">🔥 EXCELLENT</div>
                <div className="text-xl font-semibold text-gray-800">Market Opportunity Score</div>
              </motion.div>
              <div className="text-green-700 font-medium">
                Perfect timing • Fair pricing • Strong growth potential
              </div>
            </div>
          </div>

          {/* Offer Range Guidance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                🎯 Smart Offer Strategy
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">List Price:</span>
                  <span className="font-semibold text-gray-800">$700,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recommended Range:</span>
                  <span className="font-semibold text-blue-600">$675K - $725K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sweet Spot:</span>
                  <span className="font-semibold text-green-600">$690K - $705K</span>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded text-sm text-blue-800">
                  💡 <strong>Strategy:</strong> List price is fair value - competitive offer recommended
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                📈 Market Dynamics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Time on Market:</span>
                  <span className="font-semibold text-orange-600">14 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Type:</span>
                  <span className="font-semibold text-red-600">Seller's Market</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inventory Level:</span>
                  <span className="font-semibold text-red-600">LOW</span>
                </div>
                <div className="mt-4 p-3 bg-purple-100 rounded text-sm text-purple-800">
                  ⚡ <strong>Urgency:</strong> Multiple offers expected within 7-10 days
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sales Comparables */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🏘️ Recent Sales (0.5 mile radius)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 5.2 }}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="text-sm text-gray-600 mb-1">30 days ago</div>
                <div className="font-semibold text-gray-800 mb-2">8720 Circle R Course</div>
                <div className="text-lg font-bold text-green-600 mb-2">$715,000</div>
                <div className="text-sm text-gray-600">
                  4 bed • 3 bath • 2,500 sqft<br/>
                  <span className="text-green-600">Similar layout</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 5.4 }}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="text-sm text-gray-600 mb-1">45 days ago</div>
                <div className="font-semibold text-gray-800 mb-2">9150 Mountain View Dr</div>
                <div className="text-lg font-bold text-blue-600 mb-2">$750,000</div>
                <div className="text-sm text-gray-600">
                  5 bed • 4 bath • 2,800 sqft<br/>
                  <span className="text-blue-600">Larger home</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 5.6 }}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="text-sm text-gray-600 mb-1">60 days ago</div>
                <div className="font-semibold text-gray-800 mb-2">8445 Sunset Ridge Ln</div>
                <div className="text-lg font-bold text-purple-600 mb-2">$680,000</div>
                <div className="text-sm text-gray-600">
                  3 bed • 2 bath • 2,200 sqft<br/>
                  <span className="text-purple-600">Smaller home</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Market Appreciation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">+6.8%</div>
              <div className="text-sm text-gray-600">Annual Appreciation</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">$286</div>
              <div className="text-sm text-gray-600">Price per Sqft</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-gray-600">Days on Market</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">+4.2%</div>
              <div className="text-sm text-gray-600">YoY Growth</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Safety & Community Score */}
      {showWowMoment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.0, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🛡️ Safety & Community Analytics
          </h2>
          
          {/* Safety Score Hero */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6 mb-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 5.5, duration: 0.6 }}
                className="mb-4"
              >
                <div className="text-5xl font-bold text-green-600 mb-2">A+</div>
                <div className="text-xl font-semibold text-gray-800">Safety Score</div>
                <div className="text-lg text-green-700">Top 8% in San Diego County</div>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Crime Trends */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                📉 Crime Trend Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">3-Year Trend:</span>
                  <span className="font-semibold text-green-600">↓ 23% decrease</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Violent Crime:</span>
                  <span className="font-semibold text-green-600">Very Low</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Crime:</span>
                  <span className="font-semibold text-green-600">Below Average</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                  <motion.div
                    className="bg-green-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ delay: 5.8, duration: 1.0 }}
                  />
                </div>
                <div className="text-center text-sm font-semibold text-green-600">92% safer than average</div>
              </div>
            </div>

            {/* Emergency Response */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                🚨 Emergency Response
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Police Response:</span>
                  <span className="font-semibold text-blue-600">4.2 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fire Station:</span>
                  <span className="font-semibold text-blue-600">0.8 miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hospital:</span>
                  <span className="font-semibold text-blue-600">3.2 miles</span>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded text-sm text-blue-800">
                  🏆 <strong>Excellence:</strong> Response times in top 10% citywide
                </div>
              </div>
            </div>
          </div>

          {/* Community Engagement */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
              🤝 Community Engagement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">89%</div>
                <div className="text-sm text-gray-600">Ring Doorbell Network</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">Active</div>
                <div className="text-sm text-gray-600">Neighborhood Watch</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">Monthly</div>
                <div className="text-sm text-gray-600">Family Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">4.9/5</div>
                <div className="text-sm text-gray-600">Community Rating</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-100 rounded text-sm text-purple-800 text-center">
              🌟 <strong>Bonus:</strong> Annual block parties & holiday decorating contests!
            </div>
          </div>
        </motion.div>
      )}

      {/* ARIA AI Recommendations */}
      {showWowMoment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 6.0, duration: 0.8 }}
          className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl shadow-lg p-8 mb-8 text-white"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                  <path d="M18 8H6C4.9 8 4 8.9 4 10V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM8 16C7.4 16 7 15.6 7 15S7.4 14 8 14S9 14.4 9 15S8.6 16 8 16ZM16 16C15.4 16 15 15.6 15 15S15.4 14 16 14S17 14.4 17 15S16.6 16 16 16ZM16 12H8V11H16V12Z"/>
                  <circle cx="8" cy="11" r="1"/>
                  <circle cx="16" cy="11" r="1"/>
                </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">ARIA's AI Recommendations</h2>
              <div className="text-indigo-200">Your Intelligent Real Estate Assistant</div>
            </div>
          </div>
          
          {/* AI Confidence Score */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 6.5, duration: 0.6 }}
                className="mb-4"
              >
                <div className="text-5xl font-bold text-green-400 mb-2">96%</div>
                <div className="text-xl font-semibold">AI Confidence Level</div>
                <div className="text-lg text-indigo-200">This property matches your criteria perfectly</div>
              </motion.div>
            </div>
          </div>

          {/* Strategic Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                ⚡ Market Timing Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-indigo-200">Market Momentum:</span>
                  <span className="font-semibold text-green-400">🔥 HOT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Competition Level:</span>
                  <span className="font-semibold text-red-400">HIGH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Time Sensitivity:</span>
                  <span className="font-semibold text-orange-400">URGENT</span>
                </div>
                <div className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded text-sm text-red-200">
                  ⚠️ <strong>Alert:</strong> 3 other buyers viewed this property in the last 48 hours
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                🎯 Strategic Recommendations
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <div className="font-semibold text-green-400">Schedule Showing TODAY</div>
                    <div className="text-sm text-indigo-200">Don't wait - this won't last the weekend</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <div className="font-semibold text-blue-400">Prepare Competitive Offer</div>
                    <div className="text-sm text-indigo-200">Target $695K-$705K range</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <div className="font-semibold text-purple-400">Get Pre-Approval Ready</div>
                    <div className="text-sm text-indigo-200">Lender contact provided below</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              📋 Your Next Steps (AI-Generated Action Plan)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 6.8 }}
                className="bg-green-500/20 border border-green-400/30 rounded-lg p-4"
              >
                <div className="font-semibold text-green-400 mb-2">🏠 Schedule Showing</div>
                <div className="text-sm text-green-200 mb-3">Available slots today:</div>
                <div className="space-y-1 text-sm">
                  <div className="text-white">• 2:00 PM - 2:30 PM</div>
                  <div className="text-white">• 4:00 PM - 4:30 PM</div>
                  <div className="text-white">• 6:00 PM - 6:30 PM</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 7.0 }}
                className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4"
              >
                <div className="font-semibold text-blue-400 mb-2">💰 Financing Ready</div>
                <div className="text-sm text-blue-200 mb-3">Pre-approved lender:</div>
                <div className="space-y-1 text-sm">
                  <div className="text-white">• Pacific Coast Lending</div>
                  <div className="text-white">• Sarah Martinez, Loan Officer</div>
                  <div className="text-white">• (858) 555-0123</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Urgency Messaging */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 7.2, duration: 0.6 }}
            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-400/50 rounded-lg p-6 text-center"
          >
            <div className="text-2xl font-bold text-red-300 mb-2">⏰ Time-Sensitive Opportunity</div>
            <div className="text-lg text-orange-200 mb-4">
              Based on market analysis, this property will likely receive multiple offers within 7-10 days
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-red-500/20 rounded-lg p-3">
                <div className="font-bold text-red-300">Market Velocity</div>
                <div className="text-red-200">Properties selling 40% faster than last year</div>
              </div>
              <div className="bg-orange-500/20 rounded-lg p-3">
                <div className="font-bold text-orange-300">Inventory Shortage</div>
                <div className="text-orange-200">Only 2.1 months of supply available</div>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-3">
                <div className="font-bold text-yellow-300">Buyer Competition</div>
                <div className="text-yellow-200">Average 4.2 offers per property</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Call to Action */}
      {showWowMoment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 7.5, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make Your Move?</h2>
          <p className="text-gray-600 mb-6">
            ARIA has analyzed over 10,000 data points to bring you this perfect match. 
            Don't let this opportunity slip away.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              📞 Schedule Showing Today
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              📄 Prepare Offer Documents
            </motion.button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            🤖 Powered by ARIA's AI Market Intelligence • Updated in real-time
          </div>
        </motion.div>
      )}
    </div>
  );
}; 