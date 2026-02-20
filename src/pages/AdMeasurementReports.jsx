import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Eye,
  Files,
  Download,
  RefreshCw,
  Trash2,
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  Search,
  X,
  Filter,
  MoreVertical,
} from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo-wpp-media.png";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background-gradient-lights.jpg";

const AdMeasurementReports = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  // Filter states
  const [reportIdFilter, setReportIdFilter] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form states
  const [formData, setFormData] = useState({
    displayName: "",
    requestType: "ESSENTIALS",
    startDate: "",
    endDate: "",
    currencyOfRecord: "25",
    audienceIds: [],
    datasourceGroupIds: [],
  });

  const [audienceOptions, setAudienceOptions] = useState([]);
  const [datasourceGroupOptions, setDatasourceGroupOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Temporary data for reports
  const tempReports = [
    {
      id: "rep-001",
      name: "Q1 2025 Audience Essentials",
      type: "ESSENTIALS",
      start_date: "2025-01-01",
      end_date: "2025-03-31",
      created_at: "2025-01-15 10:30 AM",
      status: "succeeded",
      latest_request: { status: "succeeded" },
    },
    {
      id: "rep-002",
      name: "Summer Campaign R&F",
      type: "ADVANCED_RF",
      start_date: "2025-06-01",
      end_date: "2025-08-31",
      created_at: "2025-02-20 02:15 PM",
      status: "processing",
      latest_request: { status: "processing" },
    },
    {
      id: "rep-003",
      name: "Network Daypart Analysis",
      type: "DAYPART",
      start_date: "2025-03-01",
      end_date: "2025-05-30",
      created_at: "2025-02-10 09:45 AM",
      status: "succeeded",
      latest_request: { status: "succeeded" },
    },
    {
      id: "rep-004",
      name: "Holiday Season Essentials",
      type: "ESSENTIALS",
      start_date: "2025-11-01",
      end_date: "2025-12-31",
      created_at: "2025-03-05 11:20 AM",
      status: "failed",
      latest_request: { status: "failed" },
    },
    {
      id: "rep-005",
      name: "Black Friday R&F",
      type: "ADVANCED_RF",
      start_date: "2025-11-24",
      end_date: "2025-11-27",
      created_at: "2025-04-18 03:30 PM",
      status: "succeeded",
      latest_request: { status: "succeeded" },
    },
    {
      id: "rep-006",
      name: "Spring Launch Daypart",
      type: "DAYPART",
      start_date: "2025-03-15",
      end_date: "2025-04-15",
      created_at: "2025-02-22 10:00 AM",
      status: "succeeded",
      latest_request: { status: "succeeded" },
    },
    {
      id: "rep-007",
      name: "Back to School Essentials",
      type: "ESSENTIALS",
      start_date: "2025-07-15",
      end_date: "2025-09-15",
      created_at: "2025-05-14 01:45 PM",
      status: "pending",
      latest_request: { status: "pending" },
    },
    {
      id: "rep-008",
      name: "New Year R&F",
      type: "ADVANCED_RF",
      start_date: "2025-12-26",
      end_date: "2026-01-31",
      created_at: "2025-06-01 11:15 AM",
      status: "processing",
      latest_request: { status: "processing" },
    },
    {
      id: "rep-009",
      name: "Canadian Market Daypart",
      type: "DAYPART",
      start_date: "2025-03-15",
      end_date: "2025-06-15",
      created_at: "2025-02-05 02:30 PM",
      status: "succeeded",
      latest_request: { status: "succeeded" },
    },
    {
      id: "rep-010",
      name: "Spring Essentials",
      type: "ESSENTIALS",
      start_date: "2025-03-01",
      end_date: "2025-05-30",
      created_at: "2025-01-12 09:00 AM",
      status: "succeeded",
      latest_request: { status: "succeeded" },
    },
    {
      id: "rep-011",
      name: "Fall Collection R&F",
      type: "ADVANCED_RF",
      start_date: "2025-09-01",
      end_date: "2025-11-30",
      created_at: "2025-04-03 04:20 PM",
      status: "pending",
      latest_request: { status: "pending" },
    },
    {
      id: "rep-012",
      name: "Christmas Daypart",
      type: "DAYPART",
      start_date: "2025-11-15",
      end_date: "2025-12-24",
      created_at: "2025-05-18 10:45 AM",
      status: "succeeded",
      latest_request: { status: "succeeded" },
    },
  ];

  // Temporary audience data
  const tempAudiences = [
    { audienceId: "aud-001", name: "Adults 18-49" },
    { audienceId: "aud-002", name: "Adults 25-54" },
    { audienceId: "aud-003", name: "Women 18-34" },
    { audienceId: "aud-004", name: "Men 25-54" },
    { audienceId: "aud-005", name: "Hispanic Adults" },
    { audienceId: "aud-006", name: "Affluent Households" },
    { audienceId: "aud-007", name: "Parents with Children" },
    { audienceId: "aud-008", name: "Gen Z" },
    { audienceId: "aud-009", name: "Millennials" },
    { audienceId: "aud-010", name: "Baby Boomers" },
  ];

  // Temporary datasource groups data
  const tempDatasourceGroups = [
    { id: "dsg-001", name: "Q1 2025 Campaign Data" },
    { id: "dsg-002", name: "Summer Promotions" },
    { id: "dsg-003", name: "Holiday Season 2025" },
    { id: "dsg-004", name: "European Campaign Data" },
    { id: "dsg-005", name: "UK Market Analysis" },
    { id: "dsg-006", name: "Back to School Data" },
  ];

  useEffect(() => {
    // Simulate API call for reports
    setLoading(true);
    setTimeout(() => {
      setReports(tempReports);
      setFilteredReports(tempReports);
      setLoading(false);
    }, 1000);

    // Load initial options
    setAudienceOptions(tempAudiences);
    setDatasourceGroupOptions(tempDatasourceGroups);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = reports;

    // Search by ID (instant)
    if (reportIdFilter.trim() !== "") {
      const term = reportIdFilter.toLowerCase();
      filtered = filtered.filter((report) =>
        report.id.toLowerCase().includes(term)
      );
    }

    // Filter by Request Type (instant)
    if (requestTypeFilter !== "") {
      filtered = filtered.filter((report) => report.type === requestTypeFilter);
    }

    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [reportIdFilter, requestTypeFilter, reports]);

  const handleView = (id) => {
    navigate(`/view-report?id=${id}`);
    setDropdownOpen(null);
  };

  const handleClone = (id) => {
    // Find the report to clone
    const reportToClone = reports.find((r) => r.id === id);
    if (reportToClone) {
      setFormData({
        displayName: `${reportToClone.name} (Copy)`,
        requestType: reportToClone.type,
        startDate: reportToClone.start_date,
        endDate: reportToClone.end_date,
        currencyOfRecord: "25",
        audienceIds: ["aud-001", "aud-002"],
        datasourceGroupIds: ["dsg-001"],
      });
      setIsEditMode(false);
      setEditId(null);
      setShowCreateModal(true);
    }
    setDropdownOpen(null);
  };

  const handleDownload = (id) => {
    setLoadingOverlay(true);
    // Simulate download
    setTimeout(() => {
      alert(`Downloading report ${id} (Demo mode)`);
      setLoadingOverlay(false);
    }, 500);
    setDropdownOpen(null);
  };

  const handleRefresh = (id) => {
    setLoadingOverlay(true);
    // Simulate refresh
    setTimeout(() => {
      alert(`Refreshing report ${id} (Demo mode)`);
      setLoadingOverlay(false);
    }, 500);
    setDropdownOpen(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setLoading(true);
      setTimeout(() => {
        const updatedReports = reports.filter((r) => r.id !== id);
        setReports(updatedReports);
        setFilteredReports(updatedReports);
        setLoading(false);
        alert("Report deleted successfully.");
      }, 500);
    }
    setDropdownOpen(null);
  };

  const handleCreateReport = () => {
    setFormData({
      displayName: "",
      requestType: "ESSENTIALS",
      startDate: "",
      endDate: "",
      currencyOfRecord: "25",
      audienceIds: [],
      datasourceGroupIds: [],
    });
    setIsEditMode(false);
    setEditId(null);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setIsEditMode(false);
    setEditId(null);
  };

  const handleFormChange = (e) => {
    const { id, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData((prev) => ({ ...prev, [id]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const loadAudiences = (currencyVal, optionVal = []) => {
    setLoadingOptions(true);
    // Simulate API call
    setTimeout(() => {
      setAudienceOptions(tempAudiences);
      if (optionVal.length > 0) {
        setFormData((prev) => ({ ...prev, audienceIds: optionVal }));
      }
      setLoadingOptions(false);
    }, 300);
  };

  const loadDatasourceGroups = (currencyVal, optionVal = []) => {
    setLoadingOptions(true);
    // Simulate API call
    setTimeout(() => {
      setDatasourceGroupOptions(tempDatasourceGroups);
      if (optionVal.length > 0) {
        setFormData((prev) => ({ ...prev, datasourceGroupIds: optionVal }));
      }
      setLoadingOptions(false);
    }, 300);
  };

  useEffect(() => {
    if (formData.currencyOfRecord) {
      loadAudiences(formData.currencyOfRecord, formData.audienceIds);
      loadDatasourceGroups(
        formData.currencyOfRecord,
        formData.datasourceGroupIds
      );
    }
  }, [formData.currencyOfRecord]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      displayName,
      requestType,
      startDate,
      endDate,
      currencyOfRecord,
      audienceIds,
      datasourceGroupIds,
    } = formData;

    if (!displayName) return alert("Name is required.");
    if (!requestType) return alert("Request Type is required.");
    if (!startDate) return alert("Start Date is required.");
    if (!endDate) return alert("End Date is required.");
    if (!currencyOfRecord) return alert("Currency Of Record is required.");
    if (!audienceIds || audienceIds.length === 0)
      return alert("Audience must be selected.");
    if (!datasourceGroupIds || datasourceGroupIds.length === 0)
      return alert("Datasource Group must be selected.");

    const payload = {
      validate_only: false,
      name: displayName,
      audience_ids: audienceIds,
      start_date: startDate,
      end_date: endDate,
      streams: ["plus7"],
      currency_of_record: currencyOfRecord,
      type: requestType,
      agency_advertiser_id: 3252,
      data_source_group_ids: datasourceGroupIds,
      export_results: true,
    };

    console.log("payload:", payload);
    setLoadingOverlay(true);

    // Simulate API call
    setTimeout(() => {
      alert(
        `Report ${
          isEditMode ? "updated" : "submitted"
        } successfully! (Demo mode)`
      );
      setLoadingOverlay(false);
      handleCloseModal();
    }, 500);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRequestTypeLabel = (type) => {
    switch (type) {
      case "ESSENTIALS":
        return "Ads - Audience Essentials";
      case "ADVANCED_RF":
        return "Ads - Advanced Reach & Frequency";
      case "DAYPART":
        return "Content - Network/Daypart Report";
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Subtle overlay to soften the background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-4xl"></div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loadingOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-[60]"
          >
            <div className="bg-white rounded-lg p-4 shadow-xl flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-700">Loading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <main className="px-4 py-3">
            {/* Main content container */}
            <div className="max-w-6xl mx-auto bg-white rounded-xl p-4 md:p-5 shadow-lg">
              {/* Page Header - Blue */}
              <div className="bg-blue-600 rounded-lg p-3 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  
                  <h2 className="text-white text-lg md:text-xl font-semibold">
                    Ad Measurement Reports
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateReport}
                  className="bg-white text-blue-600 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-1"
                >
                  <Plus size={14} />
                  Create Report
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 items-end">
                <div className="w-64">
                  <label className="block text-xs font-medium text-dark-blue mb-1">
                    Search By Report ID
                  </label>
                  <input
                    type="text"
                    value={reportIdFilter}
                    onChange={(e) => setReportIdFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter report ID"
                  />
                </div>

                <div className="w-64">
                  <label className="block text-xs font-medium text-dark-blue mb-1">
                    Request Type
                  </label>
                  <select
                    value={requestTypeFilter}
                    onChange={(e) => setRequestTypeFilter(e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="ESSENTIALS">
                      Ads - Audience Essentials
                    </option>
                    <option value="ADVANCED_RF">
                      Ads - Advanced Reach & Frequency
                    </option>
                    <option value="DAYPART">
                      Content - Network/Daypart Report
                    </option>
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full"
                  />
                </div>
              )}

              {/* Table */}
              {!loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <table className="w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-blue-600">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">
                          ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[150px]">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[150px]">
                          Request Type
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[80px]">
                          Start Date
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[80px]">
                          End Date
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[80px]">
                          Created On
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[50px]"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-3 py-4 text-center text-sm text-gray-500"
                          >
                            No reports found
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((report, index) => (
                          <motion.tr
                            key={report.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">
                              {report.id}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-900 font-medium break-words whitespace-normal">
                              {report.name}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top break-words whitespace-normal">
                              {getRequestTypeLabel(report.type)}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Calendar
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>{formatDate(report.start_date)}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Calendar
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>{formatDate(report.end_date)}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Clock
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>{report.created_at}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 align-top">
                              <span
                                className={`px-1.5 py-0.5 text-xs font-medium rounded-full inline-block ${getStatusBadgeClass(
                                  report.status
                                )}`}
                              >
                                {report.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 align-top relative">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(report.id);
                                }}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <MoreVertical size={14} />
                              </motion.button>

                              {/* Dropdown menu */}
                              {dropdownOpen === report.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                                >
                                  <button
                                    onClick={() => handleView(report.id)}
                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <Eye size={12} />
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleClone(report.id)}
                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <Files size={12} />
                                    Clone
                                  </button>
                                  <button
                                    onClick={() => handleDownload(report.id)}
                                    disabled={report.status !== "succeeded"}
                                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 ${
                                      report.status === "succeeded"
                                        ? "text-gray-700 hover:bg-gray-100"
                                        : "text-gray-400 cursor-not-allowed"
                                    }`}
                                  >
                                    <Download size={12} />
                                    Download
                                  </button>
                                  <button
                                    onClick={() => handleRefresh(report.id)}
                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <RefreshCw size={12} />
                                    Refresh
                                  </button>
                                  <div className="border-t border-gray-200 my-1"></div>
                                  <button
                                    onClick={() => handleDelete(report.id)}
                                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 size={12} />
                                    Delete
                                  </button>
                                </motion.div>
                              )}
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {/* Pagination */}
              {!loading && filteredReports.length > 0 && (
                <div className="flex items-center justify-between mt-3 text-xs text-gray-700">
                  <div>
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredReports.length)} of{" "}
                    {filteredReports.length}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
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

      {/* Create/Edit Report Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-blue-600 p-4 rounded-t-xl flex items-center justify-between sticky top-0">
                <h2 className="text-white text-lg font-semibold">
                  {isEditMode ? "Edit Report" : "Create Report"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5">
                <div className="mb-4">
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={formData.displayName}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter report name"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="requestType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Request Type
                  </label>
                  <select
                    id="requestType"
                    value={formData.requestType}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ESSENTIALS">
                      Ads - Audience Essentials
                    </option>
                    <option value="ADVANCED_RF">
                      Ads - Advanced Reach & Frequency
                    </option>
                    <option value="DAYPART">
                      Content - Network/Daypart Report
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={formData.endDate}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="currencyOfRecord"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Currency Of Record *
                  </label>
                  <select
                    id="currencyOfRecord"
                    value={formData.currencyOfRecord}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="24">2023-24 Currency</option>
                    <option value="25">2024-25 Currency</option>
                    <option value="26">2025-26 Currency</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="audienceIds"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Audience
                  </label>
                  {loadingOptions ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <select
                      id="audienceIds"
                      value={formData.audienceIds}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          audienceIds: prev.audienceIds.includes(value)
                            ? prev.audienceIds.filter((id) => id !== value)
                            : [...prev.audienceIds, value],
                        }));
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {audienceOptions.map((audience) => (
                        <option
                          key={audience.audienceId}
                          value={audience.audienceId}
                        >
                          {audience.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="datasourceGroupId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Datasource Groups
                  </label>
                  {loadingOptions ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <select
                      id="datasourceGroupIds"
                      value={formData.datasourceGroupIds}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          datasourceGroupIds: prev.datasourceGroupIds.includes(
                            value
                          )
                            ? prev.datasourceGroupIds.filter(
                                (id) => id !== value
                              )
                            : [...prev.datasourceGroupIds, value],
                        }));
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {datasourceGroupOptions.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {isEditMode ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdMeasurementReports;
