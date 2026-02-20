import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreatePlan from './pages/CreatePlan'; // adjust path as needed
import './index.css';
import ActualizePlan from './pages/ActualizePlan';
import UploadVideoAmp from './pages/UploadVideoAmp';
import Documentation from './pages/Documentation';
import Audiences from './pages/Audiences';
import VACampaignPlanning from './pages/VACampaignPlanning';
import DatasourceGroups from './pages/DatasourceGroups';
import AdMeasurementReports from './pages/AdMeasurementReports';
import DemographicAudiences from './pages/DemographicAudiences';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-plan" element={<CreatePlan />} />
        <Route path="/actualize-plan" element={<ActualizePlan />} />
        <Route path="/upload" element={<UploadVideoAmp />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/audiences" element={<Audiences />} />
        <Route path="/va-planning" element={<VACampaignPlanning />} />
        <Route path="/datasources" element={<DatasourceGroups />} />
        <Route path="/reports" element={<AdMeasurementReports />} />

        <Route path="/demographic-audiences" element={<DemographicAudiences />} />
        {/* Add other routes here, e.g., /actualize-plan, /documentatio
        n, etc. */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;