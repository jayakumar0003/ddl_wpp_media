import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Menu, 
  Search, 
  Filter, 
  X, 
  Eye, 
  MoreVertical,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
const [appliedCurrencyFilter, setAppliedCurrencyFilter] = useState('');
const [appliedStatusFilter, setAppliedStatusFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Temporary data
  const tempAudiences = [
    {
      id: 421995,
      name: "Veeva Crossix>Reach>1P>VC11332Age-Real Estate-Consumer Segmentation-Vehicle-Household Composition (Otsuka)>1",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready"
    },
    {
      id: 385059,
      name: "test_hd",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 23,
      status: "ready"
    },
    {
      id: 403807,
      name: "test-ts Otsuka audience",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready"
    },
    {
      id: 421859,
      name: "Q126,Otsuka Financial-Real Estate-Consumer Segmentation-Age-Buying Activity",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready"
    },
    {
      id: 386334,
      name: "Otsuka Financial-Real Estate-Consumer Segmentation-Age-Buying Activity",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready"
    },
    {
      id: 343465,
      name: "OpenIDs_TJX_TJMaxx_1Q2025",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready"
    },
    {
      id: 343297,
      name: "OpenIDs_TJXMarshalls_1Q25",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready"
    },
    {
      id: 405455,
      name: "New For Q1_Otsuka Financial-Real Estate-Consumer Segmentation-Age-Buying Activity",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready"
    },
    {
      id: 406964,
      name: "Melissa Harrison Look At Audience Segment Built",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready"
    },
    {
      id: 375563,
      name: "HHIncome_2025_07_01(25/26COR)",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready"
    },
    {
      id: 421996,
      name: "Test Audience 1",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 24,
      status: "ready"
    },
    {
      id: 421997,
      name: "Test Audience 2",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "processing"
    },
    {
      id: 421998,
      name: "Test Audience 3",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "failed"
    },
    {
      id: 421999,
      name: "Test Audience 4",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 23,
      status: "draft"
    },
    {
      id: 422000,
      name: "Test Audience 5",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 24,
      status: "ready"
    },
    {
      id: 422001,
      name: "Test Audience 6",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "processing"
    },
    {
      id: 422002,
      name: "Test Audience 7",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "ready"
    },
    {
      id: 422003,
      name: "Test Audience 8",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 23,
      status: "ready"
    },
    {
      id: 422004,
      name: "Test Audience 9",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 24,
      status: "draft"
    },
    {
      id: 422005,
      name: "Test Audience 10",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 25,
      status: "ready"
    },
    {
      id: 422006,
      name: "Test Audience 11",
      audienceType: "COMPOSITE",
      level: "HOUSEHOLD",
      currencyOfRecord: 26,
      status: "failed"
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

  const handleView = (id) => {
    navigate(`/view-audience?id=${id}`);
    setDropdownOpen(null);
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

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
      className="min-h-screen relative overflow-hidden"
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
        <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 backdrop-blur-md z-40 h-20">
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
              onClick={() => navigate("/")}
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
          className={`pt-20 min-h-screen transition-all duration-300 ${
            sidebarOpen ? "ml-80" : "ml-0"
          }`}
        >
          <main
            className="px-4 py-3"
          >
            {/* Main content container */}
            <div className="max-w-6xl mx-auto bg-white rounded-xl p-4 md:p-5 shadow-lg">
              {/* Page Header - Blue */}
              <div className="bg-blue-600 rounded-lg p-3 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-lg md:text-xl font-semibold">Audiences</h2>
                </div>
                <button 
                  onClick={handleDemographicAudiences}
                  className="bg-white text-blue-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
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
                      className="w-full px-2 py-1.5 text-sm border border-dark-blue/20 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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
                    className="w-full px-2 py-1.5 text-sm border border-dark-blue/20 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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
                    className="w-full px-2 py-1.5 text-sm border border-dark-blue/20 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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
                  onClick={() => {
                    setAppliedSearchTerm(searchTerm);
                    setAppliedCurrencyFilter(currencyFilter);
                    setAppliedStatusFilter(statusFilter);
                  }}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                >
                  <Filter size={14} />
                  Apply
                </button>
                <button 
                  onClick={handleClearFilters}
                  className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-1"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>

              {/* Loading Overlay */}
              {loading && (
                <div className="fixed inset-0 bg-white/30 flex items-center justify-center z-50">
                  <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}

              {/* Table - with full width and proper column distribution */}
              <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full table-fixed divide-y divide-gray-200">
                  <thead className="bg-blue-600 ">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px] ">ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[250px]">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[80px] ">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px] ">Level</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px] ">Currency</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px] ">Status</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[50px] "></th>
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
                          <td className="px-3 py-2 text-xs text-gray-900 break-all break-words whitespace-normal">{audience.name}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.audienceType}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.level}</td>
                          <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{audience.currencyOfRecord}</td>
                          <td className="px-3 py-2 align-top">
                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full inline-block ${getStatusBadgeClass(audience.status)}`}>
                              {audience.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(audience.id);
                              }}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {/* Dropdown menu */}
                            {dropdownOpen === audience.id && (
                              <div className="absolute right-0 mt-1 w-28 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                <button
                                  onClick={() => handleView(audience.id)}
                                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                                >
                                  <Eye size={12} />
                                  View
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && filteredAudiences.length > 0 && (
                <div className="flex items-center justify-between mt-3 text-xs text-gray-700">
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
    </div>
  );
};

export default Audiences;