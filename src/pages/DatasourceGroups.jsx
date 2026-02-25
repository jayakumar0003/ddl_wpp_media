import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Eye,
  Files,
  Trash2,
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

const DatasourceGroups = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [datasourceGroups, setDatasourceGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form states
  const [formData, setFormData] = useState({
    displayName: "",
    description: "",
    startDate: "",
    endDate: "",
    currencyOfRecord: "25",
    dsFilterIds: [],
  });

  const [datasourceFilters, setDatasourceFilters] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Enhanced temporary data for datasource groups with additional fields
  const tempDatasourceGroups = [
    {
      id: "dsg-001",
      name: "Q1 2025 Campaign Data",
      filter_start_date: "2025-01-01",
      filter_end_date: "2025-03-31",
      currency_of_record: "USD",
      created_at: "2025-01-15 10:30 AM",
      description:
        "First quarter campaign data for 2025 including all media metrics",
      advertiser: "Global Brands Inc.",
      agency: "WPP Media",
      status: "active",
      data_sources: [
        "Post Log File - January 2025",
        "Post Log File - February 2025",
        "Post Log File - March 2025",
      ],
      tags: ["q1", "2025", "campaign"],
    },
    {
      id: "dsg-002",
      name: "Summer Promotions",
      filter_start_date: "2025-06-01",
      filter_end_date: "2025-08-31",
      currency_of_record: "USD",
      created_at: "2025-02-20 02:15 PM",
      description: "Summer promotional campaign data across multiple channels",
      advertiser: "Summer Brands Co.",
      agency: "WPP Media",
      status: "active",
      data_sources: [
        "Post Log File - June 2025",
        "Post Log File - July 2025",
        "Post Log File - August 2025",
      ],
      tags: ["summer", "promotions", "seasonal"],
    },
    {
      id: "dsg-003",
      name: "Holiday Season 2025",
      filter_start_date: "2025-11-01",
      filter_end_date: "2025-12-31",
      currency_of_record: "USD",
      created_at: "2025-03-10 09:45 AM",
      description: "Holiday season campaign data for Q4 2025",
      advertiser: "Holiday Retail Group",
      agency: "WPP Media",
      status: "planned",
      data_sources: [
        "Post Log File - November 2025",
        "Post Log File - December 2025",
      ],
      tags: ["holiday", "q4", "seasonal"],
    },
    {
      id: "dsg-004",
      name: "European Campaign Data",
      filter_start_date: "2025-04-01",
      filter_end_date: "2025-06-30",
      currency_of_record: "EUR",
      created_at: "2025-02-05 11:20 AM",
      description: "European market campaign data for Q2 2025",
      advertiser: "Euro Brands Ltd.",
      agency: "WPP Media Europe",
      status: "completed",
      data_sources: [
        "Post Log File - April 2025",
        "Post Log File - May 2025",
        "Post Log File - June 2025",
      ],
      tags: ["europe", "q2", "international"],
    },
    {
      id: "dsg-005",
      name: "UK Market Analysis",
      filter_start_date: "2025-07-01",
      filter_end_date: "2025-09-30",
      currency_of_record: "GBP",
      created_at: "2025-03-18 03:30 PM",
      description: "UK specific market analysis data for Q3 2025",
      advertiser: "UK Brands Ltd.",
      agency: "WPP Media UK",
      status: "planned",
      data_sources: [
        "Post Log File - July 2025",
        "Post Log File - August 2025",
        "Post Log File - September 2025",
      ],
      tags: ["uk", "q3", "market-analysis"],
    },
    {
      id: "dsg-006",
      name: "Back to School Data",
      filter_start_date: "2025-07-15",
      filter_end_date: "2025-09-15",
      currency_of_record: "USD",
      created_at: "2025-04-22 10:00 AM",
      description: "Back to school campaign data for retail clients",
      advertiser: "Education Supplies Inc.",
      agency: "WPP Media",
      status: "active",
      data_sources: [
        "Post Log File - July 2025",
        "Post Log File - August 2025",
        "Post Log File - September 2025",
      ],
      tags: ["back-to-school", "education", "retail"],
    },
    {
      id: "dsg-007",
      name: "Black Friday Weekend",
      filter_start_date: "2025-11-24",
      filter_end_date: "2025-11-27",
      currency_of_record: "USD",
      created_at: "2025-05-14 01:45 PM",
      description: "Black Friday weekend flash campaign data",
      advertiser: "Retail Giant",
      agency: "WPP Media",
      status: "planned",
      data_sources: ["Post Log File - November 2025"],
      tags: ["black-friday", "holiday", "flash-sale"],
    },
    {
      id: "dsg-008",
      name: "New Year Resolution",
      filter_start_date: "2025-12-26",
      filter_end_date: "2026-01-31",
      currency_of_record: "USD",
      created_at: "2025-06-01 11:15 AM",
      description:
        "New Year resolution campaign for fitness and wellness brands",
      advertiser: "Wellness Brands",
      agency: "WPP Media",
      status: "planned",
      data_sources: [
        "Post Log File - December 2025",
        "Post Log File - January 2026",
      ],
      tags: ["new-year", "fitness", "wellness"],
    },
    {
      id: "dsg-009",
      name: "Canadian Market Data",
      filter_start_date: "2025-03-15",
      filter_end_date: "2025-06-15",
      currency_of_record: "CAD",
      created_at: "2025-02-05 02:30 PM",
      description: "Canadian market campaign data for Q2 2025",
      advertiser: "Canada Brands",
      agency: "WPP Media Canada",
      status: "completed",
      data_sources: [
        "Post Log File - March 2025",
        "Post Log File - April 2025",
        "Post Log File - May 2025",
        "Post Log File - June 2025",
      ],
      tags: ["canada", "q2", "international"],
    },
    {
      id: "dsg-010",
      name: "Spring Launch Campaign",
      filter_start_date: "2025-03-01",
      filter_end_date: "2025-05-30",
      currency_of_record: "USD",
      created_at: "2025-01-12 09:00 AM",
      description: "Spring product launch campaign data",
      advertiser: "Innovation Labs",
      agency: "WPP Media",
      status: "completed",
      data_sources: [
        "Post Log File - March 2025",
        "Post Log File - April 2025",
        "Post Log File - May 2025",
      ],
      tags: ["spring", "launch", "new-products"],
    },
    {
      id: "dsg-011",
      name: "Fall Collection Data",
      filter_start_date: "2025-09-01",
      filter_end_date: "2025-11-30",
      currency_of_record: "USD",
      created_at: "2025-04-03 04:20 PM",
      description: "Fall fashion collection campaign data",
      advertiser: "Fashion Outlet",
      agency: "WPP Media",
      status: "planned",
      data_sources: [
        "Post Log File - September 2025",
        "Post Log File - October 2025",
        "Post Log File - November 2025",
      ],
      tags: ["fall", "fashion", "seasonal"],
    },
    {
      id: "dsg-012",
      name: "Christmas Gift Guide",
      filter_start_date: "2025-11-15",
      filter_end_date: "2025-12-24",
      currency_of_record: "GBP",
      created_at: "2025-05-18 10:45 AM",
      description: "Christmas gift guide campaign for UK market",
      advertiser: "Gift Guide Ltd.",
      agency: "WPP Media UK",
      status: "planned",
      data_sources: [
        "Post Log File - November 2025",
        "Post Log File - December 2025",
      ],
      tags: ["christmas", "gifts", "holiday", "uk"],
    },
  ];

  // Temporary datasource filters
  const tempDatasourceFilters = [
    { value: "file-001", label: "Post Log File - January 2025" },
    { value: "file-002", label: "Post Log File - February 2025" },
    { value: "file-003", label: "Post Log File - March 2025" },
    { value: "file-004", label: "Post Log File - April 2025" },
    { value: "file-005", label: "Post Log File - May 2025" },
    { value: "file-006", label: "Post Log File - June 2025" },
    { value: "file-007", label: "Post Log File - July 2025" },
    { value: "file-008", label: "Post Log File - August 2025" },
    { value: "file-009", label: "Post Log File - September 2025" },
    { value: "file-010", label: "Post Log File - October 2025" },
    { value: "file-011", label: "Post Log File - November 2025" },
    { value: "file-012", label: "Post Log File - December 2025" },
  ];

  useEffect(() => {
    // Simulate API call for datasource groups
    setLoading(true);
    setTimeout(() => {
      setDatasourceGroups(tempDatasourceGroups);
      setFilteredGroups(tempDatasourceGroups);
      setLoading(false);
    }, 1000);

    // Load datasource filters
    setDatasourceFilters(tempDatasourceFilters);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = datasourceGroups;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGroups(filtered);
    setCurrentPage(1);
  }, [searchTerm, datasourceGroups]);

  const handleView = (group) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  const handleClone = (id) => {
    // Find the group to clone
    const groupToClone = datasourceGroups.find((g) => g.id === id);
    if (groupToClone) {
      setFormData({
        displayName: `${groupToClone.name} (Copy)`,
        description: `Cloned from ${groupToClone.name}`,
        startDate: groupToClone.filter_start_date,
        endDate: groupToClone.filter_end_date,
        currencyOfRecord:
          groupToClone.currency_of_record === "USD" ? "25" : "26",
        dsFilterIds: [],
      });
      setIsEditMode(false);
      setEditId(null);
      setShowCreateModal(true);
    }
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this datasource group?")
    ) {
      // Simulate delete
      setLoading(true);
      setTimeout(() => {
        const updatedGroups = datasourceGroups.filter((g) => g.id !== id);
        setDatasourceGroups(updatedGroups);
        setFilteredGroups(updatedGroups);
        setLoading(false);
        alert("Datasource Group deleted successfully.");
      }, 500);
    }
  };

  const handleCreateGroup = () => {
    setFormData({
      displayName: "",
      description: "",
      startDate: "",
      endDate: "",
      currencyOfRecord: "25",
      dsFilterIds: [],
    });
    setIsEditMode(false);
    setEditId(null);
    setShowCreateModal(true);
  };

  const handleEdit = (id) => {
    const groupToEdit = datasourceGroups.find((g) => g.id === id);
    if (groupToEdit) {
      setFormData({
        displayName: groupToEdit.name,
        description: `Description for ${groupToEdit.name}`,
        startDate: groupToEdit.filter_start_date,
        endDate: groupToEdit.filter_end_date,
        currencyOfRecord:
          groupToEdit.currency_of_record === "USD" ? "25" : "26",
        dsFilterIds: ["file-001", "file-002"], // Example selected filters
      });
      setIsEditMode(true);
      setEditId(id);
      setShowCreateModal(true);
    }
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

  const loadDatasourceFilters = (startDate, endDate) => {
    if (!startDate || !endDate) return;

    setLoadingFilters(true);
    // Simulate API call
    setTimeout(() => {
      setDatasourceFilters(tempDatasourceFilters);
      setLoadingFilters(false);
    }, 500);
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      loadDatasourceFilters(formData.startDate, formData.endDate);
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      displayName,
      description,
      startDate,
      endDate,
      currencyOfRecord,
      dsFilterIds,
    } = formData;

    if (!displayName) return alert("Name is required.");
    if (!description) return alert("Description is required.");
    if (!startDate) return alert("Start Date is required.");
    if (!endDate) return alert("End Date is required.");
    if (!currencyOfRecord) return alert("Currency Of Record is required.");
    if (!dsFilterIds || dsFilterIds.length === 0)
      return alert("Post Log File Name must be selected.");

    const payload = {
      advertiser_id: "8b31df08-da77-4d44-b415-8b22ab387704",
      display_name: displayName,
      description: description,
      currency_of_record: currencyOfRecord === "25" ? "USD" : "GBP",
      reporting_scope: "AD_MEASUREMENT",
      datasources: [
        {
          datasource_type: "FIRST_PARTY_AD_SCHEDULE",
          filters: [
            {
              name: "platform_file_guid",
              values: dsFilterIds,
            },
          ],
        },
      ],
      data_latency: "FINAL",
      filter_start_date: startDate,
      filter_end_date: endDate,
    };

    console.log("payload:", payload);

    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      alert(
        `Datasource Group ${
          isEditMode ? "updated" : "created"
        } successfully! (Demo mode)`
      );
      setLoading(false);
      handleCloseModal();
    }, 500);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGroups.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "planned":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              {/* Page Header - Dark Blue */}
              <div className="bg-dark-blue rounded-lg p-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-lg md:text-xl font-semibold">
                    Datasource Groups
                  </h2>
                </div>
                <button
                  onClick={handleCreateGroup}
                  className="bg-lemon/90 text-dark-blue px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-lemon transition-colors whitespace-nowrap inline-flex items-center gap-1"
                >
                  <Plus size={14} />
                  Create Datasource Group
                </button>
              </div>

              {/* Filter Row */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-80">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-dark-blue/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
                      placeholder="Search groups..."
                    />
                    <Search
                      className="absolute left-2 top-2.5 text-gray-400"
                      size={16}
                    />
                  </div>
                </div>
              </div>

              {/* Loading Overlay */}
              {loading && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="w-12 h-12 border-3 border-blue-200 border-t-dark-blue rounded-full animate-spin"></div>
                </div>
              )}

              {/* Table */}
              {!loading && (
                <div className="bg-dark-blue rounded-lg border border-gray-200 overflow-x-auto">
                  <table className="min-w-[1000px] w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-dark-blue">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">
                          ID
                        </th>
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
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[100px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-3 py-4 text-center text-sm text-gray-500"
                          >
                            No datasource groups found
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((group) => (
                          <tr key={group.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">
                              {group.id}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-900 font-medium break-words whitespace-normal">
                              {group.name}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Calendar
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>
                                  {formatDate(group.filter_start_date)}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Calendar
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>{formatDate(group.filter_end_date)}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <DollarSign
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>{group.currency_of_record}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Clock
                                  size={12}
                                  className="text-gray-400 flex-shrink-0"
                                />
                                <span>{group.created_at}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 align-top">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleView(group)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                  title="View"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleClone(group.id)}
                                  className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                                  title="Clone"
                                >
                                  <Files size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(group.id)}
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
              {!loading && filteredGroups.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 text-xs text-gray-700">
                  <div>
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredGroups.length)} of{" "}
                    {filteredGroups.length}
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

      {/* View Datasource Group Modal */}
      {isModalOpen && selectedGroup && (
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
                  Datasource Group Details - {selectedGroup.id}
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
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Group ID
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedGroup.id}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Group Name
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                        {selectedGroup.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Description
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedGroup.description ||
                          "No description available"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Advertiser
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedGroup.advertiser || "N/A"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Agency
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedGroup.agency || "WPP Media"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Status
                      </label>
                      <div className="text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${getStatusBadgeClass(
                            selectedGroup.status
                          )}`}
                        >
                          {selectedGroup.status
                            ? selectedGroup.status.charAt(0).toUpperCase() +
                              selectedGroup.status.slice(1)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Start Date
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {formatDate(selectedGroup.filter_start_date)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        End Date
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {formatDate(selectedGroup.filter_end_date)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Currency
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedGroup.currency_of_record}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Created On
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedGroup.created_at}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Data Sources
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedGroup.data_sources
                          ? selectedGroup.data_sources.join(", ")
                          : "N/A"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {selectedGroup.tags && selectedGroup.tags.length > 0 ? (
                          selectedGroup.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                            >
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

      {/* Create/Edit Datasource Group Modal */}
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
                  {isEditMode
                    ? "Edit Datasource Group"
                    : "Create Datasource Group"}
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
                    placeholder="Enter group name"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue"
                    placeholder="Enter description"
                  />
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
                    <option value="25">2024-25 Currency</option>
                    <option value="26">2025-26 Currency</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="dsFilterIds"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Post Log File Name
                  </label>
                  {loadingFilters ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-200 border-t-dark-blue rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <select
                      id="dsFilterIds"
                      multiple
                      value={formData.dsFilterIds}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-dark-blue min-h-[100px]"
                    >
                      {datasourceFilters.map((filter) => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
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

export default DatasourceGroups;
