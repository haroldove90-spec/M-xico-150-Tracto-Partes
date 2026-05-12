import React from 'react';
import { 
  BarChart3, 
  Receipt, 
  Package, 
  Truck, 
  ArrowRightLeft,
  Users,
  LayoutDashboard,
  LogOut, 
  Menu,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activeTab, setActiveTab, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Monitor Ejecutivo', icon: LayoutDashboard, roles: ['GERENTE'] },
    { id: 'ventas', label: 'Punto de Venta', icon: BarChart3, roles: ['GERENTE', 'VENTAS'] },
    { id: 'clientes', label: 'Cuentas x Cobrar', icon: Users, roles: ['GERENTE', 'VENTAS'] },
    { id: 'facturacion', label: 'Cortes / Caja', icon: Receipt, roles: ['GERENTE', 'VENTAS'] },
    { id: 'traspasos', label: 'Logística Trasp.', icon: ArrowRightLeft, roles: ['GERENTE', 'ALMACEN'] },
    { id: 'inventarios', label: 'Inventario Full', icon: Package, roles: ['GERENTE', 'ALMACEN'] },
    { id: 'carta-porte', label: 'Cartas Porte', icon: Truck, roles: ['GERENTE', 'ALMACEN', 'VENTAS'] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isOpen ? 240 : 80,
        x: (typeof window !== 'undefined' && window.innerWidth < 768 && !isOpen) ? -240 : 0
      }}
      className={`fixed left-0 top-0 h-screen bg-[#09090b] border-r border-[#27272a] z-50 flex flex-col pt-6 font-sans transition-transform md:translate-x-0 ${!isOpen ? 'max-md:-translate-x-full' : ''}`}
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
              <span className="text-sm font-bold tracking-tight text-white uppercase select-none">MÉXICO 150 <span className="text-[#fbbf24]">TRACTO</span></span>
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

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 p-2.5 px-4 rounded-md transition-all text-[13px] font-bold uppercase tracking-tighter group ${
              activeTab === item.id 
                ? 'bg-[#27272a] text-[#fbbf24] shadow-sm' 
                : 'text-zinc-400 hover:bg-[#18181b] hover:text-white'
            }`}
          >
            <item.icon size={16} className={activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
            {isOpen && (
              <span className="whitespace-nowrap transition-opacity duration-200">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-zinc-800 bg-[#0c0c0e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-black text-white uppercase">
            {userRole.slice(0, 2)}
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <div className="text-[11px] font-black text-zinc-200 uppercase tracking-tighter">{userRole}</div>
              <div className="text-[9px] text-[#4ade80] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 bg-[#4ade80] rounded-full animate-pulse"></span>
                Online
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
