import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Truck, Package, CheckCircle2, ChevronRight } from 'lucide-react';
import { InventoryItem, Transfer, Branch } from '../types';

interface TransferModuleProps {
  inventory: InventoryItem[];
  transfers: Transfer[];
  branches: Branch[];
  onInitiateTransfer: (itemId: string, qty: number, origin: string, destination: string) => void;
  onConfirmArrival: (transferId: string) => void;
}

export const TransferModule: React.FC<TransferModuleProps> = ({ 
  inventory, 
  transfers, 
  branches,
  onInitiateTransfer,
  onConfirmArrival
}) => {
  const [selectedPart, setSelectedPart] = useState('');
  const [qty, setQty] = useState(1);
  const [origin, setOrigin] = useState('matriz-cdmx');
  const [destination, setDestination] = useState('sucursal-150');

  const handleTransfer = () => {
    if (!selectedPart || qty <= 0) return;
    onInitiateTransfer(selectedPart, qty, origin, destination);
    setSelectedPart('');
    setQty(1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Initiation Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 mb-6">
            <ArrowRightLeft size={16} className="text-[#fbbf24]" />
            Nueva Solicitud de Traspaso
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Refacción</label>
              <select 
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] px-3 py-2 rounded text-[12px] text-white outline-none focus:border-[#fbbf24] transition-all"
              >
                <option value="">Seleccionar parte...</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>{item.sku} - {item.description}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Origen</label>
                <select 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-3 py-2 rounded text-[12px] text-zinc-400 outline-none"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Destino</label>
                <select 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-3 py-2 rounded text-[12px] text-white outline-none focus:border-[#fbbf24]"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Cantidad</label>
              <input 
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                className="w-full bg-[#09090b] border border-[#27272a] px-3 py-2 rounded text-[12px] text-white outline-none focus:border-[#fbbf24]"
              />
            </div>

            <button 
              onClick={handleTransfer}
              disabled={!selectedPart}
              className="w-full py-3 bg-[#fbbf24] text-black font-black uppercase text-[11px] rounded tracking-widest hover:bg-amber-500 active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Iniciar Traspaso
            </button>
          </div>
        </div>

        <div className="bg-amber-900/10 border border-amber-900/30 p-4 rounded-lg">
          <div className="flex gap-3">
            <div className="p-2 bg-amber-900/20 text-amber-500 rounded">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-1">Manual de Logística</h4>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Todo traspaso entre sucursales debe ser escoltado por una Carta Porte digital. Asegurese de que el operador tenga su dispositivo listo para confirmación de llegada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History/Queue Panel */}
      <div className="lg:col-span-8 flex flex-col h-full bg-[#18181b] border border-[#27272a] rounded-lg">
        <div className="p-4 border-b border-[#27272a] flex justify-between items-center">
          <h3 className="text-sm font-bold text-white uppercase">Control de Tránsitos</h3>
          <span className="text-[10px] font-bold text-zinc-500">{transfers.length} Activos</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {transfers.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 p-12 text-center">
              <Package size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No hay traspasos activos en la red</p>
            </div>
          ) : (
            <div className="divide-y divide-[#27272a]">
              {transfers.map(transfer => {
                const item = inventory.find(i => i.id === transfer.itemId);
                const isInTransit = transfer.status === 'En Tránsito';

                return (
                  <div key={transfer.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded ${isInTransit ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        <Truck size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white tracking-tighter text-sm">{item?.sku}</span>
                          <ChevronRight size={14} className="text-zinc-600" />
                          <span className="text-[12px] font-medium text-zinc-300">{item?.description}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Cant: <span className="text-zinc-300">{transfer.quantity}</span></span>
                          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">{transfer.originBranchId} {'->'} {transfer.destinationBranchId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isInTransit ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                          {transfer.status}
                        </span>
                        <p className="text-[10px] text-zinc-600 mt-1">{transfer.date}</p>
                      </div>
                      {isInTransit ? (
                        <button 
                          onClick={() => onConfirmArrival(transfer.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80] hover:text-black rounded text-[11px] font-bold transition-all border border-[#4ade80]/30"
                        >
                          <CheckCircle2 size={14} />
                          Confirmar Arribo
                        </button>
                      ) : (
                        <div className="px-3 py-1.5 text-emerald-500">
                          <CheckCircle2 size={20} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
