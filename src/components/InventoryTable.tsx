import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryTableProps {
  inventory: InventoryItem[];
  branches: { id: string, name: string }[];
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ inventory, branches }) => {
  const [filterDead, setFilterDead] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterDead) {
      const totalStock = (Object.values(item.stock) as number[]).reduce((a, b) => a + b, 0);
      return matchesSearch && totalStock < 5;
    }
    return matchesSearch;
  });

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden flex flex-col h-full font-sans">
      <div className="p-4 border-b border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-2 text-white text-wrap uppercase">
            Inventario General de Refacciones
            <span className="text-[9px] bg-[#fbbf24] text-black px-1.5 py-0.5 rounded font-black">LOGÍSTICA</span>
          </h2>
          <p className="text-zinc-500 text-[11px]">Consolidado de stock crítico across sucursales</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilterDead(!filterDead)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-black transition-all border ${
              filterDead 
                ? 'bg-rose-500/20 border-rose-500 text-rose-500' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            <Filter size={12} />
            {filterDead ? 'VISTA: CRÍTICOS / MUERTOS' : 'FILTRAR STOCK MUERTO'}
          </button>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input 
              type="text" 
              placeholder="SKU o pieza..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-[12px] text-white focus:outline-none focus:border-[#fbbf24] w-48 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#27272a] text-[#a1a1aa] text-[11px] font-semibold uppercase tracking-wider">
              <th className="px-4 py-2 border-b border-[#27272a]">SKU / Marca</th>
              <th className="px-4 py-2 border-b border-[#27272a]">Descripción / Compatibilidad</th>
              {branches.map(branch => (
                <th key={branch.id} className="px-4 py-2 border-b border-[#27272a] text-center">{branch.name}</th>
              ))}
              <th className="px-4 py-2 border-b border-[#27272a] text-right">Precio</th>
              <th className="px-4 py-2 border-b border-[#27272a]">Estado</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {filteredInventory.map((item) => {
              const totalStock = (Object.values(item.stock) as number[]).reduce((a: number, b: number) => a + b, 0);
              const displayStatus = totalStock === 0 ? 'CRITICO' : totalStock < 10 ? 'BAJO' : 'OK';
              
              return (
                <tr key={item.id} className="border-b border-[#27272a] hover:bg-[#27272a]/30 transition-colors">
                  <td className="px-4 py-3 border-b border-[#27272a]">
                    <div className="flex flex-col">
                      <span className="text-zinc-300 font-mono font-bold tracking-tighter">{item.sku}</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-black">{item.brand}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-[#27272a]">
                    <div className="flex flex-col">
                      <span className="text-zinc-200">{item.description}</span>
                      <span className="text-[10px] text-zinc-500 italic uppercase tracking-tighter">{item.compatibility}</span>
                    </div>
                  </td>
                  {branches.map(branch => (
                    <td key={branch.id} className="px-4 py-3 border-b border-[#27272a] text-center font-mono">
                      <span className={item.stock[branch.id] === 0 ? 'text-zinc-600' : 'text-zinc-300'}>
                        {item.stock[branch.id] || 0}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3 border-b border-[#27272a] text-right font-mono text-zinc-100">
                    ${item.price.toLocaleString('es-MX')}
                  </td>
                  <td className="px-4 py-3 border-b border-[#27272a]">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      displayStatus === 'OK' ? 'bg-emerald-500/10 text-[#4ade80]' :
                      displayStatus === 'BAJO' ? 'bg-amber-500/10 text-[#fbbf24]' :
                      'bg-rose-500/10 text-[#f87171]'
                    }`}>
                      {displayStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
