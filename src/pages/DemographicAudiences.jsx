import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Eye,
  ArrowLeft,
  Search,
  Filter,
  X
} from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo-wpp-media.png";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background-gradient-lights.jpg";

const DemographicAudiences = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [audiences, setAudiences] = useState([]);
  const [filteredAudiences, setFilteredAudiences] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Applied filter states
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [appliedCurrencyFilter, setAppliedCurrencyFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Temporary data for demographic audiences
  const tempAudiences = [
    {
      audienceId: 421995,
      name: "Veeva Crossix>Reach>1P>VC11332Age-Real Estate-Consumer Segmentation-Vehicle-Household Composition (Otsuka)>1",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Detailed demographic audience for Otsuka campaign",
      createdDate: "2024-01-15",
      lastModified: "2024-02-20",
      owner: "John Smith",
      tags: ["healthcare", "demographic", "otsuka"]
    },
    {
      audienceId: 385059,
      name: "test_hd",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 23,
      status: "ready",
      description: "Test household demographic audience",
      createdDate: "2024-02-10",
      lastModified: "2024-03-01",
      owner: "Sarah Johnson",
      tags: ["test", "household"]
    },
    {
      audienceId: 403807,
      name: "test-ts Otsuka audience",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready",
      description: "Test audience for Otsuka demographic targeting",
      createdDate: "2024-01-20",
      lastModified: "2024-02-15",
      owner: "Mike Wilson",
      tags: ["otsuka", "test", "demographic"]
    },
    {
      audienceId: 421859,
      name: "Q126,Otsuka Financial-Real Estate-Consumer Segmentation-Age-Buying Activity",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Q1 2026 Otsuka financial and real estate segmentation",
      createdDate: "2024-03-01",
      lastModified: "2024-03-15",
      owner: "Emily Chen",
      tags: ["financial", "real-estate", "q126"]
    },
    {
      audienceId: 386334,
      name: "Otsuka Financial-Real Estate-Consumer Segmentation-Age-Buying Activity",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Otsuka financial behavior and real estate interest segmentation",
      createdDate: "2024-02-05",
      lastModified: "2024-02-28",
      owner: "David Brown",
      tags: ["financial", "real-estate", "age-based"]
    },
    {
      audienceId: 343465,
      name: "OpenIDs_TJX_TJMaxx_1Q2025",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready",
      description: "TJMaxx open IDs for Q1 2025 campaign",
      createdDate: "2024-01-10",
      lastModified: "2024-02-18",
      owner: "Lisa Anderson",
      tags: ["retail", "tjmaxx", "openids"]
    },
    {
      audienceId: 343297,
      name: "OpenIDs_TJXMarshalls_1Q25",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready",
      description: "Marshalls open IDs for Q1 2025 campaign",
      createdDate: "2024-01-12",
      lastModified: "2024-02-19",
      owner: "Lisa Anderson",
      tags: ["retail", "marshalls", "openids"]
    },
    {
      audienceId: 405455,
      name: "New For Q1_Otsuka Financial-Real Estate-Consumer Segmentation-Age-Buying Activity",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "New Q1 Otsuka audience with enhanced segmentation",
      createdDate: "2024-02-25",
      lastModified: "2024-03-10",
      owner: "John Smith",
      tags: ["q1", "otsuka", "enhanced"]
    },
    {
      audienceId: 406964,
      name: "Melissa Harrison Look At Audience Segment Built",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Custom audience built for Melissa Harrison campaign",
      createdDate: "2024-03-05",
      lastModified: "2024-03-18",
      owner: "Melissa Harrison",
      tags: ["custom", "personalized"]
    },
    {
      audienceId: 375563,
      name: "HHIncome_2025_07_01(25/26COR)",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready",
      description: "Household income based audience for 2025-2026",
      createdDate: "2024-02-15",
      lastModified: "2024-03-05",
      owner: "Robert Taylor",
      tags: ["income", "household", "financial"]
    },
    {
      audienceId: 421996,
      name: "Test Audience 1",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 24,
      status: "processing",
      description: "Test audience currently being processed",
      createdDate: "2024-03-12",
      lastModified: "2024-03-12",
      owner: "Test User",
      tags: ["test", "processing"]
    },
    {
      audienceId: 421997,
      name: "Test Audience 2",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "failed",
      description: "Test audience that failed processing",
      createdDate: "2024-03-10",
      lastModified: "2024-03-10",
      owner: "Test User",
      tags: ["test", "failed"]
    },
    {
      audienceId: 421998,
      name: "Test Audience 3",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "draft",
      description: "Test audience in draft state",
      createdDate: "2024-03-08",
      lastModified: "2024-03-08",
      owner: "Test User",
      tags: ["test", "draft"]
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

  // Apply filters
  useEffect(() => {
    let filtered = audiences;

    if (appliedSearchTerm) {
      filtered = filtered.filter(audience =>
        audience.name.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        audience.audienceId.toString().includes(appliedSearchTerm)
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

  const handleCustomAudiences = () => {
    navigate('/audiences');
  };

  const handleApplyFilters = () => {
    setAppliedSearchTerm(searchTerm);
    setAppliedCurrencyFilter(currencyFilter);
    setAppliedStatusFilter(statusFilter);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCurrencyFilter("");
    setStatusFilter("");
    
    setAppliedSearchTerm("");
    setAppliedCurrencyFilter("");
    setAppliedStatusFilter("");
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
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
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
          <main className="px-4 py-3">
            {/* Main content container */}
            <div className="w-full max-w-7xl mx-auto bg-white rounded-xl p-4 sm:p-5 shadow-lg">
              {/* Page Header - Blue */}
              <div className="bg-dark-blue rounded-lg p-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mb-4">
                  <h2 className="text-white text-lg md:text-xl font-semibold">VideoAmp Demographic Audiences</h2>
                </div>
                <button
                  onClick={handleCustomAudiences}
                  className="bg-lemon/90 text-dark-blue px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-lemon transition-colors whitespace-nowrap"
                >
                  Custom Audiences
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
              <div className="flex justify-end gap-2 mb-4">
                <button 
                  onClick={handleApplyFilters}
                  className="w-full sm:w-auto bg-dark-blue/80g-dark-blue/80 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-dark-blue transition-colors inline-flex items-center gap-1"
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
              <table className="min-w-[850px] w-full table-fixed divide-y divide-gray-200">
                  <thead className="bg-dark-blue">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[250px]">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[80px]">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">Level</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">Currency</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">Status</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[50px]"></th>
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
                        <tr key={audience.audienceId} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.audienceId}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 break-words whitespace-normal">{audience.name}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.audienceType}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.level}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.currencyOfRecord}</td>
                          <td className="px-3 py-2 align-top">
                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full inline-block ${getStatusBadgeClass(audience.status)}`}>
                              {audience.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top">
                            <button 
                              onClick={() => handleView(audience)}
                              className="text-gray-600 hover:text-gray-900"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
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
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-2 py-1 rounded border text-xs ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg sm:max-w-2xl sm:my-8 sm:align-middle">
              <div className="bg-dark-blue px-4 py-3 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">
                  Audience Details - {selectedAudience.audienceId}
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
                        {selectedAudience.audienceId}
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

export default DemographicAudiences;