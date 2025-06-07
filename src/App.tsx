import './App.css';
import { DemoController } from './components/DemoController';
import { DemoContainer } from './components/demo/DemoContainer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* DemoController will be rendered in the bottom-right corner */}
      <DemoController />
      {/* Main demo flow */}
      <DemoContainer />
    </div>
  );
}

export default App;
