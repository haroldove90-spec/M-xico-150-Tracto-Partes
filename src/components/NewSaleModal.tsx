import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShoppingCart, Search } from 'lucide-react';
import { InventoryItem, Branch } from '../types';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  branches: Branch[];
  onConfirmSale: (sale: { items: any[], total: number, paymentMethod: string, branchId: string }) => void;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({ isOpen, onClose, inventory, branches, onConfirmSale }) => {
  const [selectedBranch, setSelectedBranch] = useState('matriz-cdmx');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia' | 'Tarjeta'>('Efectivo');

  const selectedItem = inventory.find(i => i.id === selectedItemId);
  const subtotal = selectedItem ? selectedItem.price * qty : 0;
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const handleConfirm = () => {
    if (!selectedItemId || qty <= 0) return;
    onConfirmSale({
      items: [{ itemId: selectedItemId, quantity: qty, price: selectedItem!.price }],
      total,
      paymentMethod,
      branchId: selectedBranch
    });
    onClose();
    setSelectedItemId('');
    setQty(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-hidden bg-[#18181b] border border-[#27272a] rounded-xl z-[70] flex flex-col shadow-2xl font-sans"
          >
            <div className="p-4 border-b border-[#27272a] flex items-center justify-between bg-[#27272a]/20">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#fbbf24] rounded-sm"></span>
                <h2 className="text-sm font-bold text-white uppercase tracking-tight">Nueva Venta de Refacción</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Sucursal de Venta</label>
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] px-3 py-2 rounded text-[13px] text-white focus:outline-none focus:border-[#fbbf24]"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Refacción / SKU</label>
                  <select 
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] px-3 py-2 rounded text-[13px] text-white focus:outline-none focus:border-[#fbbf24]"
                  >
                    <option value="">Seleccione pieza...</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id} disabled={item.stock[selectedBranch] === 0}>
                        {item.sku} - {item.description} (Stock: {item.stock[selectedBranch] || 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Cantidad</label>
                    <input 
                      type="number" 
                      value={qty}
                      onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#09090b] border border-[#27272a] px-3 py-2 rounded text-[13px] text-white focus:outline-none focus:border-[#fbbf24]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Método de Pago</label>
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full bg-[#09090b] border border-[#27272a] px-3 py-2 rounded text-[13px] text-white focus:outline-none focus:border-[#fbbf24]"
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta de Crédito</option>
                      <option value="Transferencia">Transferencia</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Cliente</label>
                  <div className="w-full bg-[#09090b] border border-[#27272a] p-3 rounded text-[13px] text-zinc-500 flex items-center gap-3">
                    <User size={14}/>
                    Publico en General
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#27272a]">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-[12px] text-zinc-400 font-bold uppercase">Total a Liquidar</span>
                  <span className="text-2xl font-bold text-[#fbbf24] font-mono leading-none">${total.toLocaleString('es-MX')}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={onClose}
                    className="flex-1 py-3 bg-zinc-800 rounded font-black text-[10px] uppercase text-white hover:bg-zinc-700 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleConfirm}
                    disabled={!selectedItemId}
                    className="flex-1 py-3 bg-[#fbbf24] text-black rounded font-black text-[10px] uppercase shadow-lg shadow-[#fbbf24]/20 hover:bg-[#f59e0b] active:scale-95 transition-all disabled:opacity-50"
                  >
                    Confirmar Orden
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
