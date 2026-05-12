import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Printer, User, MapPin, Package, Download, Truck } from 'lucide-react';
import { Transfer, InventoryItem, Sale } from '../types';

interface CartaPorteModuleProps {
  activeTransfers: Transfer[];
  recentSales: Sale[];
  inventory: InventoryItem[];
}

export const CartaPorteModule: React.FC<CartaPorteModuleProps> = ({ activeTransfers, recentSales, inventory }) => {
  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  const [operator, setOperator] = useState('Juan Manuel Perez');
  const [vehicle, setVehicle] = useState('Kenworth T680 - Placas 12-MX-99');

  const handleSelect = (op: any, type: 'sale' | 'transfer') => {
    setSelectedOperation({ ...op, type });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Source Selection List */}
      <div className="lg:col-span-4 bg-[#18181b] border border-[#27272a] rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#27272a] bg-[#27272a]/20">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <FileText size={14} className="text-[#fbbf24]" />
            Seleccionar Operación
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-[#27272a]">
          <div className="p-2 px-4 bg-[#09090b] text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Traspasos Activos</div>
          {activeTransfers.filter(t => t.status === 'En Tránsito').map(t => {
            const item = inventory.find(i => i.id === t.itemId);
            return (
              <button 
                key={t.id}
                onClick={() => handleSelect(t, 'transfer')}
                className={`w-full p-4 text-left hover:bg-white/5 transition-all group ${selectedOperation?.id === t.id ? 'bg-[#fbbf24]/5 border-l-2 border-[#fbbf24]' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono font-bold text-sm text-zinc-300 group-hover:text-[#fbbf24] transition-colors">{item?.sku}</span>
                  <span className="text-[9px] font-black p-1 bg-amber-500/10 text-amber-500 rounded uppercase">Traspaso</span>
                </div>
                <div className="text-[11px] text-zinc-500">{t.originBranchId} {'->'} {t.destinationBranchId}</div>
              </button>
            );
          })}
          
          <div className="p-2 px-4 bg-[#09090b] text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Ventas de Hoy</div>
          {recentSales.map(s => (
            <button 
              key={s.id}
              onClick={() => handleSelect(s, 'sale')}
              className={`w-full p-4 text-left hover:bg-white/5 transition-all group ${selectedOperation?.id === s.id ? 'bg-[#fbbf24]/5 border-l-2 border-[#fbbf24]' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-mono font-bold text-sm text-zinc-300">Venta #{s.id.slice(-4).toUpperCase()}</span>
                <span className="text-[9px] font-black p-1 bg-emerald-500/10 text-emerald-500 rounded uppercase">Venta</span>
              </div>
              <div className="text-[11px] text-zinc-500">Total: ${s.total.toLocaleString()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-8 bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden flex flex-col shadow-2xl relative">
        <AnimatePresence mode="wait">
          {!selectedOperation ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center"
            >
              <FileText size={64} className="text-zinc-800 mb-6" />
              <h4 className="text-lg font-bold text-zinc-400">Generador de Carta Porte Digital</h4>
              <p className="text-xs text-zinc-600 max-w-sm mt-2">
                Seleccione un traspaso en tránsito o una venta reciente para generar el documento de traslado oficial.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="flex-1 flex flex-col relative"
            >
              {/* Document Tool Header */}
              <div className="p-4 border-b border-[#27272a] flex justify-between items-center bg-[#09090b]">
                <div className="flex gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-zinc-500 uppercase">Operador</label>
                    <input 
                      type="text" value={operator} onChange={e => setOperator(e.target.value)}
                      className="bg-transparent border-none text-[12px] font-bold text-white focus:ring-0 p-0"
                    />
                  </div>
                  <div className="w-px bg-zinc-800" />
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-zinc-500 uppercase">Vehículo</label>
                    <input 
                      type="text" value={vehicle} onChange={e => setVehicle(e.target.value)}
                      className="bg-transparent border-none text-[12px] font-bold text-white focus:ring-0 p-0"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"><Printer size={16} /></button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#fbbf24] text-black font-black text-[11px] rounded uppercase shadow-lg shadow-[#fbbf24]/10">
                    <Download size={14} />
                    Finalizar Carta Porte
                  </button>
                </div>
              </div>

              {/* The "Paper" Preview */}
              <div className="flex-1 p-8 overflow-y-auto bg-zinc-900/50">
                <div className="w-full max-w-2xl mx-auto bg-white text-black p-10 min-h-[800px] shadow-2xl relative">
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                    <span className="text-8xl font-black rotate-[-45deg] whitespace-nowrap uppercase">Mexico 150</span>
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-start mb-12 relative z-10">
                    <div>
                      <h2 className="text-2xl font-black tracking-tighter uppercase mb-1">Mexico 150 <span className="text-zinc-500 italic">CP-3.0</span></h2>
                      <p className="text-[10px] font-bold text-zinc-400">RFC: MTX120512800 / LOGÍSTICA PESADA</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black uppercase bg-black text-white px-3 py-1 mb-2">Carta de Porte Digital</div>
                      <p className="text-[10px] font-mono leading-none">FOLIO: MX-CP-{selectedOperation.id.slice(0, 6).toUpperCase()}</p>
                      <p className="text-[10px] font-mono leading-tight">FECHA: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="grid grid-cols-2 gap-10 mb-10 relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin size={18} className="text-zinc-300 mt-1 shrink-0" />
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-1">Origen / Remitente</h4>
                          <p className="text-xs font-bold leading-tight uppercase">
                            {selectedOperation.type === 'transfer' ? selectedOperation.originBranchId : 'MATRIZ CORDILLERA'}
                          </p>
                          <p className="text-[10px] text-zinc-500">Av. Industrial 500, CDMX</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin size={18} className="text-zinc-300 mt-1 shrink-0" />
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-1">Destino / Destinatario</h4>
                          <p className="text-xs font-bold leading-tight uppercase">
                            {selectedOperation.type === 'transfer' ? selectedOperation.destinationBranchId : 'ENTREGA A CLIENTE'}
                          </p>
                          <p className="text-[10px] text-zinc-500">Sucursal Destino Pactada</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <User size={18} className="text-zinc-300 mt-1 shrink-0" />
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-1">Operador Asignado</h4>
                          <p className="text-xs font-bold leading-tight uppercase">{operator}</p>
                          <p className="text-[10px] text-zinc-500">Lic. Federal Tipo B</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Truck size={18} className="text-zinc-300 mt-1 shrink-0" />
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-1">Unidad de Transporte</h4>
                          <p className="text-xs font-bold leading-tight uppercase">{vehicle}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-b border-zinc-100 py-6 mb-10 relative z-10">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-4 flex items-center gap-2">
                       <Package size={14} /> Detalle de Carga Pesada
                    </h4>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-zinc-50 text-zinc-400 uppercase font-black">
                          <th className="p-2">Bien Transportado</th>
                          <th className="p-2 text-center">Clave SAT</th>
                          <th className="p-2 text-center">Cant.</th>
                          <th className="p-2 text-right">Peso Est.</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 font-bold uppercase">
                            {selectedOperation.type === 'transfer' 
                              ? inventory.find(i => i.id === selectedOperation.itemId)?.description 
                              : 'REFACCIONES PARA TRACTOCAMIÓN'}
                          </td>
                          <td className="p-2 text-center font-mono">25172400</td>
                          <td className="p-2 text-center font-bold">{selectedOperation.type === 'transfer' ? selectedOperation.quantity : 'LOTE'}</td>
                          <td className="p-2 text-right">150.00 KG</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-20 flex justify-center gap-10 opacity-30">
                    <div className="w-40 border-t border-black pt-2 text-center text-[10px] font-bold uppercase">Firma del Operador</div>
                    <div className="w-40 border-t border-black pt-2 text-center text-[10px] font-bold uppercase">Sello de Almacén</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
