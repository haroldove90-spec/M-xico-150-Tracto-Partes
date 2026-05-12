import React from 'react';
import { 
  BarChart3, 
  Receipt, 
  Package, 
  Truck, 
  ArrowRightLeft,
  LogOut, 
  Menu,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'ventas', label: 'Dashboard', icon: BarChart3 },
  { id: 'facturacion', label: 'Cortes/Caja', icon: Receipt },
  { id: 'traspasos', label: 'Traspasos', icon: ArrowRightLeft },
  { id: 'inventarios', label: 'Inventarios', icon: Package },
  { id: 'carta-porte', label: 'Carta Porte', icon: Truck },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activeTab, setActiveTab }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 240 : 80 }}
      className="fixed left-0 top-0 h-screen bg-[#09090b] border-r border-[#27272a] z-50 flex flex-col pt-6 font-sans"
    >
      <div className="px-6 mb-8 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-[#fbbf24] flex items-center justify-center rounded text-black font-bold">
                M
              </div>
              <span className="text-sm font-bold tracking-tight text-white">MEXICO 150 <span className="text-[#fbbf24]">TRACTO</span></span>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-[#18181b] rounded transition-colors text-zinc-500 hover:text-white"
        >
          {isOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 p-2.5 px-4 rounded-md transition-all text-[13px] font-medium group ${
              activeTab === item.id 
                ? 'bg-[#27272a] text-[#fbbf24]' 
                : 'text-zinc-400 hover:bg-[#18181b] hover:text-white'
            }`}
          >
            <item.icon size={16} className={activeTab === item.id ? 'stroke-[2px]' : ''} />
            {isOpen && (
              <span className="whitespace-nowrap transition-opacity duration-200">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-medium text-white">
            GA
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <div className="text-[11px] font-semibold text-zinc-200">Gerente Admin</div>
              <div className="text-[10px] text-zinc-500">ID: #MX150</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
