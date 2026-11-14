import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home/Home';
// Global styles first (theme, page, shared button styles); each component
// imports its own stylesheet after this.
import './styles/global.css';

export default function App() {
  // Changing Home's key makes React discard it and mount a brand-new one,
  // so every useState/useRef inside it starts over from its initial value,
  // exactly like when the app first opens. Any state added to Home later
  // is reset too, with nothing extra to update here.
  const [resetKey, setResetKey] = useState(0);
  const reset = () => setResetKey((k) => k + 1);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home key={resetKey} onReset={reset} justReset={resetKey > 0} />
          }
        />
      </Routes>
    </Router>
  );
}
