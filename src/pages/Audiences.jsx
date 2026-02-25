import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Menu, 
  Search, 
  Filter, 
  X, 
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo-wpp-media.png";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background-gradient-lights.jpg"

const Audiences = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [audiences, setAudiences] = useState([]);
  const [filteredAudiences, setFilteredAudiences] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [appliedCurrencyFilter, setAppliedCurrencyFilter] = useState('');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Temporary data with enhanced fields
  const tempAudiences = [
    {
      id: 421995,
      name: "Veeva Crossix>Reach>1P>VC11332Age-Real Estate-Consumer Segmentation-Vehicle-Household Composition (Otsuka)>1",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Comprehensive audience for Otsuka healthcare campaign targeting multiple demographic segments",
      createdDate: "2024-01-15",
      lastModified: "2024-02-20",
      owner: "John Smith",
      tags: ["healthcare", "otsuka", "crossix", "demographic"]
    },
    {
      id: 385059,
      name: "test_hd",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 23,
      status: "ready",
      description: "Test household demographic audience for quality assurance",
      createdDate: "2024-02-10",
      lastModified: "2024-03-01",
      owner: "Sarah Johnson",
      tags: ["test", "household", "qa"]
    },
    {
      id: 403807,
      name: "test-ts Otsuka audience",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready",
      description: "Test audience for Otsuka demographic targeting with time series data",
      createdDate: "2024-01-20",
      lastModified: "2024-02-15",
      owner: "Mike Wilson",
      tags: ["otsuka", "test", "timeseries"]
    },
    {
      id: 421859,
      name: "Q126,Otsuka Financial-Real Estate-Consumer Segmentation-Age-Buying Activity",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Q1 2026 Otsuka audience combining financial behavior, real estate interest, and age-based buying patterns",
      createdDate: "2024-03-01",
      lastModified: "2024-03-15",
      owner: "Emily Chen",
      tags: ["financial", "real-estate", "q126", "age-based"]
    },
    {
      id: 386334,
      name: "Otsuka Financial-Real Estate-Consumer Segmentation-Age-Buying Activity",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Otsuka audience focused on financial behavior and real estate interest with age segmentation",
      createdDate: "2024-02-05",
      lastModified: "2024-02-28",
      owner: "David Brown",
      tags: ["financial", "real-estate", "age-based"]
    },
    {
      id: 343465,
      name: "OpenIDs_TJX_TJMaxx_1Q2025",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready",
      description: "TJMaxx open IDs for Q1 2025 retail campaign targeting frequent shoppers",
      createdDate: "2024-01-10",
      lastModified: "2024-02-18",
      owner: "Lisa Anderson",
      tags: ["retail", "tjmaxx", "openids", "q12025"]
    },
    {
      id: 343297,
      name: "OpenIDs_TJXMarshalls_1Q25",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready",
      description: "Marshalls open IDs for Q1 2025 retail campaign",
      createdDate: "2024-01-12",
      lastModified: "2024-02-19",
      owner: "Lisa Anderson",
      tags: ["retail", "marshalls", "openids", "q12025"]
    },
    {
      id: 405455,
      name: "New For Q1_Otsuka Financial-Real Estate-Consumer Segmentation-Age-Buying Activity",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Enhanced Q1 Otsuka audience with improved segmentation algorithms",
      createdDate: "2024-02-25",
      lastModified: "2024-03-10",
      owner: "John Smith",
      tags: ["q1", "otsuka", "enhanced", "new"]
    },
    {
      id: 406964,
      name: "Melissa Harrison Look At Audience Segment Built",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Custom audience built specifically for Melissa Harrison's campaign requirements",
      createdDate: "2024-03-05",
      lastModified: "2024-03-18",
      owner: "Melissa Harrison",
      tags: ["custom", "personalized", "campaign"]
    },
    {
      id: 375563,
      name: "HHIncome_2025_07_01(25/26COR)",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Household income based audience for 2025-2026 fiscal year planning",
      createdDate: "2024-02-15",
      lastModified: "2024-03-05",
      owner: "Robert Taylor",
      tags: ["income", "household", "financial", "fiscal"]
    },
    {
      id: 421996,
      name: "Test Audience 1",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 24,
      status: "ready",
      description: "Test audience for validation purposes",
      createdDate: "2024-03-12",
      lastModified: "2024-03-12",
      owner: "Test User",
      tags: ["test", "validation"]
    },
    {
      id: 421997,
      name: "Test Audience 2",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "processing",
      description: "Test audience currently being processed",
      createdDate: "2024-03-10",
      lastModified: "2024-03-10",
      owner: "Test User",
      tags: ["test", "processing"]
    },
    {
      id: 421998,
      name: "Test Audience 3",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "failed",
      description: "Test audience that failed processing due to data validation errors",
      createdDate: "2024-03-08",
      lastModified: "2024-03-08",
      owner: "Test User",
      tags: ["test", "failed", "error"]
    },
    {
      id: 421999,
      name: "Test Audience 4",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 23,
      status: "draft",
      description: "Test audience in draft state awaiting finalization",
      createdDate: "2024-03-07",
      lastModified: "2024-03-07",
      owner: "Test User",
      tags: ["test", "draft", "pending"]
    },
    {
      id: 422000,
      name: "Test Audience 5",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 24,
      status: "ready",
      description: "Additional test audience for load testing",
      createdDate: "2024-03-06",
      lastModified: "2024-03-06",
      owner: "Test User",
      tags: ["test", "load-testing"]
    },
    {
      id: 422001,
      name: "Test Audience 6",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "processing",
      description: "Test audience for processing pipeline validation",
      createdDate: "2024-03-05",
      lastModified: "2024-03-05",
      owner: "Test User",
      tags: ["test", "pipeline"]
    },
    {
      id: 422002,
      name: "Test Audience 7",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Test audience for performance benchmarking",
      createdDate: "2024-03-04",
      lastModified: "2024-03-04",
      owner: "Test User",
      tags: ["test", "performance"]
    },
    {
      id: 422003,
      name: "Test Audience 8",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 23,
      status: "ready",
      description: "Test audience for integration testing",
      createdDate: "2024-03-03",
      lastModified: "2024-03-03",
      owner: "Test User",
      tags: ["test", "integration"]
    },
    {
      id: 422004,
      name: "Test Audience 9",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 24,
      status: "draft",
      description: "Test audience for draft workflow testing",
      createdDate: "2024-03-02",
      lastModified: "2024-03-02",
      owner: "Test User",
      tags: ["test", "draft", "workflow"]
    },
    {
      id: 422005,
      name: "Test Audience 10",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready",
      description: "Test audience for scalability testing",
      createdDate: "2024-03-01",
      lastModified: "2024-03-01",
      owner: "Test User",
      tags: ["test", "scalability"]
    },
    {
      id: 422006,
      name: "Test Audience 11",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "failed",
      description: "Test audience that failed due to data format issues",
      createdDate: "2024-02-28",
      lastModified: "2024-02-28",
      owner: "Test User",
      tags: ["test", "failed", "format"]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setAudiences(tempAudiences);
      setFilteredAudiences(tempAudiences);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = audiences;
  
    if (appliedSearchTerm) {
      filtered = filtered.filter(audience =>
        audience.name.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        audience.id.toString().includes(appliedSearchTerm)
      );
    }
  
    if (appliedCurrencyFilter) {
      filtered = filtered.filter(audience =>
        audience.currencyOfRecord.toString() === appliedCurrencyFilter
      );
    }
  
    if (appliedStatusFilter) {
      filtered = filtered.filter(audience =>
        audience.status === appliedStatusFilter
      );
    }
  
    setFilteredAudiences(filtered);
    setCurrentPage(1);
  
  }, [appliedSearchTerm, appliedCurrencyFilter, appliedStatusFilter, audiences]);

  const handleView = (audience) => {
    setSelectedAudience(audience);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAudience(null);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCurrencyFilter('');
    setStatusFilter('');
  
    setAppliedSearchTerm('');
    setAppliedCurrencyFilter('');
    setAppliedStatusFilter('');
  };

  const handleDemographicAudiences = () => {
    navigate('/demographic-audiences');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAudiences.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAudiences.length / itemsPerPage);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-x-hidden"
      style={{ 
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Subtle overlay to soften the background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-4xl"></div>

      {/* Content with relative positioning to appear above overlay */}
      <div className="relative z-10">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-md z-40 h-16 sm:h-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-lemon/20 transition-colors"
            >
              <Menu size={24} className="text-dark-blue" />
            </button>

            <motion.img
              src={logo}
              alt="WPP Media"
              className="h-10 sm:h-12 object-contain cursor-pointer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/", { state: { isExpanded: true } })}
            />
          </div>

          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-lemon/40 border-2 border-dark-blue"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm text-dark-blue font-medium tracking-wide">
              User Guide
            </span>
          </motion.div>
        </header>

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div
          className={`pt-16 sm:pt-20 min-h-screen transition-all duration-300 ${
            sidebarOpen ? "lg:ml-80" : "ml-0"
          }`}
        >
          <main
            className="px-4 py-3"
          >
            {/* Main content container */}
            <div className="w-full max-w-7xl mx-auto bg-white rounded-xl p-4 sm:p-5 shadow-lg">
              {/* Page Header - Blue */}
              <div className="bg-dark-blue rounded-lg p-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-lg md:text-xl font-semibold">Audiences</h2>
                </div>
                <button 
                  onClick={handleDemographicAudiences}
                  className="bg-lemon/90 text-dark-blue px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-lemon transition-colors whitespace-nowrap"
                >
                  VideoAmp Demographic Audiences
                </button>
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-dark-blue mb-1">
                    Search (Name or Description)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-dark-blue/20 rounded focus:outline-none focus:ring-1 focus:ring-dark-blue bg-white"
                      placeholder=""
                    />
                    <Search className="absolute right-2 top-1.5 text-gray-400" size={16} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-dark-blue mb-1">
                    Currency of Record
                  </label>
                  <input
                    type="text"
                    value={currencyFilter}
                    onChange={(e) => setCurrencyFilter(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-dark-blue/20 rounded focus:outline-none focus:ring-1 focus:ring-dark-blue bg-white"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-dark-blue mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-dark-blue/20 rounded focus:outline-none focus:ring-1 focus:ring-dark-blue bg-white"
                  >
                    <option value="">All</option>
                    <option value="ready">Ready</option>
                    <option value="failed">Failed</option>
                    <option value="processing">Processing</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Apply/Clear Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mb-4">
                <button 
                  onClick={() => {
                    setAppliedSearchTerm(searchTerm);
                    setAppliedCurrencyFilter(currencyFilter);
                    setAppliedStatusFilter(statusFilter);
                  }}
                  className="w-full sm:w-auto bg-dark-blue/80 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-dark-blue transition-colors inline-flex items-center gap-1"
                >
                  <Filter size={14} />
                  Apply
                </button>
                <button 
                  onClick={handleClearFilters}
                  className="w-full sm:w-auto border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-1"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>

              {/* Loading Overlay */}
              {loading && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="w-12 h-12 border-3 border-blue-200 border-t-dark-blue rounded-full animate-spin"></div>
                </div>
              )}

              {/* Table */}
              <div className="bg-dark-blue rounded-lg border border-gray-200 overflow-x-auto">
              <table className="min-w-[800px] w-full table-fixed divide-y divide-gray-200">
                  <thead className="bg-dark-blue">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[250px]">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[80px]">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">Level</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[50px]">Currency</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[50px]">Status</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[30px]"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {!loading && currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-3 py-4 text-center text-sm text-gray-500">
                          No audiences found
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((audience) => (
                        <tr key={audience.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.id}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 font-medium break-words whitespace-normal">{audience.name}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.audienceType}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.level}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.currencyOfRecord}</td>
                          <td className="px-3 py-2 align-top">
                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full inline-block ${getStatusBadgeClass(audience.status)}`}>
                              {audience.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top">
                          <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                              onClick={() => handleView(audience)}
                              className="text-blue-600 hover:text-blue-800"
                              title="View Details"
                            >
                              <Eye size={16} />
                              </motion.button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && filteredAudiences.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 text-xs text-gray-700">
                  <div>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAudiences.length)} of {filteredAudiences.length}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-2 py-1 rounded border text-xs ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-2 py-1 rounded border text-xs ${
                        currentPage === totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal for viewing audience details */}
      {isModalOpen && selectedAudience && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-lg sm:max-w-2xl">
              <div className="bg-dark-blue px-4 py-3 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">
                  Audience Details - {selectedAudience.id}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Audience ID</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedAudience.id}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Audience Name</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                        {selectedAudience.name}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedAudience.description || 'No description available'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Audience Type</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedAudience.audienceType}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Level</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedAudience.level}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Currency of Record</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedAudience.currencyOfRecord}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <div className="text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${getStatusBadgeClass(selectedAudience.status)}`}>
                          {selectedAudience.status}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Created Date</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedAudience.createdDate || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Last Modified</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedAudience.lastModified || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Owner</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedAudience.owner || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
                      <div className="flex flex-wrap gap-1">
                        {selectedAudience.tags && selectedAudience.tags.length > 0 ? (
                          selectedAudience.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No tags</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audiences;