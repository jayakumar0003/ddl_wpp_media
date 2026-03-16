import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Eye,
  ArrowLeft,
  Plus,
  Calendar,
  DollarSign,
  Clock,
  Search,
  X,
  Filter,
  Download,
  Trash2,
  Loader2,
} from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo-wpp-media.png";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background-gradient-lights.jpg";
import { fetchCampaigns, fetchCampaignPlans, fetchReachInfo, fetchAudiencesList, submitCampaign } from "../api/campaignsApi";

const VACampaignPlanning = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaignPlans, setSelectedCampaignPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  
  // Reach Info Modal States
  const [isReachModalOpen, setIsReachModalOpen] = useState(false);
  const [selectedPlanReach, setSelectedPlanReach] = useState([]);
  const [loadingReach, setLoadingReach] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Plans Pagination
  const [currentPlanPage, setCurrentPlanPage] = useState(1);
  const [plansPerPage] = useState(10);

  // Form states
  const [formData, setFormData] = useState({
    displayName: "",
    audienceIds: [],
    startDate: "",
    endDate: "",
    creativeDuration: "",
  });

  const [audienceOptions, setAudienceOptions] = useState([]);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Temporary audience data for dropdown
  const tempAudiences = [
    { audienceUUId: "aud-001", name: "Adults 18-49" },
    { audienceUUId: "aud-002", name: "Adults 25-54" },
    { audienceUUId: "aud-003", name: "Women 18-34" },
    { audienceUUId: "aud-004", name: "Men 25-54" },
    { audienceUUId: "aud-005", name: "Hispanic Adults" },
    { audienceUUId: "aud-006", name: "Affluent Households" },
    { audienceUUId: "aud-007", name: "Parents with Children" },
    { audienceUUId: "aud-008", name: "Gen Z" },
    { audienceUUId: "aud-009", name: "Millennials" },
    { audienceUUId: "aud-010", name: "Baby Boomers" },
  ];

  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
        setFilteredCampaigns(data);
      } catch (error) {
        console.error("Failed to load campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();

    // Load audience options
    const loadAudiences = async () => {
       try {
         const data = await fetchAudiencesList();
         setAudienceOptions(data);
       } catch (error) {
         console.error("Failed to load audience options", error);
       }
    };
    loadAudiences();
  }, []);

  useEffect(() => {
    let filtered = campaigns;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter(
        (campaign) =>
          (campaign.display_name || "").toLowerCase().includes(term) ||
          (campaign.id?.toString() || "").toLowerCase().includes(term) ||
          (campaign.media_start_date || "").toLowerCase().includes(term) ||
          (campaign.media_end_date || "").toLowerCase().includes(term) ||
          (campaign.currency_of_record?.toString() || "").toLowerCase().includes(term) ||
          (campaign.created_at || "").toLowerCase().includes(term) ||
          (campaign.status || "").toLowerCase().includes(term)
      );
    }

    setFilteredCampaigns(filtered);
    setCurrentPage(1);
  }, [searchTerm, campaigns]);

  const handleView = async (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
    setLoadingPlans(true);
    
    try {
      const plans = await fetchCampaignPlans(campaign.id);
      console.log(plans)
      setSelectedCampaignPlans(plans);
    } catch (error) {
      console.error("Failed to load campaign plans:", error);
      setSelectedCampaignPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
    setSelectedCampaignPlans([]);
    setCurrentPlanPage(1);
  };

  const handleViewPlanReach = async (plan) => {
    setSelectedPlanName(plan.display_name);
    setIsReachModalOpen(true);
    setLoadingReach(true);
    
    try {
      const reachData = await fetchReachInfo(plan.id);
      setSelectedPlanReach(reachData);
    } catch (error) {
      console.error("Failed to fetch reach info:", error);
      setSelectedPlanReach([]);
    } finally {
      setLoadingReach(false);
    }
  };

  const closeReachModal = () => {
    setIsReachModalOpen(false);
    setSelectedPlanReach([]);
    setSelectedPlanName("");
  };

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormError(null);
    setFormData({
      displayName: "",
      audienceIds: [],
      startDate: "",
      endDate: "",
      creativeDuration: "",
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const { displayName, audienceIds, startDate, endDate, creativeDuration } =
      formData;

    if (!displayName) return alert("Display Name is required.");
    if (!audienceIds || audienceIds.length === 0)
      return alert("At least one Audience must be selected.");
    if (!startDate) return alert("Start Date is required.");
    if (!endDate) return alert("End Date is required.");
    if (!creativeDuration) return alert("Creative Duration is required.");

    const creativeDurationsArray = creativeDuration
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d !== "")
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0);

    if (creativeDurationsArray.length === 0) {
      return alert("Valid Creative Duration(s) required.");
    }

    const payload = {
      display_name: displayName,
      audience_ids: audienceIds,
      media_end_date: endDate,
      media_start_date: startDate,
      creative_durations_seconds: creativeDurationsArray,
      inventory_set_id: "c37249ab-d711-4a18-83d5-027306670cb5",
      agency_advertiser_id: 3252,
    };

    setIsSubmitting(true);
    try {
        await submitCampaign(payload);
        alert("Campaign submitted successfully!");
        handleCloseModal();
        
        // Refetch campaigns to show the new one
        setLoading(true);
        const data = await fetchCampaigns();
        setCampaigns(data);
        setFilteredCampaigns(data);
        setLoading(false);
    } catch (error) {
        console.error("Submit failed:", error);
        
        // Handle validation format from backend specifically
        if (error.status === 400 && error.data?.details?.details?.[0]?.field_violations) {
            const violations = error.data.details.details[0].field_violations;
            const errorMessages = violations.map(v => v.description).join(" | ");
            setFormError(errorMessages || error.data?.message || "Validation failed.");
        } else if (error.data?.message) {
            setFormError(error.data.message);
        } else {
            setFormError("Failed to submit campaign. Please try again.");
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCampaigns.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

  // Plans Pagination
  const indexOfLastPlan = currentPlanPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlanItems = selectedCampaignPlans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPlanPages = Math.ceil(selectedCampaignPlans.length / plansPerPage);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "planned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
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
          <main className="px-4 ">
            {/* Main content container */}
            <div className="w-full max-w-8xl mx-auto bg-white rounded-xl p-4 sm:p-5">
              {/* Page Header - Blue */}
              <div className="bg-dark-blue rounded-lg p-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-base md:text-lg font-semibold">
                    VA Campaigns Planning
                  </h2>
                </div>
                <button
                  onClick={handleCreateCampaign}
                  className="bg-lemon/90 text-dark-blue px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-lemon transition-colors whitespace-nowrap inline-flex items-center gap-1"
                >
                  <Plus size={14} />
                  Create Campaign
                </button>
              </div>

              {/* Filter Row */}
              <div className="mb-4">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
                    placeholder="Search campaigns..."
                  />
                  <Search
                    className="absolute left-2 top-2.5 text-gray-400"
                    size={16}
                  />
                </div>
              </div>

              {/* Loading Overlay */}
              {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-opacity">
                     <Loader2 className="w-8 h-8 text-dark-blue animate-spin" />
                </div>
              )}

              {/* Table */}
              {!loading && (
                <div className="bg-dark-blue rounded-lg border border-gray-200 overflow-x-auto hide-scrollbar">
                  <table className="min-w-[900px] w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-dark-blue">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[150px]">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[90px]">
                          Start Date
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[90px]">
                          End Date
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">
                          Currency
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[90px]">
                          Created On
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[30px]"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-3 py-4 text-center text-sm text-gray-500"
                          >
                            No campaigns found
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((campaign) => (
                          <tr
                            key={campaign.id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-3 py-2 text-xs text-gray-900 font-medium break-words whitespace-normal">
                              {campaign.display_name}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Calendar
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>
                                  {formatDate(campaign.media_start_date)}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Calendar
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>
                                  {formatDate(campaign.media_end_date)}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <DollarSign
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>{campaign.currency_of_record}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Clock
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>{campaign.created_at}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 align-top">
                              <span
                                className={`px-1.5 py-0.5 text-xs font-medium rounded-full inline-block ${getStatusBadgeClass(
                                  campaign.status || ""
                                )}`}
                              >
                                {campaign.status ? campaign.status.charAt(0).toUpperCase() +
                                  campaign.status.slice(1) : "N/A"}
                              </span>
                            </td>
                            <td className="px-3 py-2 align-top">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleView(campaign)}
                                className="text-blue-600 hover:text-blue-800"
                                title="View"
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
              )}

              {/* Pagination */}
              {!loading && filteredCampaigns.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 text-xs text-gray-700">
                  <div>
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredCampaigns.length)} of{" "}
                    {filteredCampaigns.length}
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2.5 py-1 rounded border text-xs font-medium ${
                          currentPage === page
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

      {/* View Campaign Modal */}
      {isModalOpen && selectedCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto hide-scrollbar">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-[16px] text-left overflow-hidden shadow-2xl transform transition-all sm:my-5 sm:align-middle w-full max-w-6xl border border-gray-100/50">
              <div className="bg-dark-blue/90 backdrop-blur-md px-5 py-4 flex justify-between items-center sm:px-6">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-wide">
                    View Campaign
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="bg-white/10 p-1.5 rounded-full text-white hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              <div className="bg-white px-5 pt-5 sm:px-6 max-h-[80vh] overflow-y-auto hide-scrollbar">
                
                {/* Campaign Details Grid Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/75 overflow-hidden mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/75 bg-gray-50/30">
                    
                    {/* Left Column */}
                    <div className="divide-y divide-gray-200/75">
                      <div className="flex flex-col sm:flex-row px-4 py-3 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 group-hover:text-gray-500 transition-colors">Campaign Name</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-900 font-medium break-all">{selectedCampaign.display_name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-3 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 group-hover:text-gray-500 transition-colors">Start Date</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-600 break-words mt-0.5">{selectedCampaign.media_start_date}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-3 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 group-hover:text-gray-500 transition-colors">End Date</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-600 break-words mt-0.5">{selectedCampaign.media_end_date}</span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="divide-y divide-gray-200/75">
                      <div className="flex flex-col sm:flex-row px-4 py-3 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 sm:pl-2 group-hover:text-gray-500 transition-colors">Currency of Record</span>
                        <span className="w-full sm:w-2/3 text-sm text-gray-900 font-medium sm:pl-2">
                          {selectedCampaign.currency_of_record}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row px-4 py-3 hover:bg-gray-50/50 transition-colors group">
                        <span className="w-full sm:w-1/3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0 sm:pl-2 group-hover:text-gray-500 transition-colors">Status</span>
                        <span className="w-full sm:w-2/3 sm:pl-2">
                           <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-md inline-flex items-center shadow-sm border border-black/5 ${getStatusBadgeClass(selectedCampaign.status)}`}>
                            {selectedCampaign.status}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plans Table Section */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-bold text-gray-800">Plans</h4>
                    <button 
                      onClick={() => navigate('/plan', { state: { campaign: selectedCampaign } })}
                      className="bg-dark-blue text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm hover:opacity-90"
                    >
                      Create Plan
                    </button>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <label className="text-sm text-gray-600">Search:</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-x-auto hide-scrollbar max-h-80 overflow-y-auto mb-4">
                    {loadingPlans ? (
                      <div className="w-full px-4 py-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-3 border-blue-200 border-t-[#1a73e8] rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-gray-500 animate-pulse">Loading Plans...</span>
                        </div>
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 sticky top-0 bg-white z-10">
                          <tr>
                            <th className="px-4 py-3 cursor-pointer">
                                <div className="flex items-center gap-1">ID <span className="text-gray-300 ml-1 leading-none">♦</span></div>
                            </th>
                            <th className="px-4 py-3 cursor-pointer">
                                <div className="flex items-center gap-1">Name <span className="text-gray-300 ml-1 leading-none">♦</span></div>
                            </th>
                            <th className="px-4 py-3 cursor-pointer">
                                <div className="flex items-center gap-1">Budget <span className="text-gray-300 ml-1 leading-none">♦</span></div>
                            </th>
                            <th className="px-4 py-3 cursor-pointer">
                                <div className="flex items-center gap-1">Created On <span className="text-gray-400 ml-1 leading-none transform rotate-180 inline-block">▼</span></div>
                            </th>
                            <th className="px-4 py-3 cursor-pointer">
                                <div className="flex items-center gap-1">Status <span className="text-gray-300 ml-1 leading-none">♦</span></div>
                            </th>
                            <th className="px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                           {currentPlanItems.length > 0 ? (
                              currentPlanItems.map((plan) => (
                                <tr key={plan.id} className="hover:bg-gray-50 transition-colors text-gray-700">
                                  <td className="px-4 py-3">{plan.id}</td>
                                  <td className="px-4 py-3">{plan.display_name}</td>
                                  <td className="px-4 py-3">${plan.budget ? Number(plan.budget).toLocaleString() : 'N/A'}</td>
                                  <td className="px-4 py-3">{formatDate(plan.created_at)}</td>
                                  <td className="px-4 py-3">{plan.status}</td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-3 text-gray-500">
                                      <button onClick={() => handleViewPlanReach(plan)} className="hover:text-blue-600 transition-colors" title="View Reach Info">
                                        <Eye size={16} />
                                      </button>
                                      <button className="hover:text-green-600 transition-colors" title="Download">
                                        <Download size={16} />
                                      </button>
                                      <button className="hover:text-red-500 transition-colors" title="Delete">
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                           ) : (
                               <tr>
                                   <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No plans found for this campaign.</td>
                               </tr>
                           )}
                        </tbody>
                      </table>
                    )}
                  </div>
                  
                  {/* Internal Pagination Controls */}
                  {selectedCampaignPlans.length > 0 && (
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <div>Showing {indexOfFirstPlan + 1} to {Math.min(indexOfLastPlan, selectedCampaignPlans.length)} of {selectedCampaignPlans.length} entries</div>
                          <div className="flex items-center gap-1">
                              <button 
                                onClick={() => setCurrentPlanPage((prev) => Math.max(prev - 1, 1))} 
                                disabled={currentPlanPage === 1}
                                className={`px-2 py-1 rounded border ${currentPlanPage === 1 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50' }`}
                              >
                                  Previous
                              </button>
                              <button 
                                onClick={() => setCurrentPlanPage((prev) => Math.min(prev + 1, totalPlanPages))} 
                                disabled={currentPlanPage === totalPlanPages}
                                className={`px-2 py-1 rounded border ${currentPlanPage === totalPlanPages ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50' }`}
                              >
                                  Next
                              </button>
                          </div>
                      </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reach Info Nested Modal */}
      {isReachModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto hide-scrollbar">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
              onClick={closeReachModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-xl text-left shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-4xl border border-gray-100 overflow-hidden">
              <div className="bg-dark-blue/90 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center rounded-t-xl">
                <h3 className="text-lg font-semibold text-white tracking-wide">
                  Reach Info
                </h3>
                <button
                  onClick={closeReachModal}
                  className="bg-white/10 p-1.5 rounded-full text-white hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-white px-6 py-5 rounded-b-xl overflow-hidden">
                <div className="mb-4">
                  <span className="font-bold text-gray-800 text-sm">Plan Name: </span>
                  <span className="text-sm text-gray-600 ml-2">{selectedPlanName}</span>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-[60vh] overflow-y-auto hide-scrollbar bg-gray-50/50">
                  {loadingReach ? (
                    <div className="w-full px-4 py-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-3 border-blue-200 border-t-[#1a73e8] rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-gray-500 animate-pulse">Loading Reach Data...</span>
                        </div>
                    </div>
                  ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <tbody className="divide-y divide-gray-200/60">
                         {selectedPlanReach.length > 0 ? (
                            selectedPlanReach.map((reachItem, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors bg-white">
                                <td className="px-5 py-3.5 text-gray-700 max-w-xl truncate" title={reachItem.Metric}>{reachItem.Metric}</td>
                                <td className="px-5 py-3.5 text-gray-900 font-medium text-right w-64">{reachItem.Total}</td>
                              </tr>
                            ))
                         ) : (
                             <tr>
                                 <td colSpan="2" className="px-4 py-6 text-center text-gray-500">No reach metrics found.</td>
                             </tr>
                         )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
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
              <div className="bg-dark-blue p-4 rounded-t-xl flex items-center justify-between">
                <h2 className="text-white text-lg font-semibold">
                  Create Campaign
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5">
                {formError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{formError}</span>
                  </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={formData.displayName}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
                    placeholder="Enter campaign name"
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Audience
                  </label>
                  <div className="w-full border border-gray-300 rounded-lg bg-white relative">
                    <div className="flex flex-wrap gap-2 p-2">
                       {formData.audienceIds.map((id) => {
                          const matchedAudience = audienceOptions.find(a => a.audienceUUId === id);
                          const label = matchedAudience ? matchedAudience.name : id;
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
                         {audienceOptions.filter(a => !formData.audienceIds.includes(a.audienceUUId)).map((audience) => (
                           <option key={audience.audienceUUId} value={audience.audienceUUId}>
                             {audience.name}
                           </option>
                         ))}
                       </select>
                    </div>
                  </div>
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

                <div className="mb-6">
                  <label
                    htmlFor="creativeDuration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Creative Duration (seconds)
                  </label>
                  <input
                    type="text"
                    id="creativeDuration"
                    value={formData.creativeDuration}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
                    placeholder="e.g., 15, 30, 60"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate multiple values with commas
                  </p>
                </div>

                {/* Hidden fields */}
                <input
                  type="hidden"
                  id="inventorySetId"
                  value="c37249ab-d711-4a18-83d5-027306670cb5"
                />
                <input type="hidden" id="agencyAdvertiserId" value="3252" />

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
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2 bg-dark-blue text-white rounded-full text-sm font-medium hover:bg-dark-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit"}
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

export default VACampaignPlanning;