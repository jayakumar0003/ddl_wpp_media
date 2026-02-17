import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import bgImage from "../assets/3d-background-with-white-cubes.jpg";
import {
  ArrowRight,
  FileText,
  BarChart,
  Upload,
  BookOpen,
  Users,
  Calendar,
  Database,
  FileCheck,
} from "lucide-react";

const menuItems = [
  { name: "Create Plan", icon: FileText, path: "/create-plan" },
  { name: "Actualize Plan", icon: BarChart, path: "/actualize-plan" },
  { name: "Upload VideoAmp CSV", icon: Upload, path: "/upload" },
  { name: "Documentation", icon: BookOpen, path: "/docs" },
  { name: "Audiences", icon: Users, path: "/audiences" },
  { name: "VA Campaign Planning", icon: Calendar, path: "/va-planning" },
  { name: "Datasource Groups", icon: Database, path: "/datasources" },
  { name: "Ad Measurement Reports", icon: FileCheck, path: "/reports" },
];

const HomePage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleGoClick = () => setIsExpanded(true);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Animated blobs (unchanged) */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full bg-blue-700/30 blur-[110px]"
          animate={{
            x: [0, -250, 180, 0],
            y: [0, 200, -140, 0],
            scale: [1, 0.8, 1.2, 1],
            rotate: [0, 45, -45, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-15%", left: "-10%" }}
        />
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full bg-lemon/30 blur-[200px]"
          animate={{
            x: [0, 200, -150, 0],
            y: [0, -180, 120, 0],
            scale: [1, 0.8, 1.92, 1],
            rotate: [0, 90, -30, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "-20%", right: "-10%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-lemon/30 blur-[80px]"
          animate={{
            x: [0, 150, -80, 0],
            y: [0, -120, 70, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "30%", right: "15%" }}
        />
        {/* <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-cyan-400/20 blur-[90px]"
          animate={{
            x: [0, -100, 120, 0],
            y: [0, 80, -100, 0],
            rotate: [0, 360, 0],
          }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          style={{ top: "60%", left: "10%" }}
        /> */}
        <motion.div
          className="absolute w-[900px] h-[900px] border border-lemon/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ top: "-30%", left: "30%" }}
        />
      </div>

      {/* Header with logo */}
      <Header />

      {/* Title row – appears below header when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-9 z-20" // Adjust top to sit under logo
          >
            <motion.div
              layoutId="title"
              className="text-dark-blue text-left flex gap-3"
            >
              <div className="text-3xl sm:text-3xl font-light tracking-wider font-display">
                Welcome To
              </div>
              <div className="text-3xl sm:text-4xl font-black font-cinzel leading-tight ">
                DDl
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pt-6">
        {!isExpanded ? (
          /* Centered title + Go button */
          <>
            <motion.div layoutId="title" className="text-center mb-8 space-y-4">
              <div className="text-dark-blue text-4xl sm:text-6xl font-light tracking-wider font-display">
                Welcome To
              </div>
              <div className="text-dark-blue text-4xl sm:text-6xl font-black font-cinzel leading-tight">
                DDl
              </div>
            </motion.div>

            <motion.button
              onClick={handleGoClick}
              className="group flex items-center gap-3 px-8 py-3 bg-lemon text-dark-blue rounded-full text-xl font-bold shadow-[0_0_30px_rgba(185,253,86,0.4)] border border-lemon/40 backdrop-blur-md"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Go
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform duration-300"
                size={22}
              />
            </motion.button>
          </>
        ) : (
          /* Menu grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-7xl  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="
                              relative
                              group
                              bg-dark-blue/10
                              backdrop-blur-md
                              rounded-full
                              p-2
                              shadow-2xl
                              border border-white/20
                              cursor-pointer
                            "
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center text-center gap-3">
                    <div className="p-3 bg-lemon/30 rounded-full transition-all duration-300 group-hover:bg-lemon/60 group-hover:shadow-lg">
                      <Icon
                        size={32}
                        className="text-dark-blue/70 group-hover:text-dark-blue group-hover:scale-110 transition-all duration-300"
                      />
                    </div>
                    <span className=" text-dark-blue font-bold text-md transition-all duration-300 group-hover:text-dark-blue">
                      {item.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
