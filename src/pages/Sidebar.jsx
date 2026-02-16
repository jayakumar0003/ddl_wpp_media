import { motion } from 'framer-motion';
import { FileText, BarChart, Upload, BookOpen, Users, Calendar, Database, FileCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-30 p-6 border-r border-lemon/30 overflow-y-auto">
      <div className="w-12 h-1 bg-lemon rounded-full mb-8" />
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? 'bg-lemon/30' : 'hover:bg-lemon/20'
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={20} className={`${isActive ? 'text-lemon' : 'text-dark-blue/60'} group-hover:text-lemon transition-colors`} />
              <span className={`font-medium ${isActive ? 'text-dark-blue' : 'text-dark-blue'}`}>{item.name}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;