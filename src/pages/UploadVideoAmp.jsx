import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, Upload, FileText, CheckCircle } from "lucide-react";
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
          className={`pt-10 sm:pt-20 min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:ml-80" : "ml-0"
            }`}
        >
          <main
            className="px-4 sm:px-6 py-2 overflow-y-auto hide-scrollbar"
            style={{ maxHeight: "calc(100vh - 4.5rem)" }}
          >
            {/* Main content container */}
            <div className="p-2 md:p-3">
              <h1 className="text-lg sm:text-2xl font-bold text-dark-blue mb-2">
                VideoAmp File Upload
              </h1>

              <div
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg 
                mt-9 w-full max-w-5xl mx-auto overflow-hidden"
              >
                <div className="bg-dark-blue p-3">
                  <h3 className="text-md md:text-xl font-bold text-white flex items-center gap-2">
                    Upload VideoAmp File
                  </h3>
                </div>

                <div className="p-3 sm:p-3">
                  <p className="text-dark-blue/70 mb-2">
                    Please upload a CSV with the following columns:
                  </p>

                  {/* Required Columns Table */}
                  <div className="overflow-x-auto hide-scrollbar rounded-lg border border-dark-blue/20 mb-3">
                    <table className="min-w-full divide-y divide-dark-blue/20">
                      <thead className="bg-dark-blue">
                        <tr>
                          <th className="px-3 sm:px-6 py-1 sm:py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Column Name
                          </th>
                          <th className="px-3 sm:px-6 py-1 sm:py-2 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 divide-y divide-dark-blue/10">
                        <tr>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            display_name
                          </td>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            String
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            platform
                          </td>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            String
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            daypart
                          </td>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            String
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            cost_per_unit
                          </td>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            Float
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            impressions_per_unit
                          </td>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            Float
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            cpm
                          </td>
                          <td className="px-3 sm:px-6 py-1 sm:py-1.5 text-sm text-dark-blue">
                            Float
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Replicated Upload Box from ActualizePlan */}
                  <div className="border border-dark-blue/20 rounded-xl overflow-hidden bg-white/40 backdrop-blur-sm mb-2">
                    <div className="p-2">
                      <div
                        className={`border-2 border-dashed rounded-xl p-2 text-center transition-colors ${selectedFile
                          ? "border-green-500 bg-green-50/50"
                          : "border-dark-blue/30 hover:border-lemon bg-white/40"
                          }`}
                      >
                        <Upload
                          className={`mx-auto mb-2 ${selectedFile ? "text-green-500" : "text-dark-blue/40"
                            }`}
                          size={22}
                        />

                        <h4 className="text-xs font-semibold text-dark-blue mb-1">
                          Upload Original Results
                        </h4>
                        <p className="text-xs text-dark-blue/60 mb-1">
                          The unmodified ranker output file
                        </p>

                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".csv"
                          className="hidden"
                          onChange={handleFileChange}
                        />

                        <button
                          onClick={triggerFileInput}
                          className="w-full sm:w-auto text-sm px-5 py-1 bg-dark-blue text-white rounded-full hover:bg-dark-blue/80 transition-colors inline-flex items-center gap-2"
                        >
                          <FileText size={14} />
                          Choose Original File
                        </button>

                        {selectedFile && (
                          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center justify-center gap-2">
                            <CheckCircle size={18} />
                            <span className="font-medium">
                              {selectedFile.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-dark-blue/70 mb-1 text-sm text-center">
                    Here is a link to what your sheet must look like:{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      sheet here
                    </a>
                  </p>

                  {/* Final Upload Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleUpload}
                      className="w-full sm:w-auto px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg"
                    >
                      <Upload size={20} />
                      Upload
                    </button>
                  </div>
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
