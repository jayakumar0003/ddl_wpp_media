import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Eye,
  ArrowLeft,
  Search,
  Filter,
  X,
  Loader2
} from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo-wpp-media.png";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background-gradient-lights.jpg";
import { fetchDemographicAudiences } from "../api/audiencesApi";

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

  useEffect(() => {
    const loadAudiences = async () => {
      setLoading(true);
      try {
        const data = await fetchDemographicAudiences();
        const mappedData = data.map(aud => ({
          ...aud,
          createdDate: aud.createdAt ? new Date(aud.createdAt).toLocaleDateString() : "N/A",
          owner: aud.createdBy || "N/A",
          description: "No description available",
          lastModified: "N/A",
          tags: aud.useCases || []
        }));
        setAudiences(mappedData);
        setFilteredAudiences(mappedData);
      } catch (error) {
        console.error("Failed to load demographic audiences", error);
        setAudiences([]);
        setFilteredAudiences([]);
      } finally {
        setLoading(false);
      }
    };

    loadAudiences();
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

  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
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
              className="h-14 sm:h-18 object-contain cursor-pointer"
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
          className={`pt-16 sm:pt-20 min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:ml-80" : "ml-0"
            }`}
        >
          <main className="px-4">
            {/* Main content container */}
            <div className="w-full max-w-8xl mx-auto bg-white rounded-xl p-4 sm:p-5 shadow-lg">
              {/* Page Header - Blue */}
              <div className="bg-dark-blue rounded-lg p-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-xs md:text-lg font-semibold">VideoAmp Demographic Audiences</h2>
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
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-opacity">
                     <Loader2 className="w-8 h-8 text-dark-blue animate-spin" />
                </div>
              )}

              {/* Table */}
              <div className="bg-dark-blue rounded-lg border border-gray-200 overflow-x-auto hide-scrollbar">
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-xs text-gray-700">
                  <div>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAudiences.length)} of {filteredAudiences.length}
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                        }`}
                    >
                      Prev
                    </button>
                    
                    <div className="flex items-center gap-1 border-x border-gray-200 px-1">
                      {getPageNumbers().map((number, index) => (
                        number === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">...</span>
                        ) : (
                          <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`w-7 h-7 rounded flex items-center justify-center text-xs font-medium transition-colors ${
                              currentPage === number
                                ? "bg-dark-blue text-white shadow-sm"
                                : "text-gray-700 hover:bg-white hover:shadow-sm"
                            }`}
                          >
                            {number}
                          </button>
                        )
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
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
        <div className="fixed inset-0 z-50 overflow-y-auto hide-scrollbar">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-[16px] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-2xl border border-gray-100/50">
              {/* Header */}
              <div className="bg-gradient-to-r from-dark-blue to-[#1a2b4b] px-5 py-4 flex justify-between items-center sm:px-6">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-wide">
                    View Demographic Audience Details
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="bg-white/10 p-1.5 rounded-full text-white hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Body */}
              <div className="bg-gray-50/30 px-5 pt-5 sm:px-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/75 overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/75">
                    
                    {/* Left Column */}
                    <div className="divide-y divide-gray-200/75">
                      <div className="flex flex-col sm:flex-row px-4 py-3 sm:py-3.5 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 group-hover:text-gray-500 transition-colors">ID</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-900 font-medium break-all">{selectedAudience.audienceId}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-3 sm:py-3.5 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 group-hover:text-gray-500 transition-colors">UUID</span>
                        <span className="w-full sm:w-2/3 text-xs text-gray-600 font-mono break-all mt-0.5">{selectedAudience.audienceUUId || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-3 sm:py-3.5 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 group-hover:text-gray-500 transition-colors">Name</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-900 font-medium break-words leading-snug">{selectedAudience.name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-3 sm:py-3.5 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 group-hover:text-gray-500 transition-colors">Desc</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-900 break-words leading-snug">
                          {selectedAudience.description || <span className="text-gray-400 italic">No description</span>}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-3 sm:py-3.5 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 group-hover:text-gray-500 transition-colors">Footprint</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-900 font-medium">
                          {selectedAudience.currencyOfRecord}
                        </span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="divide-y divide-gray-200/75">
                      <div className="flex flex-col sm:flex-row px-4 py-3 sm:py-3.5 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 sm:pl-2 group-hover:text-gray-500 transition-colors">Status</span>
                        <span className="w-full sm:w-2/3 sm:pl-2">
                           <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-md inline-flex items-center shadow-sm border border-black/5 ${getStatusBadgeClass(selectedAudience.status)}`}>
                            {selectedAudience.status}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-3 sm:py-3.5 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 sm:pl-2 group-hover:text-gray-500 transition-colors">Created</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-900 font-medium sm:pl-2 break-all">
                          {selectedAudience.createdAt ? selectedAudience.createdAt : selectedAudience.createdDate}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-3 sm:py-3.5 hover:bg-blue-50/50 transition-colors group bg-blue-50/30">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 sm:pl-2">Est. Universe</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-900 font-medium sm:pl-2">
                          {selectedAudience.metrics?.universeEstimate !== undefined ? selectedAudience.metrics.universeEstimate.toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-3 sm:py-3.5 hover:bg-purple-50/50 transition-colors group bg-purple-50/30">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 sm:pl-2">VideoAmp HH</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-900 font-medium sm:pl-2">
                          {selectedAudience.metrics?.videoAmpHouseHolds !== undefined ? selectedAudience.metrics.videoAmpHouseHolds.toLocaleString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 border-t border-gray-100 px-5 py-4 sm:px-6 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-dark-blue/20 outline-none"
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