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
  Filter
} from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo-wpp-media.png";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background-gradient-lights.jpg"

const DatasourceGroups = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [datasourceGroups, setDatasourceGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form states
  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    startDate: '',
    endDate: '',
    currencyOfRecord: '25',
    dsFilterIds: []
  });

  const [datasourceFilters, setDatasourceFilters] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Temporary data for datasource groups
  const tempDatasourceGroups = [
    {
      id: "dsg-001",
      name: "Q1 2025 Campaign Data",
      filter_start_date: "2025-01-01",
      filter_end_date: "2025-03-31",
      currency_of_record: "USD",
      created_at: "2025-01-15 10:30 AM"
    },
    {
      id: "dsg-002",
      name: "Summer Promotions",
      filter_start_date: "2025-06-01",
      filter_end_date: "2025-08-31",
      currency_of_record: "USD",
      created_at: "2025-02-20 02:15 PM"
    },
    {
      id: "dsg-003",
      name: "Holiday Season 2025",
      filter_start_date: "2025-11-01",
      filter_end_date: "2025-12-31",
      currency_of_record: "USD",
      created_at: "2025-03-10 09:45 AM"
    },
    {
      id: "dsg-004",
      name: "European Campaign Data",
      filter_start_date: "2025-04-01",
      filter_end_date: "2025-06-30",
      currency_of_record: "EUR",
      created_at: "2025-02-05 11:20 AM"
    },
    {
      id: "dsg-005",
      name: "UK Market Analysis",
      filter_start_date: "2025-07-01",
      filter_end_date: "2025-09-30",
      currency_of_record: "GBP",
      created_at: "2025-03-18 03:30 PM"
    },
    {
      id: "dsg-006",
      name: "Back to School Data",
      filter_start_date: "2025-07-15",
      filter_end_date: "2025-09-15",
      currency_of_record: "USD",
      created_at: "2025-04-22 10:00 AM"
    },
    {
      id: "dsg-007",
      name: "Black Friday Weekend",
      filter_start_date: "2025-11-24",
      filter_end_date: "2025-11-27",
      currency_of_record: "USD",
      created_at: "2025-05-14 01:45 PM"
    },
    {
      id: "dsg-008",
      name: "New Year Resolution",
      filter_start_date: "2025-12-26",
      filter_end_date: "2026-01-31",
      currency_of_record: "USD",
      created_at: "2025-06-01 11:15 AM"
    },
    {
      id: "dsg-009",
      name: "Canadian Market Data",
      filter_start_date: "2025-03-15",
      filter_end_date: "2025-06-15",
      currency_of_record: "CAD",
      created_at: "2025-02-05 02:30 PM"
    },
    {
      id: "dsg-010",
      name: "Spring Launch Campaign",
      filter_start_date: "2025-03-01",
      filter_end_date: "2025-05-30",
      currency_of_record: "USD",
      created_at: "2025-01-12 09:00 AM"
    },
    {
      id: "dsg-011",
      name: "Fall Collection Data",
      filter_start_date: "2025-09-01",
      filter_end_date: "2025-11-30",
      currency_of_record: "USD",
      created_at: "2025-04-03 04:20 PM"
    },
    {
      id: "dsg-012",
      name: "Christmas Gift Guide",
      filter_start_date: "2025-11-15",
      filter_end_date: "2025-12-24",
      currency_of_record: "GBP",
      created_at: "2025-05-18 10:45 AM"
    }
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
    { value: "file-012", label: "Post Log File - December 2025" }
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
  
    if (appliedSearchTerm) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        group.id.toLowerCase().includes(appliedSearchTerm.toLowerCase())
      );
    }
  
    setFilteredGroups(filtered);
    setCurrentPage(1);
  
  }, [appliedSearchTerm, datasourceGroups]);

  const handleView = (id) => {
    navigate(`/view-datasource-group?id=${id}`);
    setDropdownOpen(null);
  };

  const handleClone = (id) => {
    // Find the group to clone
    const groupToClone = datasourceGroups.find(g => g.id === id);
    if (groupToClone) {
      setFormData({
        displayName: `${groupToClone.name} (Copy)`,
        description: `Cloned from ${groupToClone.name}`,
        startDate: groupToClone.filter_start_date,
        endDate: groupToClone.filter_end_date,
        currencyOfRecord: groupToClone.currency_of_record === "USD" ? "25" : "26",
        dsFilterIds: []
      });
      setIsEditMode(false);
      setEditId(null);
      setShowCreateModal(true);
    }
    setDropdownOpen(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this datasource group?")) {
      // Simulate delete
      setLoading(true);
      setTimeout(() => {
        const updatedGroups = datasourceGroups.filter(g => g.id !== id);
        setDatasourceGroups(updatedGroups);
        setFilteredGroups(updatedGroups);
        setLoading(false);
        alert("Datasource Group deleted successfully.");
      }, 500);
    }
    setDropdownOpen(null);
  };

  const handleCreateGroup = () => {
    setFormData({
      displayName: '',
      description: '',
      startDate: '',
      endDate: '',
      currencyOfRecord: '25',
      dsFilterIds: []
    });
    setIsEditMode(false);
    setEditId(null);
    setShowCreateModal(true);
  };

  const handleEdit = (id) => {
    const groupToEdit = datasourceGroups.find(g => g.id === id);
    if (groupToEdit) {
      setFormData({
        displayName: groupToEdit.name,
        description: `Description for ${groupToEdit.name}`,
        startDate: groupToEdit.filter_start_date,
        endDate: groupToEdit.filter_end_date,
        currencyOfRecord: groupToEdit.currency_of_record === "USD" ? "25" : "26",
        dsFilterIds: ["file-001", "file-002"] // Example selected filters
      });
      setIsEditMode(true);
      setEditId(id);
      setShowCreateModal(true);
    }
    setDropdownOpen(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setIsEditMode(false);
    setEditId(null);
  };

  const handleFormChange = (e) => {
    const { id, value, type, selectedOptions } = e.target;
    
    if (type === 'select-multiple') {
      const values = Array.from(selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [id]: values }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
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

    const { displayName, description, startDate, endDate, currencyOfRecord, dsFilterIds } = formData;

    if (!displayName) return alert("Name is required.");
    if (!description) return alert("Description is required.");
    if (!startDate) return alert("Start Date is required.");
    if (!endDate) return alert("End Date is required.");
    if (!currencyOfRecord) return alert("Currency Of Record is required.");
    if (!dsFilterIds || dsFilterIds.length === 0) return alert("Post Log File Name must be selected.");

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
              values: dsFilterIds
            }
          ]
        }
      ],
      data_latency: "FINAL",
      filter_start_date: startDate,
      filter_end_date: endDate
    };

    console.log("payload:", payload);
    
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      alert(`Datasource Group ${isEditMode ? 'updated' : 'created'} successfully! (Demo mode)`);
      setLoading(false);
      handleCloseModal();
    }, 500);
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
  const currentItems = filteredGroups.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          <main className="px-4 py-3">
            {/* Main content container */}
            <div className="max-w-6xl mx-auto bg-white rounded-xl p-4 md:p-5 shadow-lg">
              {/* Page Header - Blue */}
              <div className="bg-blue-600 rounded-lg p-3 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-lg md:text-xl font-semibold">Datasource Groups</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateGroup}
                  className="bg-white text-blue-600 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-1"
                >
                  <Plus size={14} />
                  Create Datasource Group
                </motion.button>
              </div>

              {/* Filter Row - like audience page */}
              <div className="mb-4 items-center">
                
                <div className="relative w-80">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Search..."
                  />
                  <Search
                    className="absolute left-2 top-2.5 text-gray-400"
                    size={16}
                  />
                </div>
              </div>

              
              {/* Loading Overlay */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">ID</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[200px]">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[90px]">Start Date</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[90px]">End Date</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[70px]">Currency</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[90px]">Created On</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider w-[100px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-3 py-4 text-center text-sm text-gray-500">
                            No datasource groups found
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((group, index) => (
                          <motion.tr
                            key={group.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-3 py-2 text-xs text-gray-900 break-all whitespace-normal align-top">{group.id}</td>
                            <td className="px-3 py-2 text-xs text-gray-900 font-medium break-words whitespace-normal">{group.name}</td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                                <span>{formatDate(group.filter_start_date)}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                                <span>{formatDate(group.filter_end_date)}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <DollarSign size={12} className="text-gray-400 flex-shrink-0" />
                                <span>{group.currency_of_record}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600 align-top">
                              <div className="flex items-center gap-1">
                                <Clock size={12} className="text-gray-400 flex-shrink-0" />
                                <span>{group.created_at}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 align-top">
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleView(group.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="View"
                                >
                                  <Eye size={16} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleClone(group.id)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Clone"
                                >
                                  <Files size={16} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(group.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {/* Pagination */}
              {!loading && filteredGroups.length > 0 && (
                <div className="flex items-center justify-between mt-3 text-xs text-gray-700">
                  <div>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredGroups.length)} of {filteredGroups.length}
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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-blue-600 p-4 rounded-t-xl flex items-center justify-between sticky top-0">
                <h2 className="text-white text-lg font-semibold">
                  {isEditMode ? 'Edit Datasource Group' : 'Create Datasource Group'}
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
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={formData.displayName}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter group name"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="currencyOfRecord" className="block text-sm font-medium text-gray-700 mb-1">
                    Currency Of Record *
                  </label>
                  <select
                    id="currencyOfRecord"
                    value={formData.currencyOfRecord}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="25">2024-25 Currency</option>
                    <option value="26">2025-26 Currency</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="dsFilterIds" className="block text-sm font-medium text-gray-700 mb-1">
                    Post Log File Name
                  </label>
                  {loadingFilters ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <select
                      id="dsFilterIds"
                      multiple
                      value={formData.dsFilterIds}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                    >
                      {datasourceFilters.map(filter => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
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
                    {isEditMode ? 'Update' : 'Submit'}
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