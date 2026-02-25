import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, Upload } from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo-wpp-media.png";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background-gradient-lights.jpg";

const UploadVideoAmp = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`Uploading: ${selectedFile.name}`);
    } else {
      alert("Please select a file first");
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
          <main
            className="px-4 sm:px-6 py-4 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 4rem)" }}
          >
            {/* Main content container */}
            <div className="p-2 md:p-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-blue mb-2">
                VideoAmp File Upload
              </h1>

              <div
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg 
                p-4 sm:p-5 mt-5 
                w-full max-w-5xl mx-auto"
              >
                <p className="text-dark-blue/70 mb-3">
                  Please upload a CSV with the following columns:
                </p>

                {/* Required Columns Table */}
                <div className="overflow-x-auto rounded-lg border border-dark-blue/20 mb-5">
                  <table className="min-w-full divide-y divide-dark-blue/20">
                    <thead className="bg-dark-blue">
                      <tr>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Column Name
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-dark-blue/10">
                      <tr>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          display_name
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          String
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          platform
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          String
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          daypart
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          String
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          cost_per_unit
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          Float
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          impressions_per_unit
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          Float
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          cpm
                        </td>
                        <td className="px-3 sm:px-6 py-2 sm:py-3 text-sm text-dark-blue">
                          Float
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-dark-blue/70 mb-3">
                  Here is a link to what your sheet must look like:{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    sheet here
                  </a>
                </p>

                {/* File Input */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      onClick={triggerFileInput}
                      className="px-4 py-2 border border-dark-blue/30 rounded-lg bg-white hover:bg-gray-50 text-dark-blue"
                    >
                      Browse
                    </button>
                    <span className="text-dark-blue/70 text-sm break-all">
                      {selectedFile ? selectedFile.name : "No file chosen"}
                    </span>
                  </div>
                  {/* Upload Button */}
                  <button
                    onClick={handleUpload}
                    className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UploadVideoAmp;
