import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  Menu,
  ChevronRight,
  Download,
} from "lucide-react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo-wpp-media.png";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background-gradient-lights.jpg";

const ActualizePlan = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);
  const [modifiedFile, setModifiedFile] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [modifiedFileName, setModifiedFileName] = useState("");
  const [originalError, setOriginalError] = useState("");
  const [modifiedError, setModifiedError] = useState("");
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState("");

  const validateFile = (file) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    return (
      allowedTypes.includes(file.type) ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".csv")
    );
  };

  const handleOriginalFileChange = (e) => {
    const file = e.target.files[0];
    setOriginalError("");

    if (file) {
      if (validateFile(file)) {
        setOriginalFile(file);
        setOriginalFileName(file.name);
        setStep1Completed(true);
      } else {
        setOriginalError(
          "Invalid file type. Please select an Excel (.xlsx, .xls) or CSV file."
        );
      }
    }
  };

  const handleModifiedFileChange = (e) => {
    const file = e.target.files[0];
    setModifiedError("");

    if (file) {
      if (validateFile(file)) {
        setModifiedFile(file);
        setModifiedFileName(file.name);
        setStep2Completed(true);
      } else {
        setModifiedError(
          "Invalid file type. Please select an Excel (.xlsx, .xls) or CSV file."
        );
      }
    }
  };

  const triggerOriginalFileInput = () => {
    document.getElementById("originalFileInput").click();
  };

  const triggerModifiedFileInput = () => {
    document.getElementById("modifiedFileInput").click();
  };

  const processActualization = () => {
    if (!originalFile || !modifiedFile) {
      alert("Please upload both files before processing.");
      return;
    }

    setIsProcessing(true);
    setProcessStatus(
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
          <strong className="font-bold">Processing...</strong>
          <span className="block sm:inline">
            Comparing files and recalculating metrics.
          </span>
        </div>
      </div>
    );

    // Demo mode - UI only
    setTimeout(() => {
      setIsProcessing(false);
      setProcessStatus(
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} />
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">
              Your actualized results have been downloaded.
            </span>
          </div>
        </div>
      );
    }, 2000);
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-blue mb-1">
                Actualize Plan Results
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-dark-blue mb-6">
                Upload your files to accurately recalculate metrics based on
                actuals.
              </p>

              {/* Two-step upload process */}
              <div className="max-w-4xl mx-auto px-2 sm:px-4 ">
                {/* Step 1: Upload Original File */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 sm:p-6"
                >
                  <div className="border border-dark-blue/20 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-lemon/30 to-blue-400/30 p-4">
                      <h3 className="text-md md:text-xl font-bold text-dark-blue flex items-center gap-2">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-dark-blue text-white flex items-center justify-center text-sm">
                          1
                        </span>
                        Upload Original Ranker File
                      </h3>
                    </div>

                    <div className="p-6">
                      <p className="text-dark-blue/60 mb-4">
                        Upload the original ranker output file (baseline for
                        comparison)
                      </p>

                      <div
                        className={`border-2 border-dashed rounded-xl p-4 sm:p-6 md:p-8 text-center transition-colors ${
                          step1Completed
                            ? "border-green-500 bg-green-50/50"
                            : "border-dark-blue/30 hover:border-lemon bg-white/40"
                        }`}
                      >
                        <Upload
                          className={`mx-auto mb-4 ${
                            step1Completed
                              ? "text-green-500"
                              : "text-dark-blue/40"
                          }`}
                          size={48}
                        />

                        <h4 className="text-lg font-semibold text-dark-blue mb-2">
                          Upload Original Results
                        </h4>
                        <p className="text-dark-blue/60 mb-4">
                          The unmodified ranker output file
                        </p>

                        <input
                          type="file"
                          id="originalFileInput"
                          accept=".xlsx,.xls,.csv"
                          className="hidden"
                          onChange={handleOriginalFileChange}
                        />

                        <button
                          onClick={triggerOriginalFileInput}
                          className="w-full sm:w-auto px-6 py-2 bg-dark-blue text-white rounded-full hover:bg-dark-blue/80 transition-colors inline-flex items-center gap-2"
                        >
                          <FileText size={18} />
                          Choose Original File
                        </button>

                        {originalFileName && (
                          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center justify-center gap-2">
                            <CheckCircle size={18} />
                            <span className="font-medium">
                              {originalFileName}
                            </span>
                          </div>
                        )}

                        {originalError && (
                          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {originalError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2: Upload Modified File - shows after step 1 */}
                {step1Completed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="border border-dark-blue/20 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
                      <div className="bg-gradient-to-r from-lemon/30 to-blue-400/30 p-4">
                        <h3 className="text-xl font-bold text-dark-blue flex items-center gap-2">
                          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-dark-blue text-white flex items-center justify-center text-sm">
                            2
                          </span>
                          Upload Modified Actuals File
                        </h3>
                      </div>
                    
                      <div className="p-6">
                        <p className="text-dark-blue/60 mb-4">
                          Upload the file with your changes to Age-Gender Imps
                          and Number of spots
                        </p>

                        <div
                          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                            step2Completed
                              ? "border-green-500 bg-green-50/50"
                              : "border-dark-blue/30 hover:border-lemon bg-white/40"
                          }`}
                        >
                          <Upload
                            className={`mx-auto mb-4 ${
                              step2Completed
                                ? "text-green-500"
                                : "text-dark-blue/40"
                            }`}
                            size={48}
                          />

                          <h4 className="text-lg font-semibold text-dark-blue mb-2">
                            Upload Modified Actuals
                          </h4>
                          <p className="text-dark-blue/60 mb-4">
                            The file with your updated values
                          </p>

                          <input
                            type="file"
                            id="modifiedFileInput"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={handleModifiedFileChange}
                          />

                          <button
                            onClick={triggerModifiedFileInput}
                            className="px-6 py-2 bg-dark-blue text-white rounded-full hover:bg-dark-blue/80 transition-colors inline-flex items-center gap-2"
                          >
                            <FileText size={18} />
                            Choose Modified File
                          </button>

                          {modifiedFileName && (
                            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center justify-center gap-2">
                              <CheckCircle size={18} />
                              <span className="font-medium">
                                {modifiedFileName}
                              </span>
                            </div>
                          )}

                          {modifiedError && (
                            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                              {modifiedError}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Process - shows after both files uploaded */}
                {step1Completed && step2Completed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={processActualization}
                      disabled={isProcessing}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-lemon text-dark-blue rounded-full text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all border-2 border-dark-blue/20 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-blue"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Download size={20} />
                          Process Actualization & Download Results
                        </>
                      )}
                    </motion.button>
  
                    <div className="mt-4">{processStatus}</div>
                  </motion.div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ActualizePlan;
