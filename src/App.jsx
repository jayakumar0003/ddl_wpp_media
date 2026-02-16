import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreatePlan from './pages/CreatePlan'; // adjust path as needed
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-plan" element={<CreatePlan />} />
        {/* Add other routes here, e.g., /actualize-plan, /documentation, etc. */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;