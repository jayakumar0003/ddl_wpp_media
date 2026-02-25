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
} from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo-wpp-media.png";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background-gradient-lights.jpg";

const VACampaignPlanning = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form states
  const [formData, setFormData] = useState({
    displayName: "",
    audienceIds: [],
    startDate: "",
    endDate: "",
    creativeDuration: "",
  });

  const [audienceOptions, setAudienceOptions] = useState([]);

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

  // Enhanced temporary data with additional fields
  const tempCampaigns = [
    {
      id: 1,
      display_name: "Summer Sales Campaign 2025",
      media_start_date: "2025-06-01",
      media_end_date: "2025-08-31",
      currency_of_record: "USD",
      created_at: "2025-03-15 10:30 AM",
      status: "active",
      description: "Summer sales campaign targeting young adults with seasonal promotions",
      budget: 50000,
      target_audience: "Adults 18-34",
      creative_durations: [15, 30],
      agency: "WPP Media",
      advertiser: "Summer Brands Inc.",
      tags: ["summer", "sales", "seasonal"]
    },
    {
      id: 2,
      display_name: "Holiday Special Q4",
      media_start_date: "2025-10-01",
      media_end_date: "2025-12-31",
      currency_of_record: "USD",
      created_at: "2025-04-20 02:15 PM",
      status: "draft",
      description: "Q4 holiday campaign featuring gift guides and special promotions",
      budget: 75000,
      target_audience: "All Adults",
      creative_durations: [15, 30, 60],
      agency: "WPP Media",
      advertiser: "Holiday Retail Co.",
      tags: ["holiday", "q4", "gifts"]
    },
    {
      id: 3,
      display_name: "Spring Launch - New Products",
      media_start_date: "2025-03-01",
      media_end_date: "2025-05-30",
      currency_of_record: "EUR",
      created_at: "2025-02-10 09:45 AM",
      status: "completed",
      description: "Spring product launch campaign for new line of consumer goods",
      budget: 60000,
      target_audience: "Early Adopters",
      creative_durations: [15, 30],
      agency: "WPP Media Europe",
      advertiser: "Innovation Labs",
      tags: ["spring", "launch", "new products"]
    },
    {
      id: 4,
      display_name: "Back to School Campaign",
      media_start_date: "2025-07-15",
      media_end_date: "2025-09-15",
      currency_of_record: "USD",
      created_at: "2025-05-05 11:20 AM",
      status: "active",
      description: "Back to school campaign targeting parents and students",
      budget: 45000,
      target_audience: "Parents, Students",
      creative_durations: [15, 30],
      agency: "WPP Media",
      advertiser: "School Supplies Co.",
      tags: ["back-to-school", "education", "parents"]
    },
    {
      id: 5,
      display_name: "Black Friday Weekend Special",
      media_start_date: "2025-11-24",
      media_end_date: "2025-11-27",
      currency_of_record: "USD",
      created_at: "2025-06-18 03:30 PM",
      status: "planned",
      description: "Black Friday weekend flash sale campaign",
      budget: 100000,
      target_audience: "Deal Seekers",
      creative_durations: [15, 30],
      agency: "WPP Media",
      advertiser: "Retail Giant",
      tags: ["black-friday", "holiday", "sales"]
    },
    {
      id: 6,
      display_name: "New Year Resolution Campaign",
      media_start_date: "2025-12-26",
      media_end_date: "2026-01-31",
      currency_of_record: "GBP",
      created_at: "2025-07-22 10:00 AM",
      status: "planned",
      description: "New Year resolution themed campaign for fitness and wellness products",
      budget: 55000,
      target_audience: "Fitness Enthusiasts",
      creative_durations: [15, 30, 45],
      agency: "WPP Media UK",
      advertiser: "Wellness Brands",
      tags: ["new-year", "fitness", "wellness"]
    },
    {
      id: 7,
      display_name: "Valentine's Day Special",
      media_start_date: "2026-02-01",
      media_end_date: "2026-02-14",
      currency_of_record: "USD",
      created_at: "2025-08-14 01:45 PM",
      status: "draft",
      description: "Valentine's Day campaign for gift and experience brands",
      budget: 40000,
      target_audience: "Couples",
      creative_durations: [15, 30],
      agency: "WPP Media",
      advertiser: "Gift Co.",
      tags: ["valentine", "gifts", "romance"]
    },
    {
      id: 8,
      display_name: "Spring Clearance Sale",
      media_start_date: "2026-03-15",
      media_end_date: "2026-04-15",
      currency_of_record: "CAD",
      created_at: "2025-09-01 11:15 AM",
      status: "draft",
      description: "Spring clearance sale campaign for fashion retailers",
      budget: 35000,
      target_audience: "Fashion Shoppers",
      creative_durations: [15, 30],
      agency: "WPP Media Canada",
      advertiser: "Fashion Outlet",
      tags: ["spring", "clearance", "fashion"]
    },
    {
      id: 9,
      display_name: "Summer Music Festival Promotion",
      media_start_date: "2026-06-10",
      media_end_date: "2026-07-10",
      currency_of_record: "USD",
      created_at: "2025-10-05 02:30 PM",
      status: "planned",
      description: "Summer music festival sponsorship and promotion campaign",
      budget: 80000,
      target_audience: "Music Fans",
      creative_durations: [15, 30, 60],
      agency: "WPP Media",
      advertiser: "Festival Productions",
      tags: ["summer", "music", "festival"]
    },
    {
      id: 10,
      display_name: "Back to School - College Edition",
      media_start_date: "2026-07-20",
      media_end_date: "2026-08-30",
      currency_of_record: "USD",
      created_at: "2025-11-12 09:00 AM",
      status: "draft",
      description: "College-focused back to school campaign for dorm essentials",
      budget: 50000,
      target_audience: "College Students",
      creative_durations: [15, 30],
      agency: "WPP Media",
      advertiser: "Campus Supplies",
      tags: ["college", "back-to-school", "students"]
    },
    {
      id: 11,
      display_name: "Halloween Special Campaign",
      media_start_date: "2026-10-01",
      media_end_date: "2026-10-31",
      currency_of_record: "USD",
      created_at: "2025-12-03 04:20 PM",
      status: "planned",
      description: "Halloween themed campaign for costumes and candy brands",
      budget: 45000,
      target_audience: "Families, Young Adults",
      creative_durations: [15, 30],
      agency: "WPP Media",
      advertiser: "Halloween Brands",
      tags: ["halloween", "seasonal", "costumes"]
    },
    {
      id: 12,
      display_name: "Christmas Gift Guide",
      media_start_date: "2026-11-15",
      media_end_date: "2026-12-24",
      currency_of_record: "GBP",
      created_at: "2026-01-18 10:45 AM",
      status: "draft",
      description: "Christmas gift guide campaign featuring curated product selections",
      budget: 90000,
      target_audience: "Holiday Shoppers",
      creative_durations: [15, 30, 45],
      agency: "WPP Media UK",
      advertiser: "Gift Guide Ltd.",
      tags: ["christmas", "gifts", "holiday"]
    },
  ];

  useEffect(() => {
    // Simulate API call for campaigns
    setLoading(true);
    setTimeout(() => {
      setCampaigns(tempCampaigns);
      setFilteredCampaigns(tempCampaigns);
      setLoading(false);
    }, 1000);

    // Load audience options
    setAudienceOptions(tempAudiences);
  }, []);

  useEffect(() => {
    let filtered = campaigns;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter(
        (campaign) =>
          campaign.display_name.toLowerCase().includes(term) ||
          campaign.id.toString().includes(term) ||
          campaign.media_start_date.toLowerCase().includes(term) ||
          campaign.media_end_date.toLowerCase().includes(term) ||
          campaign.currency_of_record.toLowerCase().includes(term) ||
          campaign.created_at.toLowerCase().includes(term) ||
          campaign.status.toLowerCase().includes(term)
      );
    }

    setFilteredCampaigns(filtered);
    setCurrentPage(1);
  }, [searchTerm, campaigns]);

  const handleView = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();

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

    console.log("payload:", payload);
    alert("Campaign submitted successfully! (Demo mode)");
    handleCloseModal();
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCampaigns.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

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
              {/* Page Header - Blue */}
              <div className="bg-dark-blue rounded-lg p-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-lg md:text-xl font-semibold">
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
                <div className="fixed inset-0 bg-white/30 flex items-center justify-center z-50">
                  <div className="w-12 h-12 border-3 border-blue-200 border-t-dark-blue rounded-full animate-spin"></div>
                </div>
              )}

              {/* Table */}
              {!loading && (
                <div className="bg-dark-blue rounded-lg border border-gray-200 overflow-x-auto">
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
                                  campaign.status
                                )}`}
                              >
                                {campaign.status.charAt(0).toUpperCase() +
                                  campaign.status.slice(1)}
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

      {/* View Campaign Modal */}
      {isModalOpen && selectedCampaign && (
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
                  Campaign Details - {selectedCampaign.display_name}
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
                      <label className="block text-xs font-medium text-gray-500 mb-1">Campaign ID</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedCampaign.id}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Display Name</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                        {selectedCampaign.display_name}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedCampaign.description || 'No description available'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Target Audience</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedCampaign.target_audience || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Budget</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedCampaign.budget ? `${selectedCampaign.currency_of_record} ${selectedCampaign.budget.toLocaleString()}` : 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Creative Durations (sec)</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedCampaign.creative_durations ? selectedCampaign.creative_durations.join(', ') : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {formatDate(selectedCampaign.media_start_date)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {formatDate(selectedCampaign.media_end_date)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedCampaign.currency_of_record}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <div className="text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${getStatusBadgeClass(selectedCampaign.status)}`}>
                          {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Created On</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedCampaign.created_at}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Agency / Advertiser</label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedCampaign.agency || 'WPP Media'} / {selectedCampaign.advertiser || 'N/A'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
                      <div className="flex flex-wrap gap-1">
                        {selectedCampaign.tags && selectedCampaign.tags.length > 0 ? (
                          selectedCampaign.tags.map((tag, index) => (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto"
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
                    htmlFor="audienceIds"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Audience
                  </label>
                  <select
                    id="audienceIds"
                    value={formData.audienceIds[0] || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        audienceIds: [e.target.value],
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
                  >
                    <option value="">Select Audience</option>
                    {audienceOptions.map((audience) => (
                      <option
                        key={audience.audienceUUId}
                        value={audience.audienceUUId}
                      >
                        {audience.name}
                      </option>
                    ))}
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
                    className="w-full sm:w-auto px-4 py-2 bg-dark-blue text-white rounded-full text-sm font-medium hover:bg-dark-blue/80 transition-colors"
                  >
                    Submit
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