import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Receipt,
  Download,
  Calendar
} from 'lucide-react';
import { Sale } from '../types';

interface CashClosingModuleProps {
  sales: Sale[];
  branchId?: string;
  showAll?: boolean;
}

export const CashClosingModule: React.FC<CashClosingModuleProps> = ({ sales, branchId = 'matriz-cdmx', showAll = false }) => {
  const filteredSales = showAll ? sales : sales.filter(s => s.branchId === branchId);
  
  const totals = filteredSales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
    acc.total += sale.total;
    return acc;
  }, { Efectivo: 0, Transferencia: 0, Tarjeta: 0, total: 0 });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black uppercase text-white flex items-center gap-2">
            <Calculator className="text-[#fbbf24]" size={20} />
            Corte de Caja Diario
          </h2>
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">Consolidado por métodos de pago y sucursal</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#18181b] border border-[#27272a] rounded px-4 py-2 flex items-center gap-3">
            <Calendar size={14} className="text-zinc-500" />
            <span className="text-xs font-bold text-zinc-300 uppercase">{new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-black text-xs uppercase rounded transition-all hover:bg-emerald-400">
            <Download size={14} />
            Exportar PDF
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Efectivo', value: totals.Efectivo, icon: DollarSign, color: '#fbbf24' },
          { label: 'Tarjeta', value: totals.Tarjeta, icon: CreditCard, color: '#38bdf8' },
          { label: 'Transferencia', value: totals.Transferencia, icon: Smartphone, color: '#4ade80' },
          { label: 'Cierre Total', value: totals.total, icon: Calculator, color: '#ffffff', isMain: true }
        ].map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-lg border flex flex-col gap-2 ${stat.isMain ? 'bg-[#fbbf24] border-[#fbbf24]' : 'bg-[#18181b] border-[#27272a]'}`}
          >
            <div className={`flex justify-between items-center ${stat.isMain ? 'text-[#0a0a0a]' : 'text-zinc-500'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
              <stat.icon size={16} />
            </div>
            <div className={`text-2xl font-black font-mono tracking-tighter ${stat.isMain ? 'text-[#0a0a0a]' : 'text-zinc-100'}`}>
              ${stat.value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#27272a] bg-[#27272a]/20 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Desglose de Operaciones</h3>
          <span className="text-[10px] font-bold text-zinc-500">{filteredSales.length} Ventas Registradas</span>
        </div>
        
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-[#09090b]">
              <tr className="text-[10px] text-zinc-500 font-black uppercase">
                <th className="px-6 py-3 border-b border-[#27272a]">ID / Folio</th>
                <th className="px-6 py-3 border-b border-[#27272a]">Ubicación</th>
                <th className="px-6 py-3 border-b border-[#27272a]">Método</th>
                <th className="px-6 py-3 border-b border-[#27272a] text-right">Monto</th>
                <th className="px-6 py-3 border-b border-[#27272a] text-right">IVA Prod</th>
                <th className="px-6 py-3 border-b border-[#27272a] text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-[#27272a] hover:bg-white/5 group">
                  <td className="px-6 py-4 font-mono font-bold text-zinc-300">#MX-{sale.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-zinc-500 uppercase font-medium">{sale.branchId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      sale.paymentMethod === 'Efectivo' ? 'bg-amber-500/10 text-amber-500' :
                      sale.paymentMethod === 'Tarjeta' ? 'bg-sky-500/10 text-sky-500' :
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-white">${sale.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono text-zinc-500">${(sale.total * 0.16).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-zinc-500 hover:text-white"><Receipt size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 font-medium">No se han registrado operaciones en el turno actual</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
