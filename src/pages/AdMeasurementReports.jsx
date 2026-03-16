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
  Loader2,
} from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo-wpp-media.png";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background-gradient-lights.jpg";
import { fetchMeasurementReports, fetchAudiencesByYear, fetchDatasourceGroupsByYear, submitReport, sendSpotExportEmail } from "../api/adMeasurementApi";

const AdMeasurementReports = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

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


  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const data = await fetchMeasurementReports();
        setReports(data);
        setFilteredReports(data);
      } catch (error) {
        console.error("Failed to load reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();

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
    // Pre-fetch audience and datasources to display their names based on the report's currency
    if (report.currency_of_record) {
      loadAudiences(report.currency_of_record);
      loadDatasourceGroups(report.currency_of_record);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleClone = (id) => {
    const reportToClone = reports.find((r) => r.id === id);
    if (reportToClone) {
      const currency = reportToClone.currency_of_record || "25";
      const mappedAudienceIds = Array.isArray(reportToClone.audience_ids)
        ? reportToClone.audience_ids
        : (Array.isArray(reportToClone.audiences) ? reportToClone.audiences : []);
      const mappedDsgIds = Array.isArray(reportToClone.data_source_group_ids)
        ? reportToClone.data_source_group_ids
        : [];

      loadAudiences(currency, mappedAudienceIds);
      loadDatasourceGroups(currency, mappedDsgIds);

      setFormData({
        displayName: `${reportToClone.name} (Copy)`,
        requestType: reportToClone.type || "ESSENTIALS",
        startDate: reportToClone.start_date || "",
        endDate: reportToClone.end_date || "",
        currencyOfRecord: currency,
        audienceIds: mappedAudienceIds,
        datasourceGroupIds: mappedDsgIds,
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

  const loadAudiences = async (currencyVal, optionVal = []) => {
    setLoadingOptions(true);
    try {
      const data = await fetchAudiencesByYear(currencyVal);
      setAudienceOptions(data);
      if (optionVal.length > 0) {
        setFormData((prev) => ({ ...prev, audienceIds: optionVal }));
      }
    } catch (error) {
      console.error("Failed to load audiences by year", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadDatasourceGroups = async (currencyVal, optionVal = []) => {
    setLoadingOptions(true);
    try {
      const data = await fetchDatasourceGroupsByYear(currencyVal);
      setDatasourceGroupOptions(data || []);
      if (optionVal.length > 0) {
        setFormData((prev) => ({ ...prev, datasourceGroupIds: optionVal }));
      }
    } catch (error) {
      console.error("Failed to load datasource groups by year", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    if (formData.currencyOfRecord) {
      // Fetch dynamic options whenever currencyOfRecord changes
      loadAudiences(formData.currencyOfRecord, formData.audienceIds);
      loadDatasourceGroups(
        formData.currencyOfRecord,
        formData.datasourceGroupIds
      );
    }
  }, [formData.currencyOfRecord]);

  const handleSubmit = async (e) => {
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

    try {
      if (isEditMode) {
        // Edit flow placeholder if needed later
        alert("Report updated successfully!");
        handleCloseModal();
      } else {
        await submitReport(payload);
        alert("Report submitted successfully!");
        handleCloseModal();
        // Since no refresh logic is directly visible here, we could optionally reload the main table
        // by calling whatever fetches `reports` again, but for now just dismissing modal works well.
      }
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to save report: " + (error.data?.details?.message || error.message || error));
    } finally {
      setLoadingOverlay(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailAddress) {
      alert("Please enter an email address.");
      return;
    }
    const spotLevelExportLink = selectedReport?.latest_request?.outputs?.[1]?.link;
    if (!spotLevelExportLink) {
      alert("Spot level export link is not available.");
      return;
    }

    setEmailLoading(true);
    try {
      await sendSpotExportEmail({
        reportId: selectedReport.id,
        reportName: selectedReport.name,
        toEmail: emailAddress,
        attachmentUrl: spotLevelExportLink
      });
      alert("Email sent successfully.");
      setShowEmailModal(false);
      setEmailAddress("");
    } catch (error) {
      console.error("Email error", error);
      alert("Failed to send email.");
    } finally {
      setEmailLoading(false);
    }
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
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateNumeric = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
              <Loader2 className="w-6 h-6 text-dark-blue animate-spin" />
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
              {/* Page Header - Dark Blue */}
              <div className="bg-dark-blue rounded-lg p-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-base md:text-lg font-semibold">
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
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-opacity">
                  <Loader2 className="w-8 h-8 text-dark-blue animate-spin" />
                </div>
              )}

              {/* Table */}
              {!loading && (
                <div className="bg-dark-blue rounded-lg border border-gray-200 overflow-x-auto hide-scrollbar">
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
                                  report.status || ""
                                )}`}
                              >
                                {report.status ? report.status : "N/A"}
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
                                {/* <button
                                  onClick={() => handleDownload(report.id)}
                                  disabled={report.status !== "succeeded"}
                                  className={`p-1 rounded ${report.status === "succeeded"
                                    ? "text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                                    : "text-gray-400 cursor-not-allowed"
                                    }`}
                                  title={report.status === "succeeded" ? "Download" : "Download not available"}
                                >
                                  <Download size={16} />
                                </button> */}
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
                      className={`px-2 py-1 rounded border text-xs ${currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-2 py-1 rounded border text-xs ${currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2.5 py-1 rounded border text-xs font-medium ${currentPage === page
                            ? "bg-dark-blue border-dark-blue text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-2 py-1 rounded border text-xs ${currentPage === totalPages
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
        <div className="fixed inset-0 z-50 overflow-y-auto hide-scrollbar">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg sm:max-w-2xl sm:my-8 sm:align-middle">
              <div className="bg-dark-blue px-4 py-3 flex justify-between items-center rounded-t-lg">
                <div className="flex items-center gap-2">
                  <button onClick={closeModal} className="text-white hover:text-gray-200 focus:outline-none">
                     <ArrowLeft size={18} />
                  </button>
                  <h3 className="text-lg font-medium text-white">
                    View Report
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                     onClick={() => {
                        handleClone(selectedReport.id);
                        closeModal();
                     }}
                     className="text-white hover:text-gray-200 focus:outline-none"
                     title="Clone"
                  >
                    <Files size={18} />
                  </button>
                  <button
                     onClick={() => {
                        handleDelete(selectedReport.id);
                        closeModal();
                     }}
                     className="text-white hover:text-gray-200 focus:outline-none"
                     title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="bg-white px-5 pt-5 sm:px-6 sm:pb-6 max-h-[80vh] overflow-y-auto hide-scrollbar text-left text-sm text-gray-800">
                <div className="space-y-4">
                  {/* Request Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Request Type</label>
                    <div className="w-full px-3 py-2 bg-gray-100/80 border border-gray-200 rounded-md text-sm text-gray-900 flex justify-between items-center cursor-not-allowed">
                      <span>{getRequestTypeLabel(selectedReport.type)}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <div className="w-full px-3 py-2 bg-gray-100/80 border border-gray-200 rounded-md text-sm text-gray-900 break-words cursor-not-allowed min-h-[38px]">
                      {selectedReport.name}
                    </div>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                    <div className="w-full px-3 py-2 bg-gray-100/80 border border-gray-200 rounded-md text-sm text-gray-900 break-words cursor-not-allowed min-h-[38px]">
                      {formatDateNumeric(selectedReport.start_date)}
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                    <div className="w-full px-3 py-2 bg-gray-100/80 border border-gray-200 rounded-md text-sm text-gray-900 break-words cursor-not-allowed min-h-[38px]">
                      {formatDateNumeric(selectedReport.end_date)}
                    </div>
                  </div>

                  {/* Currency Of Record */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Currency Of Record *</label>
                    <div className="w-full px-3 py-2 bg-gray-100/80 border border-gray-200 rounded-md text-sm text-gray-900 flex justify-between items-center cursor-not-allowed">
                      <span>{selectedReport.currency_of_record === 25 ? "2024-25" : selectedReport.currency_of_record === 26 ? "2025-26" : selectedReport.currency_of_record} Currency</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>

                  {/* Audience */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Audience</label>
                    <div className="w-full px-2 py-1.5 bg-gray-100/80 border border-gray-200 rounded-md flex flex-wrap gap-1 items-center min-h-[38px] cursor-not-allowed">
                      {selectedReport.audience_ids?.length > 0 ? (
                        selectedReport.audience_ids.map((aud, index) => {
                          // Map via audienceOptions
                          const matched = audienceOptions.find(a => String(a.audienceId) === String(aud) || a.audienceUUId === aud);
                          const displayName = matched ? matched.name : aud;
                          return (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-200/70 border border-gray-300 text-gray-800 rounded">
                              {displayName}
                            </span>
                          )
                        })
                      ) : selectedReport.audiences?.length > 0 ? (
                        selectedReport.audiences.map((aud, index) => {
                          const matched = audienceOptions.find(a => String(a.audienceId) === String(aud) || a.audienceUUId === aud);
                          const displayName = matched ? matched.name : aud;
                          return (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-200/70 border border-gray-300 text-gray-800 rounded">
                              {displayName}
                            </span>
                          )
                        })
                      ) : (
                        <span className="text-gray-400 px-1">N/A</span>
                      )}
                    </div>
                  </div>

                  {/* Datasource Groups */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Datasource Groups</label>
                    <div className="w-full px-2 py-1.5 bg-gray-100/80 border border-gray-200 rounded-md flex flex-wrap gap-1 items-center min-h-[38px] cursor-not-allowed">
                      {selectedReport.data_source_group_ids?.length > 0 ? (
                        selectedReport.data_source_group_ids.map((dsg, index) => {
                          const matched = datasourceGroupOptions.find(g => String(g.id) === String(dsg));
                          if (!matched) return null; // Hide if no name found
                          return (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-200/70 border border-gray-300 text-gray-800 rounded">
                              {matched.name}
                            </span>
                          )
                        })
                      ) : "None selected"}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {(selectedReport.latest_request?.outputs?.[0]?.link || selectedReport.latest_request?.outputs?.[1]?.link) && (
                    <div className="flex gap-3 pt-2">
                      {selectedReport.latest_request?.outputs?.[0]?.link && (
                        <button
                          type="button"
                          onClick={() => window.open(selectedReport.latest_request.outputs[0].link, '_blank')}
                          className="px-6 py-2 text-sm font-semibold text-gray-900 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-sm"
                          style={{ backgroundColor: '#7defef' }}
                        >
                          Data Export
                        </button>
                      )}

                      {selectedReport.latest_request?.outputs?.[1]?.link && (
                        <button
                          type="button"
                          onClick={() => window.open(selectedReport.latest_request.outputs[1].link, '_blank')}
                          className="px-6 py-2 text-sm font-semibold text-gray-900 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-sm"
                          style={{ backgroundColor: '#0dcaf0' }}
                        >
                          Spot Level Export
                        </button>
                      )}

                      {selectedReport.latest_request?.outputs?.[1]?.link && (
                        <button
                          type="button"
                          onClick={() => setShowEmailModal(true)}
                          className="px-6 py-2 text-sm font-semibold text-gray-900 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-sm"
                          style={{ backgroundColor: '#ffd966' }}
                        >
                          Send Email
                        </button>
                      )}
                    </div>
                  )}

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
              className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto hide-scrollbar"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audience
                  </label>
                  {loadingOptions ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-200 border-t-dark-blue rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="w-full border border-gray-300 rounded-lg bg-white relative">
                      <div className="flex flex-wrap gap-2 p-2">
                        {formData.audienceIds.map((id) => {
                          const matchedAudience = audienceOptions.find(a => String(a.audienceId) === String(id) || a.audienceUUId === id);
                          if (!matchedAudience) return null;
                          const label = matchedAudience.name;
                          return (
                            <div key={id} className="flex items-center gap-1 bg-gray-100 border border-gray-200 text-gray-800 px-2 py-1 rounded text-xs truncate max-w-[90%]">
                              <span className="truncate">{label}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData(prev => ({
                                    ...prev,
                                    audienceIds: prev.audienceIds.filter(v => v !== id)
                                  }));
                                }}
                                className="text-gray-400 hover:text-red-500 focus:outline-none"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                        <select
                          className="flex-1 min-w-[150px] outline-none bg-transparent text-sm text-gray-700 border-none appearance-none"
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && !formData.audienceIds.includes(val)) {
                              setFormData(prev => ({
                                ...prev,
                                audienceIds: [...prev.audienceIds, val]
                              }));
                            }
                          }}
                        >
                          <option value="" disabled hidden>
                            {audienceOptions.length === 0 ? "Loading audiences..." : "Select audience..."}
                          </option>
                          {audienceOptions
                            .filter(a => !formData.audienceIds.includes(String(a.audienceId)) && !formData.audienceIds.includes(a.audienceUUId))
                            .map((audience) => (
                              <option key={audience.audienceId} value={audience.audienceId}>
                                {audience.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datasource Groups
                  </label>
                  {loadingOptions ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-200 border-t-dark-blue rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="w-full border border-gray-300 rounded-lg bg-white relative">
                      <div className="flex flex-wrap gap-2 p-2">
                        {formData.datasourceGroupIds.map((id) => {
                          const matchedGroup = datasourceGroupOptions.find(g => String(g.id) === String(id));
                          if (!matchedGroup) return null;
                          const label = matchedGroup.name;
                          return (
                            <div key={id} className="flex items-center gap-1 bg-gray-100 border border-gray-200 text-gray-800 px-2 py-1 rounded text-xs truncate max-w-[90%]">
                              <span className="truncate">{label}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData(prev => ({
                                    ...prev,
                                    datasourceGroupIds: prev.datasourceGroupIds.filter(v => v !== id)
                                  }));
                                }}
                                className="text-gray-400 hover:text-red-500 focus:outline-none"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                        <select
                          className="flex-1 min-w-[150px] outline-none bg-transparent text-sm text-gray-700 border-none appearance-none"
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && !formData.datasourceGroupIds.includes(val)) {
                              setFormData(prev => ({
                                ...prev,
                                datasourceGroupIds: [...prev.datasourceGroupIds, val]
                              }));
                            }
                          }}
                        >
                          <option value="" disabled hidden>
                            {datasourceGroupOptions.length === 0 ? "Loading groups..." : "Select datasource group..."}
                          </option>
                          {datasourceGroupOptions
                            .filter(g => !formData.datasourceGroupIds.includes(String(g.id)))
                            .map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
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
      {/* Email Modal Overlay */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Send Spot Level Export</h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">To Email *</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
                  placeholder="example@company.com"
                  autoFocus
                />
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end gap-2 rounded-b-xl border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={emailLoading}
                  className="px-4 py-2 bg-dark-blue text-white rounded-md text-sm font-medium hover:bg-dark-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {emailLoading && <Loader2 size={14} className="animate-spin" />}
                  Send Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdMeasurementReports;