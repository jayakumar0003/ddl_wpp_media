import { motion } from 'framer-motion';
import logo from '../assets/logo-wpp-media.png';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 z-20">
      {/* Logo with slide-in from left */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer"
      >
        <img 
          src={logo} 
          alt="WPP Media" 
          className="h-8 xs:h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 object-contain" 
        />
      </motion.div>

      {/* User Guide button with slide-in from right and border */}
      <div className="flex items-center gap-3 sm:gap-6">
        <motion.div
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full 
            bg-lemon/40 border border-dark-blue/30 sm:border-2 sm:border-dark-blue"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-xs xs:text-sm sm:text-sm md:text-base text-dark-blue font-medium tracking-wide whitespace-nowrap">
            User Guide
          </span>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;