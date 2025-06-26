export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Tailwind CSS Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Testing Tailwind Classes</h2>
          
          <div className="space-y-4">
            <div className="bg-red-500 text-white p-4 rounded">
              Red Background - If you see this, Tailwind is working
            </div>
            
            <div className="bg-blue-600 text-white p-4 rounded">
              Blue Background - Primary Color
            </div>
            
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Green Button
            </button>
            
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Test input field"
            />
          </div>
        </div>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">Tailwind Version Check</p>
          <p>If all colors and styles above are visible, Tailwind CSS is properly configured.</p>
        </div>
      </div>
    </div>
  );
}