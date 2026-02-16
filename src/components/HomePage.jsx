import { useState } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import NavPanel from "./NavPanel";
import bgImage from "../assets/3d-background-with-white-cubes.jpg";
import { ArrowRight } from "lucide-react";

const HomePage = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleGoClick = () => {
    setIsNavOpen(true);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background image – now fully visible */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* ===== Enhanced Animated Background ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {/* No dark overlay – image shows through */}

        {/* Deep Blue Blob – moving with rotation and scaling */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-blue-700/30 blur-[110px]"
          animate={{
            x: [0, -250, 180, 0],
            y: [0, 200, -140, 0],
            scale: [1, 0.8, 1.2, 1],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "-15%", left: "-10%" }}
        />
        {/* Large Lemon Blob – more opaque, with rotation and scaling */}
        <motion.div
          className="absolute w-[700px] h-[700px]  bg-lemon/30 blur-[100px]"
          animate={{
            x: [0, 200, -150, 0],
            y: [0, -180, 120, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 90, -30, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ bottom: "-20%", right: "-10%" }}
        />

        {/* Floating Lemon Orb – smaller, faster movement */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-lemon/30 blur-[80px]"
          animate={{
            x: [0, 150, -80, 0],
            y: [0, -120, 70, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "30%", right: "15%" }}
        />

        {/* Additional Cyan/Turquoise Blob for variety */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-cyan-400/20 blur-[90px]"
          animate={{
            x: [0, -100, 120, 0],
            y: [0, 80, -100, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ top: "60%", left: "10%" }}
        />

        {/* Rotating Ring – subtle but adds premium feel */}
        <motion.div
          className="absolute w-[900px] h-[900px] border border-lemon/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ top: "-30%", left: "30%" }}
        />

        {/* Tiny floating squares for extra detail */}
        {/* {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 bg-lemon/20 blur-sm"
            animate={{
              x: [0, (i % 2 === 0 ? 100 : -80), 0],
              y: [0, (i % 3 === 0 ? 70 : -50), 0],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              top: `${10 + i * 8}%`,
              left: `${5 + i * 12}%`,
            }}
          />
        ))} */}
      </div>

      {/* Header */}
      <Header />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Stacked Title with animation (optional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 space-y-4"
        >
          <div className="text-dark-blue text-4xl sm:text-7xl font-light tracking-wider font-display">
            Welcome To
          </div>
          <div className="text-dark-blue text-4xl sm:text-8xl font-black font-cinzel leading-tight">
            DDl
          </div>
        </motion.div>

        {/* Go Button */}
        <motion.button
          onClick={handleGoClick}
          className="group flex items-center gap-3 px-8 py-3 bg-lemon text-dark-blue rounded-full text-xl font-bold shadow-[0_0_30px_rgba(185,253,86,0.4)] border border-lemon/40 backdrop-blur-md"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Go
          <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={22} />
        </motion.button>
      </div>

      {/* Navigation Panel */}
      {isNavOpen && <NavPanel onClose={closeNav} />}
    </div>
  );
};

export default HomePage;
