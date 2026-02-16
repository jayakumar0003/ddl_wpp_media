import { motion } from 'framer-motion';
import logo from '../assets/logo-wpp-media.png';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-20">
      {/* Logo with slide-in from left */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer"
      >
        <img src={logo} alt="WPP Media" className="h-10 sm:h-20 object-contain" />
      </motion.div>

     

      {/* User Guide button with slide-in from right and border */}
      <div className="flex items-center gap-6">
        <motion.div
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full 
            bg-lemon/40 border-2 border-dark-blue"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm text-dark-blue font-medium tracking-wide">
            User Guide
          </span>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;