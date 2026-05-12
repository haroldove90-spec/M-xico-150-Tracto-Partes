import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, AlertCircle, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Sale, InventoryItem, Branch } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';

interface ManagerDashboardProps {
  sales: Sale[];
  inventory: InventoryItem[];
  branches: Branch[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#09090b] border border-[#27272a] p-2 rounded shadow-xl">
        <p className="text-[10px] font-black text-white uppercase tracking-tighter mb-1">{payload[0].payload.day}</p>
        <p className="text-[12px] font-bold text-[#fbbf24]">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ sales, inventory }) => {
  // Logic for BI metrics
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const topSellingParts = [...inventory].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);
  
  // Weekly Data for chart
  const weeklySalesData = [
    { day: 'Lunes', amount: 45000 },
    { day: 'Martes', amount: 32000 },
    { day: 'Miércoles', amount: 68000 },
    { day: 'Jueves', amount: 55000 },
    { day: 'Viernes', amount: 92000 },
    { day: 'Sábado', amount: 41000 },
    { day: 'Domingo', amount: 15000 },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ventas Totales', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', trend: '+12.5%' },
          { label: 'Top Vendedor', value: 'Sucursal 150', icon: ShoppingCart, color: 'text-blue-500', trend: '+8%' },
          { label: 'Ventas Perdidas', value: '14', icon: AlertCircle, color: 'text-rose-500', trend: '-2', sub: 'Sin Stock' },
          { label: 'Créditos Activos', value: '$840k', icon: Users, color: 'text-amber-500', trend: '+3', sub: 'Talleres' },
        ].map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#18181b] p-4 rounded-lg border border-[#27272a] relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{kpi.label}</p>
                <h3 className="text-xl font-black text-white mt-1 tracking-tighter">{kpi.value}</h3>
              </div>
              <div className={`p-2 rounded bg-[#09090b] ${kpi.color}`}>
                <kpi.icon size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                kpi.trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
              }`}>
                {kpi.trend.includes('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {kpi.trend}
              </span>
              <span className="text-[9px] text-zinc-600 font-bold uppercase">{kpi.sub || 'vs mes anterior'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-[#18181b] p-6 rounded-lg border border-[#27272a]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tighter">Ventas Semanales Consolidadas</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Rendimiento Operativo de Sucursales</p>
            </div>
            <div className="flex gap-2">
              <select className="bg-[#09090b] border border-[#27272a] text-[10px] font-bold text-zinc-400 p-1.5 rounded uppercase">
                <option>Esta Semana</option>
                <option>Semana Pasada</option>
              </select>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                  animationBegin={300}
                >
                  {weeklySalesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 4 ? '#fbbf24' : '#3f3f46'} 
                      className="hover:fill-[#fbbf24] transition-colors duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Parts */}
        <div className="bg-[#18181b] p-6 rounded-lg border border-[#27272a]">
          <h3 className="text-sm font-black text-white uppercase tracking-tighter mb-6">Top 5 Refacciones</h3>
          <div className="space-y-4">
            {topSellingParts.map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between p-2 rounded hover:bg-[#09090b] transition-colors border border-transparent hover:border-[#27272a]">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-zinc-700 w-4">0{idx + 1}</span>
                  <div>
                    <p className="text-[11px] font-bold text-white truncate w-32 md:w-auto overflow-hidden">{item.description}</p>
                    <p className="text-[9px] text-[#fbbf24] font-black uppercase">{item.brand}</p>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="text-[11px] font-black text-white whitespace-nowrap">{item.salesCount} <span className="text-zinc-600">uds</span></p>
                  <p className="text-[8px] text-zinc-500 font-bold uppercase">Trimestre</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 bg-zinc-800 border border-zinc-700 rounded text-[9px] font-black text-zinc-400 uppercase hover:text-white transition-all">
            Ver Reporte Completo de Almacén
          </button>
        </div>
      </div>
    </div>
  );
};

