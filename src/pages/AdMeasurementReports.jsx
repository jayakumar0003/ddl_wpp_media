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
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Enhanced temporary data for reports with additional fields
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
      description: "Q1 2025 audience essentials report covering key demographics and reach metrics",
      advertiser: "Global Brands Inc.",
      agency: "WPP Media",
      audiences: ["Adults 18-49", "Adults 25-54"],
      datasource_groups: ["Q1 2025 Campaign Data"],
      tags: ["q1", "2025", "essentials", "audience"]
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
      description: "Summer campaign reach and frequency analysis for seasonal promotions",
      advertiser: "Summer Brands Co.",
      agency: "WPP Media",
      audiences: ["Adults 18-34", "Adults 25-54"],
      datasource_groups: ["Summer Promotions"],
      tags: ["summer", "rf", "reach-frequency"]
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
      description: "Network daypart performance analysis for spring campaigns",
      advertiser: "Media Networks Inc.",
      agency: "WPP Media",
      audiences: ["Adults 25-54", "Adults 35-64"],
      datasource_groups: ["Spring Launch Campaign"],
      tags: ["network", "daypart", "spring"]
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
      description: "Holiday season audience essentials report - data processing failed",
      advertiser: "Holiday Retail Group",
      agency: "WPP Media",
      audiences: ["All Adults", "Holiday Shoppers"],
      datasource_groups: ["Holiday Season 2025"],
      tags: ["holiday", "essentials", "failed"]
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
      description: "Black Friday weekend reach and frequency analysis",
      advertiser: "Retail Giant",
      agency: "WPP Media",
      audiences: ["Deal Seekers", "Online Shoppers"],
      datasource_groups: ["Black Friday Weekend"],
      tags: ["black-friday", "rf", "weekend"]
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
      description: "Spring product launch daypart performance analysis",
      advertiser: "Innovation Labs",
      agency: "WPP Media",
      audiences: ["Early Adopters", "Tech Enthusiasts"],
      datasource_groups: ["Spring Launch Campaign"],
      tags: ["spring", "launch", "daypart"]
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
      description: "Back to school audience essentials report - pending processing",
      advertiser: "Education Supplies Inc.",
      agency: "WPP Media",
      audiences: ["Parents", "Students", "Teachers"],
      datasource_groups: ["Back to School Data"],
      tags: ["back-to-school", "essentials", "pending"]
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
      description: "New Year resolution campaign reach and frequency analysis",
      advertiser: "Wellness Brands",
      agency: "WPP Media",
      audiences: ["Fitness Enthusiasts", "Health Conscious"],
      datasource_groups: ["New Year Resolution"],
      tags: ["new-year", "rf", "fitness"]
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
      description: "Canadian market daypart performance analysis",
      advertiser: "Canada Brands",
      agency: "WPP Media Canada",
      audiences: ["Canadian Adults", "French Canadians"],
      datasource_groups: ["Canadian Market Data"],
      tags: ["canada", "daypart", "international"]
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
      description: "Spring season audience essentials report",
      advertiser: "Spring Brands",
      agency: "WPP Media",
      audiences: ["Adults 18-49", "Adults 25-54"],
      datasource_groups: ["Spring Launch Campaign"],
      tags: ["spring", "essentials", "seasonal"]
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
      description: "Fall fashion collection reach and frequency analysis",
      advertiser: "Fashion Outlet",
      agency: "WPP Media",
      audiences: ["Fashion Shoppers", "Trend Setters"],
      datasource_groups: ["Fall Collection Data"],
      tags: ["fall", "rf", "fashion"]
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
      description: "Christmas holiday daypart performance analysis",
      advertiser: "Gift Guide Ltd.",
      agency: "WPP Media UK",
      audiences: ["Holiday Shoppers", "Gift Buyers"],
      datasource_groups: ["Christmas Gift Guide"],
      tags: ["christmas", "daypart", "holiday", "uk"]
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

  const handleView = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
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
  };

  const handleDownload = (id) => {
    setLoadingOverlay(true);
    // Simulate download
    setTimeout(() => {
      alert(`Downloading report ${id} (Demo mode)`);
      setLoadingOverlay(false);
    }, 500);
  };

  const handleRefresh = (id) => {
    setLoadingOverlay(true);
    // Simulate refresh
    setTimeout(() => {
      alert(`Refreshing report ${id} (Demo mode)`);
      setLoadingOverlay(false);
    }, 500);
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

      {/* Loading Overlay */}
      <AnimatePresence>
        {loadingOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60]"
          >
            <div className="bg-white rounded-lg p-4 shadow-xl flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-blue-200 border-t-dark-blue rounded-full animate-spin"></div>
              <span className="text-sm text-gray-700">Loading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="w-full max-w-8xl mx-auto bg-white rounded-xl p-4 sm:p-5 shadow-lg">
              {/* Page Header - Dark Blue */}
              <div className="bg-dark-blue rounded-lg p-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-lg md:text-xl font-semibold">
                    Ad Measurement Reports
                  </h2>
                </div>
                <button
                  onClick={handleCreateReport}
                  className="bg-lemon/90 text-dark-blue px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-lemon transition-colors whitespace-nowrap inline-flex items-center gap-1"
                >
                  <Plus size={14} />
                  Create Report
                </button>
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap gap-4 mb-4 items-end">
                <div className="w-full sm:w-64">
                  <label className="block text-xs font-medium text-dark-blue mb-1">
                    Search By Report ID
                  </label>
                  <input
                    type="text"
                    value={reportIdFilter}
                    onChange={(e) => setReportIdFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
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
                    className="w-full px-2 py-2 text-sm border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
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
                <div className="fixed inset-0 bg-white/30 flex items-center justify-center z-50">
                  <div className="w-12 h-12 border-3 border-blue-200 border-t-dark-blue rounded-full animate-spin"></div>
                </div>
              )}

              {/* Table */}
              {!loading && (
                <div className="bg-dark-blue rounded-lg border border-gray-200 overflow-x-auto">
                  <table className="min-w-[1200px] w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-dark-blue">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">
                          ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[120px]">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[120px]">
                          Request Type
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[60px]">
                          Start Date
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[60px]">
                          End Date
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[80px]">
                          Created On
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[60px]">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[100px]">
                          Actions
                        </th>
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
                        currentItems.map((report) => (
                          <tr
                            key={report.id}
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
                            <td className="px-3 py-2 align-top">
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  onClick={() => handleView(report)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                  title="View"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleClone(report.id)}
                                  className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                                  title="Clone"
                                >
                                  <Files size={16} />
                                </button>
                                <button
                                  onClick={() => handleDownload(report.id)}
                                  disabled={report.status !== "succeeded"}
                                  className={`p-1 rounded ${
                                    report.status === "succeeded"
                                      ? "text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                                      : "text-gray-400 cursor-not-allowed"
                                  }`}
                                  title={report.status === "succeeded" ? "Download" : "Download not available"}
                                >
                                  <Download size={16} />
                                </button>
                                <button
                                  onClick={() => handleRefresh(report.id)}
                                  className="text-amber-600 hover:text-amber-800 p-1 rounded hover:bg-amber-50"
                                  title="Refresh"
                                >
                                  <RefreshCw size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(report.id)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!loading && filteredReports.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 text-xs text-gray-700">
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

      {/* View Report Modal */}
      {isModalOpen && selectedReport && (
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
                  Report Details - {selectedReport.id}
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
                      <label className="block text-xs font-medium text-gray-500 mb-1">Report ID</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedReport.id}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Report Name</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                        {selectedReport.name}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedReport.description || 'No description available'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Request Type</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {getRequestTypeLabel(selectedReport.type)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Advertiser</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedReport.advertiser || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Agency</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedReport.agency || 'WPP Media'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {formatDate(selectedReport.start_date)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {formatDate(selectedReport.end_date)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <div className="text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${getStatusBadgeClass(selectedReport.status)}`}>
                          {selectedReport.status}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Created On</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedReport.created_at}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Audiences</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedReport.audiences ? selectedReport.audiences.join(', ') : 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Datasource Groups</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedReport.datasource_groups ? selectedReport.datasource_groups.join(', ') : 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
                      <div className="flex flex-wrap gap-1">
                        {selectedReport.tags && selectedReport.tags.length > 0 ? (
                          selectedReport.tags.map((tag, index) => (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-dark-blue p-4 rounded-t-xl flex items-center justify-between sticky top-0">
                <h2 className="text-white text-lg font-semibold">
                  {isEditMode ? "Edit Report" : "Create Report"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 transition-colors"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
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
                      <div className="w-6 h-6 border-2 border-blue-200 border-t-dark-blue rounded-full animate-spin"></div>
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
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
                      <div className="w-6 h-6 border-2 border-blue-200 border-t-dark-blue rounded-full animate-spin"></div>
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
                    >
                      {datasourceGroupOptions.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-dark-blue text-white rounded-full text-sm font-medium hover:bg-dark-blue/80 transition-colors"
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