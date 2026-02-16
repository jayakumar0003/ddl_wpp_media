import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, BarChart, Upload, BookOpen, Users, Calendar, Database, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // import useNavigate

const NavPanel = ({ onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Create Plan', icon: FileText, path: '/create-plan' },
    { name: 'Actualize Plan', icon: BarChart, path: '/actualize-plan' },
    { name: 'Upload VideoAmp CSV', icon: Upload, path: '/upload' },
    { name: 'Documentation', icon: BookOpen, path: '/docs' },
    { name: 'Audiences', icon: Users, path: '/audiences' },
    { name: 'VA Campaign Planning', icon: Calendar, path: '/va-planning' },
    { name: 'Datasource Groups', icon: Database, path: '/datasources' },
    { name: 'Ad Measurement Reports', icon: FileCheck, path: '/reports' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // close the panel after navigation
  };

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={onClose}
        />

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-40 p-6 border-r border-lemon/30"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-dark-blue/50 hover:text-dark-blue transition-colors"
          >
            <X size={24} />
          </button>

          <div className="w-12 h-1 bg-lemon rounded-full mb-8" />

          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-4 px-4 py-3 text-dark-blue hover:bg-lemon/20 rounded-xl transition-all duration-200 group"
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Icon size={20} className="text-dark-blue/60 group-hover:text-lemon transition-colors" />
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              );
            })}
          </nav>

        
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default NavPanel;