import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, CreditCard, History, DollarSign, Wallet } from 'lucide-react';
import { ClientAccount } from '../types';

const MOCK_CLIENTS: ClientAccount[] = [
  {
    id: 'c1',
    name: 'Taller El Amigo Kenworth',
    rfc: 'AME120512K98',
    creditLimit: 150000,
    balance: 45000,
    history: [
      { id: 'h1', date: '2026-05-10', amount: 12500, type: 'VENTA' },
      { id: 'h2', date: '2026-05-08', amount: 5000, type: 'PAGO' },
      { id: 'h3', date: '2026-05-05', amount: 28000, type: 'VENTA' },
    ]
  },
  {
    id: 'c2',
    name: 'Flota Transportes 150',
    rfc: 'TRA881022H55',
    creditLimit: 500000,
    balance: 120000,
    history: [
      { id: 'h4', date: '2026-05-11', amount: 85000, type: 'VENTA' },
      { id: 'h5', date: '2026-04-20', amount: 35000, type: 'VENTA' },
    ]
  }
];

export const ClientAccountModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientAccount | null>(null);

  const filteredClients = MOCK_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.rfc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input 
              type="text" 
              placeholder="Buscar taller o RFC..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-[#09090b] border border-[#27272a] rounded text-[12px] text-white focus:outline-none focus:border-[#fbbf24] transition-all"
            />
          </div>
          
          <div className="space-y-2">
            {filteredClients.map(client => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`w-full text-left p-3 rounded border transition-all ${
                  selectedClient?.id === client.id 
                    ? 'bg-[#fbbf24] border-[#fbbf24] text-black' 
                    : 'bg-[#09090b] border-[#27272a] text-zinc-400 hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${selectedClient?.id === client.id ? 'bg-black/10' : 'bg-[#18181b]'}`}>
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase truncate">{client.name}</p>
                    <p className={`text-[9px] font-bold ${selectedClient?.id === client.id ? 'text-black/60' : 'text-zinc-600'}`}>{client.rfc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedClient ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Account Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Saldo Pendiente</p>
                <h4 className="text-xl font-black text-white">${selectedClient.balance.toLocaleString()}</h4>
              </div>
              <div className="bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Límite de Crédito</p>
                <h4 className="text-xl font-black text-zinc-400">${selectedClient.creditLimit.toLocaleString()}</h4>
              </div>
              <div className="bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Disponible</p>
                <h4 className="text-xl font-black text-[#4ade80]">${(selectedClient.creditLimit - selectedClient.balance).toLocaleString()}</h4>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-[#18181b] rounded-lg border border-[#27272a] overflow-hidden">
              <div className="p-4 border-b border-[#27272a] flex items-center justify-between bg-[#1f1f23]">
                <h3 className="text-[11px] font-black text-white uppercase flex items-center gap-2">
                  <History size={14} className="text-[#fbbf24]" />
                  Historial de Movimientos
                </h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-zinc-800 text-zinc-100 rounded text-[9px] font-bold uppercase hover:bg-zinc-700 transition-all">Estado Cuenta PDF</button>
                  <button className="px-3 py-1 bg-[#fbbf24] text-black rounded text-[9px] font-black uppercase transition-all">Registrar Pago</button>
                </div>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#09090b] text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2">Folio Ref</th>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {selectedClient.history.map(item => (
                    <tr key={item.id} className="border-b border-[#27272a] text-zinc-300">
                      <td className="px-4 py-3 font-mono">{item.date}</td>
                      <td className="px-4 py-3 font-bold">#F-{(9999 + selectedClient.history.indexOf(item)).toString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                          item.type === 'VENTA' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${item.type === 'VENTA' ? 'text-white' : 'text-emerald-500'}`}>
                        {item.type === 'VENTA' ? '+' : '-'}${item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Credit Note Visual */}
            <div className="bg-[#4ade80]/5 border border-[#4ade80]/20 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4ade80]/20 text-[#4ade80] rounded">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white uppercase">Estado Crediticio Saludable</p>
                  <p className="text-[9px] text-zinc-500">Este taller tiene un historial de pago puntual 100%</p>
                </div>
              </div>
              <DollarSign size={20} className="text-[#4ade80]/50" />
            </div>
          </motion.div>
        ) : (
          <div className="h-full bg-[#18181b] rounded-lg border border-[#27272a] border-dashed flex flex-col items-center justify-center text-zinc-600 py-12">
            <CreditCard size={48} className="mb-4 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">Seleccione un cliente para ver su estado</p>
          </div>
        )}
      </div>
    </div>
  );
};
