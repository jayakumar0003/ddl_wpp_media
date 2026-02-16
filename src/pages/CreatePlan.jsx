import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calculator, Calendar, Percent, ChevronDown } from "lucide-react";
import Sidebar from "./Sidebar";

const CreatePlan = () => {
  // ===== State =====
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [clientBudget, setClientBudget] = useState(0);
  const [cpmDataCosts, setCpmDataCosts] = useState(0);
  const [flatDataCosts, setFlatDataCosts] = useState(0);
  const [marginPercent, setMarginPercent] = useState(20);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [spots, setSpots] = useState({
    "15s": 0,
    "30s": 70,
    "60s": 0,
    "75s": 0,
    "90s": 0,
  });
  const [includeHispanic, setIncludeHispanic] = useState(false);
  const [requireBroadcast, setRequireBroadcast] = useState(false);
  const [excludeCableNews, setExcludeCableNews] = useState(false);
  const [darkWeeks, setDarkWeeks] = useState("");
  const [useCustomMin, setUseCustomMin] = useState(false);
  const [networkMinOverride, setNetworkMinOverride] = useState(0);
  const [loadSession, setLoadSession] = useState("");
  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState(false);

  // Sample datasets (replace with actual data later)
  const availableDatasets = [
    "VideoAmp Q1 2025",
    "VideoAmp Q2 2025",
    "VideoAmp Q3 2025",
    "VideoAmp Q4 2025",
  ];

  // ===== Budget Calculations =====
  const marginAmount = clientBudget * (marginPercent / 100);
  const afterMargin = clientBudget - marginAmount;
  const planOverheadFee = 0; // 0%
  const totalDataCosts = cpmDataCosts + flatDataCosts;
  const initialNetMediaBudget = afterMargin - planOverheadFee - totalDataCosts;
  const vaPostingFee = initialNetMediaBudget * 0.02; // 2%
  const taxFee = vaPostingFee * 0.08875; // 8.875%
  const finalNetMediaBudget = initialNetMediaBudget - vaPostingFee - taxFee;

  // ===== Spot Validation =====
  const totalSpots = Object.values(spots).reduce((a, b) => a + b, 0);
  const isSpotsValid = totalSpots === 100;

  const handleSpotChange = (key, value) => {
    const num = parseInt(value) || 0;
    setSpots((prev) => ({ ...prev, [key]: Math.min(100, Math.max(0, num)) }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Permanent Sidebar */}
      <Sidebar />

      {/* Main content area with left margin for sidebar */}
      <div className="relative z-10 ml-80 min-h-screen">
        {/* Header with Home link */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-dark-blue/10 bg-white/50 backdrop-blur-sm">
          <Link
            to="/"
            className="flex items-center gap-2 text-dark-blue hover:text-lemon transition-colors"
          >
            <span className="font-display font-medium">Home</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-dark-blue">
            Create Plan
          </h1>
          <div className="w-20" /> {/* spacer */}
        </header>

        {/* Scrollable main content */}
        <main
          className="px-6 py-8 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 80px)" }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-lemon/20 p-6 md:p-8">
            <h2 className="text-3xl font-display font-bold text-dark-blue mb-2">
              Plan a Campaign
            </h2>
            <p className="text-dark-blue/70 mb-6">
              Below are the available VideoAmp datasets. Please select which you
              would like to include in this campaign planning:
            </p>

            {/* ===== Datasets – vertical column ===== */}
            <h3 className="text-lg font-bold text-dark-blue mb-3">
              Datasets:
            </h3>
            <div className="mb-6 p-4 border border-dark-blue/10 rounded-lg">
            
            <div className="mb-3 space-y-2">
              {availableDatasets.map((ds) => (
                <label
                  key={ds}
                  className="flex items-center gap-3 p-2 border border-dark-blue/10 rounded-lg hover:bg-lemon/10 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={ds}
                    checked={selectedDatasets.includes(ds)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDatasets([...selectedDatasets, ds]);
                      } else {
                        setSelectedDatasets(
                          selectedDatasets.filter((d) => d !== ds)
                        );
                      }
                    }}
                    className="rounded border-dark-blue/30 text-lemon focus:ring-lemon"
                  />
                  <span className="text-dark-blue font-medium">{ds}</span>
                </label>
              ))}
            </div>
            </div>
            {/* ===== Budget Calculator ===== */}
            <div className="mb-8 border border-dark-blue/20 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-lemon/20 to-blue-400/20 p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-dark-blue flex items-center gap-2">
                  <Calculator size={22} />
                  Budget Calculator
                </h3>
                <button
                  onClick={() => setShowBudgetBreakdown(!showBudgetBreakdown)}
                  className="flex items-center gap-1 text-dark-blue/70 hover:text-dark-blue transition-colors"
                >
                  <span className="text-sm font-medium">
                    {showBudgetBreakdown ? "Hide" : "Show"} Details
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transform transition-transform ${
                      showBudgetBreakdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Input row – client budget, CPM, flat, margin */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-1">
                      Client Budget ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={clientBudget}
                      onChange={(e) =>
                        setClientBudget(parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-1">
                      CPM Data Costs ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={cpmDataCosts}
                      onChange={(e) =>
                        setCpmDataCosts(parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-1">
                      Flat Data Costs ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={flatDataCosts}
                      onChange={(e) =>
                        setFlatDataCosts(parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-1">
                      Margin (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marginPercent}
                      onChange={(e) =>
                        setMarginPercent(parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
                    />
                  </div>
                </div>

                {/* Final Net Media Budget (readonly) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-dark-blue mb-1">
                      Final Net Media Budget ($)
                    </label>
                    <input
                      type="text"
                      value={formatCurrency(finalNetMediaBudget)}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-dark-blue/20 rounded-lg text-dark-blue font-semibold"
                    />
                  </div>
                  <div className="text-sm text-dark-blue/60">
                    This budget will be used in the scheduler
                  </div>
                </div>

                {/* Detailed Breakdown (collapsible) */}
                {showBudgetBreakdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white border border-dark-blue/10 rounded-lg p-4 space-y-2 text-sm"
                  >
                    <h4 className="font-semibold text-dark-blue mb-2">
                      Budget Breakdown:
                    </h4>
                    <div className="flex justify-between">
                      <span>Client Budget:</span>
                      <span className="font-medium">
                        {formatCurrency(clientBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margin ({marginPercent}%):</span>
                      <span className="font-medium text-red-500">
                        -{formatCurrency(marginAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plan Overhead Fee (0.0%):</span>
                      <span className="font-medium">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPM Data Costs:</span>
                      <span className="font-medium text-red-500">
                        -{formatCurrency(cpmDataCosts)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flat Data Costs:</span>
                      <span className="font-medium text-red-500">
                        -{formatCurrency(flatDataCosts)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-dark-blue/10 pt-2">
                      <span className="font-semibold">
                        Initial Net Media Budget:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(initialNetMediaBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>VA Posting Fee (2%):</span>
                      <span className="font-medium text-red-500">
                        -{formatCurrency(vaPostingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Fee – VA Posting Fee (8.875%):</span>
                      <span className="font-medium text-red-500">
                        -{formatCurrency(taxFee)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-dark-blue/10 pt-2 font-bold">
                      <span>Final Net Media Budget:</span>
                      <span className="text-lemon">
                        {formatCurrency(finalNetMediaBudget)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* ===== Start & End Dates ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-1">
                  Start Date:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
                  min="2023-01-01"
                  max="2027-12-31"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-1">
                  End Date:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
                  min="2023-01-01"
                  max="2027-12-31"
                />
              </div>
            </div>

            {/* ===== Spot Length Distribution ===== */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-dark-blue mb-2">
                Spot Length Distribution :
              </h3>
              <p className="text-sm text-dark-blue/60 mb-4">
                Specify the percentage breakdown of spot lengths. Must total
                100%.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Object.entries(spots).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-dark-blue mb-1">
                      {key}‑second spots (%):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => handleSpotChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
                    />
                  </div>
                ))}
              </div>
              <div
                className={`mt-3 text-sm ${
                  isSpotsValid ? "text-green-600" : "text-red-500"
                }`}
              >
                Total: {totalSpots}%
              </div>
              <div
                className={`mt-3 text-sm ${
                  isSpotsValid ? "hidden" : "text-red-500"
                }`}
              >
                Percentage must total 100%
              </div>
            </div>

            {/* ===== Hispanic Targeting ===== */}
            <div className="mb-6 p-4 border border-dark-blue/10 rounded-lg">
              <h4 className="font-bold text-dark-blue mb-2">
                Hispanic Targeting:
              </h4>
              <p className="text-sm text-dark-blue/60 mb-2">
                Include networks with Hispanic targeting in optimization.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hispanic"
                  checked={includeHispanic}
                  onChange={(e) => setIncludeHispanic(e.target.checked)}
                  className="rounded border-dark-blue/30 text-lemon focus:ring-lemon"
                />
                <label
                  htmlFor="hispanic"
                  className="text-sm text-dark-blue cursor-pointer"
                >
                  Include Hispanic targeting networks
                </label>
              </div>
              <p className="text-xs text-dark-blue/40 mt-2">
                Default: OFF (General market networks only)
              </p>
            </div>

            {/* ===== Broadcast Network Requirement ===== */}
            <div className="mb-6 p-4 border border-dark-blue/10 rounded-lg">
              <h4 className="font-bold text-dark-blue mb-2">
                Broadcast Network Requirement:
              </h4>
              <p className="text-sm text-dark-blue/60 mb-2">
                Require at least one broadcast network (ABC/CBS/NBC) in the
                plan.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="broadcast"
                  checked={requireBroadcast}
                  onChange={(e) => setRequireBroadcast(e.target.checked)}
                  className="rounded border-dark-blue/30 text-lemon focus:ring-lemon"
                />
                <label
                  htmlFor="broadcast"
                  className="text-sm text-dark-blue cursor-pointer"
                >
                  Require broadcast networks (most efficient will be selected)
                </label>
              </div>
              <p className="text-xs text-dark-blue/40 mt-2">
                Default: OFF (Broadcast networks included only if efficient)
              </p>
            </div>

            {/* ===== Cable News Network Requirement ===== */}
            <div className="mb-6 p-4 border border-dark-blue/10 rounded-lg">
              <h4 className="font-bold text-dark-blue mb-2">
                Cable News Network Requirement:
              </h4>
              <p className="text-sm text-dark-blue/60 mb-2">
                Exclude all cable news network (CNN/Fox News/MSNBC/Fox
                Business/HLN) in the plan.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="cableNews"
                  checked={excludeCableNews}
                  onChange={(e) => setExcludeCableNews(e.target.checked)}
                  className="rounded border-dark-blue/30 text-lemon focus:ring-lemon"
                />
                <label
                  htmlFor="cableNews"
                  className="text-sm text-dark-blue cursor-pointer"
                >
                  Exclude cable news network
                </label>
              </div>
              <p className="text-xs text-dark-blue/40 mt-2">
                Default: OFF (Cable news networks included only if efficient)
              </p>
            </div>

            {/* ===== Dark Weeks ===== */}
            <div className="mb-6 p-4 border border-dark-blue/10 rounded-lg">
              <label className="block font-bold text-dark-blue mb-2">
                Number of Dark Weeks:
              </label>
              <input
                type="text"
                value={darkWeeks}
                onChange={(e) => setDarkWeeks(e.target.value)}
                placeholder="no commas or symbols -- e.g. 1"
                className="w-full px-3 py-2 border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
              />
            </div>

            {/* ===== Network Minimum Override ===== */}
            <div className="mb-6 p-4 border border-dark-blue/10 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="customMin"
                  checked={useCustomMin}
                  onChange={(e) => setUseCustomMin(e.target.checked)}
                  className="rounded border-dark-blue/30 text-lemon focus:ring-lemon"
                />
                <label
                  htmlFor="customMin"
                  className="font-bold text-dark-blue cursor-pointer"
                >
                  Use Custom Network Minimum
                </label>
              </div>
              <input
                type="number"
                min="0"
                step="1000"
                value={networkMinOverride}
                onChange={(e) =>
                  setNetworkMinOverride(parseFloat(e.target.value) || 0)
                }
                disabled={!useCustomMin}
                className="w-full max-w-xs px-3 py-2 border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter custom minimum (applies to all networks)"
              />
              <p className="text-xs text-dark-blue/60 mt-2">
                Check the box above and enter a value to override default
                network minimums. Applies uniformly to all networks. Leave
                unchecked to use default minimums.
              </p>
            </div>

            {/* ===== Load from past session ===== */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-dark-blue mb-2">
                Load from past session (optional):
              </label>
              <input
                type="text"
                value={loadSession}
                onChange={(e) => setLoadSession(e.target.value)}
                placeholder="optional"
                className="w-full max-w-md px-3 py-2 border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lemon"
              />
            </div>

            {/* ===== Submit Button ===== */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-3 bg-lemon text-dark-blue rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all border-2 border-dark-blue/20"
                onClick={() => alert("Form submitted (UI only)")}
              >
                Submit Plan
              </motion.button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePlan;
