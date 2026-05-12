/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SummaryCard } from './components/SummaryCard';
import { InventoryTable } from './components/InventoryTable';
import { NewSaleModal } from './components/NewSaleModal';
import { TransferModule } from './components/TransferModule';
import { CartaPorteModule } from './components/CartaPorteModule';
import { CashClosingModule } from './components/CashClosingModule';
import { ManagerDashboard } from './components/ManagerDashboard';
import { ClientAccountModule } from './components/ClientAccountModule';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowLeftRight, 
  AlertTriangle, 
  Plus,
  Users,
  Printer
} from 'lucide-react';
import { InventoryItem, Sale, Transfer, Branch, UserRole } from './types';

const INITIAL_BRANCHES: Branch[] = [
  { id: 'matriz-cdmx', name: 'Matriz CDMX' },
  { id: 'sucursal-150', name: 'Sucursal 150' },
  { id: 'norte-mty', name: 'Norte (MTY)' },
  { id: 'sur-qro', name: 'Sur (QRO)' },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', sku: 'TUR-CUM-X1', description: 'Turbo Diesel Cummins ISX', brand: 'Cummins', compatibility: 'Kenworth / Freightliner', engineType: 'Cummins', stock: { 'matriz-cdmx': 12, 'sucursal-150': 2, 'norte-mty': 0, 'sur-qro': 5 }, price: 24500.00, status: 'OK', salesCount: 145 },
  { id: '2', sku: 'ABS-SN-04', description: 'Sensor Velocidad ABS Frontal', brand: 'Wabco', compatibility: 'Kenworth T680', engineType: 'Universal', stock: { 'matriz-cdmx': 25, 'sucursal-150': 15, 'norte-mty': 8, 'sur-qro': 12 }, price: 1850.50, status: 'OK', salesCount: 320 },
  { id: '3', sku: 'CLU-SP-15', description: 'Kit Embrague Eaton Fuller 15.5"', brand: 'Eaton', compatibility: 'Kenworth T800', engineType: 'Caterpillar', stock: { 'matriz-cdmx': 1, 'sucursal-150': 0, 'norte-mty': 2, 'sur-qro': 0 }, price: 15400.00, status: 'BAJO', salesCount: 82 },
  { id: '4', sku: 'BAL-FR-77', description: 'Balatas Traseras HD Truck', brand: 'Bendix', compatibility: 'Universal Pesados', engineType: 'Universal', stock: { 'matriz-cdmx': 45, 'sucursal-150': 30, 'norte-mty': 12, 'sur-qro': 15 }, price: 950.00, status: 'OK', salesCount: 510 },
  { id: '5', sku: 'ALT-DEL-28', description: 'Alternador 24V 160A', brand: 'Delco Remy', compatibility: 'Freightliner Cascadia', engineType: 'Detroit Diesel', stock: { 'matriz-cdmx': 3, 'sucursal-150': 1, 'norte-mty': 0, 'sur-qro': 2 }, price: 8900.00, status: 'BAJO', salesCount: 48 },
  { id: '6', sku: 'FIL-ACE-22', description: 'Filtro Aceite LF14000NN', brand: 'Fleetguard', compatibility: 'Motores Cummins', engineType: 'Cummins', stock: { 'matriz-cdmx': 120, 'sucursal-150': 40, 'norte-mty': 60, 'sur-qro': 15 }, price: 540.00, status: 'OK', salesCount: 1240 },
  { id: '7', sku: 'MAR-VOL-01', description: 'Marcha para Camión Volvo VNL', brand: 'Mitsubishi', compatibility: 'Volvo VNL / Mack', engineType: 'Volvo D13', stock: { 'matriz-cdmx': 4, 'sucursal-150': 2, 'norte-mty': 1, 'sur-qro': 3 }, price: 11200.00, status: 'OK', salesCount: 32 },
  { id: '8', sku: 'TER-INT-55', description: 'Termostato Motor Navistar', brand: 'International', compatibility: 'International WorkStar', engineType: 'Navistar', stock: { 'matriz-cdmx': 8, 'sucursal-150': 0, 'norte-mty': 15, 'sur-qro': 5 }, price: 420.00, status: 'OK', salesCount: 68 },
  { id: '9', sku: 'BOL-FIR-22', description: 'Bolsa de Aire Suspensión Post.', brand: 'Firestone', compatibility: 'Remolques / Tractos', engineType: 'Universal', stock: { 'matriz-cdmx': 15, 'sucursal-150': 12, 'norte-mty': 10, 'sur-qro': 18 }, price: 2100.00, status: 'OK', salesCount: 188 },
  { id: '10', sku: 'INY-CAT-C15', description: 'Inyector Motor Cat C15', brand: 'Caterpillar', compatibility: 'Kenworth / Peterbilt', engineType: 'Caterpillar', stock: { 'matriz-cdmx': 2, 'sucursal-150': 4, 'norte-mty': 0, 'sur-qro': 1 }, price: 18900.00, status: 'BAJO', salesCount: 24 },
];

const INITIAL_SALES: Sale[] = [
  { id: 's1', date: '12/05/2026', branchId: 'matriz-cdmx', total: 49000, paymentMethod: 'Efectivo', items: [{ itemId: '1', quantity: 2, price: 24500 }] },
  { id: 's2', date: '12/05/2026', branchId: 'sucursal-150', total: 1850.50, paymentMethod: 'Transferencia', items: [{ itemId: '2', quantity: 1, price: 1850.50 }] },
  { id: 's3', date: '11/05/2026', branchId: 'matriz-cdmx', total: 15400, paymentMethod: 'Tarjeta', items: [{ itemId: '3', quantity: 1, price: 15400 }] },
  { id: 's4', date: '12/05/2026', branchId: 'matriz-cdmx', total: 2100, paymentMethod: 'Efectivo', items: [{ itemId: '9', quantity: 1, price: 2100 }] },
  { id: 's5', date: '12/05/2026', branchId: 'norte-mty', total: 1080, paymentMethod: 'Transferencia', items: [{ itemId: '6', quantity: 2, price: 540 }] },
  { id: 's6', date: '12/05/2026', branchId: 'sucursal-150', total: 22400, paymentMethod: 'Efectivo', items: [{ itemId: '7', quantity: 2, price: 11200 }] },
  { id: 's7', date: '10/05/2026', branchId: 'sur-qro', total: 540, paymentMethod: 'Tarjeta', items: [{ itemId: '6', quantity: 1, price: 540 }] },
];

const INITIAL_TRANSFERS: Transfer[] = [
  { id: 't1', itemId: '6', quantity: 50, originBranchId: 'matriz-cdmx', destinationBranchId: 'sucursal-150', status: 'En Tránsito', date: '12/05/2026' },
  { id: 't2', itemId: '4', quantity: 20, originBranchId: 'matriz-cdmx', destinationBranchId: 'norte-mty', status: 'Entregado', date: '10/05/2026' },
  { id: 't3', itemId: '2', quantity: 5, originBranchId: 'sucursal-150', destinationBranchId: 'sur-qro', status: 'En Tránsito', date: '12/05/2026' },
  { id: 't4', itemId: '10', quantity: 2, originBranchId: 'matriz-cdmx', destinationBranchId: 'sucursal-150', status: 'En Tránsito', date: '11/05/2026' },
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('ventas');
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('GERENTE');

  // States
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [transfers, setTransfers] = useState<Transfer[]>(INITIAL_TRANSFERS);

  // Auto-switch tabs when role changes for demo flow
  useEffect(() => {
    if (userRole === 'GERENTE') setActiveTab('dashboard');
    else if (userRole === 'VENTAS') setActiveTab('ventas');
    else if (userRole === 'ALMACEN') setActiveTab('inventarios');
  }, [userRole]);

  // Handlers
  const handleConfirmSale = (saleData: { items: any[], total: number, paymentMethod: string, branchId: string }) => {
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      items: saleData.items,
      total: saleData.total,
      paymentMethod: saleData.paymentMethod as any,
      branchId: saleData.branchId
    };

    setSales(prev => [...prev, newSale]);
    setActiveTab('facturacion'); // Switch to cash closing/folios

    // Update Inventory
    setInventory(prev => prev.map(item => {
      const saleItem = saleData.items.find(si => si.itemId === item.id);
      if (saleItem) {
        return {
          ...item,
          stock: {
            ...item.stock,
            [saleData.branchId]: (item.stock[saleData.branchId] || 0) - saleItem.quantity
          }
        };
      }
      return item;
    }));
  };

  const handleInitiateTransfer = (itemId: string, qty: number, origin: string, destination: string) => {
    const newTransfer: Transfer = {
      id: Math.random().toString(36).substr(2, 9),
      itemId,
      quantity: qty,
      originBranchId: origin,
      destinationBranchId: destination,
      status: 'En Tránsito',
      date: new Date().toLocaleDateString()
    };

    setTransfers(prev => [...prev, newTransfer]);
    setActiveTab('carta-porte'); // Auto-switch for the user to see the generated document

    // Deduct from origin
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          stock: {
            ...item.stock,
            [origin]: (item.stock[origin] || 0) - qty
          }
        };
      }
      return item;
    }));
  };

  const handleConfirmArrival = (transferId: string) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (!transfer) return;

    setTransfers(prev => prev.map(t => 
      t.id === transferId ? { ...t, status: 'Entregado' } : t
    ));

    // Add to destination
    setInventory(prev => prev.map(item => {
      if (item.id === transfer.itemId) {
        return {
          ...item,
          stock: {
            ...item.stock,
            [transfer.destinationBranchId]: (item.stock[transfer.destinationBranchId] || 0) + transfer.quantity
          }
        };
      }
      return item;
    }));
  };

  // derived stats
  const dailyTotal = sales.reduce((acc, s) => acc + s.total, 0);
  const inTransitCount = transfers.filter(t => t.status === 'En Tránsito').length;
  const lowStockCount = inventory.filter(item => (Object.values(item.stock) as number[]).reduce((a: number, b: number) => a + b, 0) < 10).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex overflow-hidden relative">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main 
        className={`flex-1 transition-all duration-300 overflow-y-auto h-screen ${isSidebarOpen ? 'md:ml-[240px]' : 'md:ml-[80px]'}`}
      >
        <header className="h-14 border-b border-[#27272a] flex items-center justify-between px-4 md:px-8 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-[#18181b] rounded transition-colors text-zinc-500 hover:text-white md:hidden"
            >
              <Plus size={18} className={isSidebarOpen ? 'rotate-45 transition-transform' : 'transition-transform'} />
            </button>
            <h1 className="text-[10px] md:text-sm font-bold tracking-tight uppercase text-zinc-100 truncate max-w-[120px] md:max-w-none">Mexico 150 - Panel</h1>
            <div className="h-3 w-px bg-zinc-800 hidden md:block" />
            <span className="text-zinc-500 text-[10px] md:text-[12px] font-medium uppercase tracking-widest hidden md:block">{activeTab}</span>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex bg-[#18181b] p-0.5 md:p-1 rounded gap-0.5 md:gap-1 border border-[#27272a]">
              {(['GERENTE', 'VENTAS', 'ALMACEN'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`px-1.5 md:px-3 py-0.5 md:py-1 rounded text-[8px] md:text-[10px] font-black uppercase transition-all ${
                    userRole === role 
                      ? 'bg-[#fbbf24] text-black shadow-lg shadow-[#fbbf24]/10' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {role.slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-4 border-l border-zinc-800 pl-3 md:pl-6">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] md:text-[11px] font-bold text-zinc-200">
                  {userRole === 'GERENTE' ? 'Gerencia' : userRole === 'VENTAS' ? 'POS' : 'Almacén'}
                </span>
                <span className="text-[8px] md:text-[9px] text-[#4ade80] font-black uppercase tracking-tighter">ONLINE</span>
              </div>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100 font-bold text-[8px] md:text-[10px]">
                {userRole.slice(0, 2)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-[1400px] mx-auto space-y-6">
          
          {(activeTab === 'ventas' && (userRole === 'GERENTE' || userRole === 'VENTAS')) && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                    {userRole === 'VENTAS' ? 'Punto de Venta (POS)' : 'Control de Ventas Global'}
                  </h2>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Resumen General - <span className="text-zinc-300">{new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</span></p>
                </motion.div>
                
                {(userRole === 'VENTAS' || userRole === 'GERENTE') && (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIsSaleModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#fbbf24] text-black font-black uppercase text-xs tracking-tighter rounded shadow-lg shadow-[#fbbf24]/10 transition-all"
                  >
                    <Plus size={16} className="stroke-[3px]" />
                    Nueva Venta
                  </motion.button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard title="Ventas del Día" value={`$${dailyTotal.toLocaleString()}`} subtitle="Corte de caja actual" icon={TrendingUp} trend={{ value: '12', isPositive: true }} />
                <SummaryCard title="Traspasos Pendientes" value={inTransitCount.toString()} subtitle="En tránsito / por recibir" icon={ArrowLeftRight} color="#38bdf8" trend={{ value: transfers.length.toString(), isPositive: true }} />
                <SummaryCard title="Alertas de Stock" value={lowStockCount.toString().padStart(2, '0')} subtitle="SKUs bajo mínimo" icon={AlertTriangle} color="#f87171" trend={{ value: '2', isPositive: false }} />
              </div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <InventoryTable inventory={inventory} branches={INITIAL_BRANCHES} />
              </motion.div>
            </div>
          )}

          {(activeTab === 'facturacion' && (userRole === 'GERENTE' || userRole === 'VENTAS')) && (
            <CashClosingModule sales={sales} showAll={userRole === 'GERENTE'} />
          )}

          {(activeTab === 'traspasos' && (userRole === 'GERENTE' || userRole === 'ALMACEN')) && (
            <TransferModule 
              inventory={inventory} 
              transfers={transfers} 
              branches={INITIAL_BRANCHES} 
              onInitiateTransfer={handleInitiateTransfer}
              onConfirmArrival={handleConfirmArrival}
            />
          )}

          {(activeTab === 'inventarios' && (userRole === 'GERENTE' || userRole === 'ALMACEN')) && (
            <InventoryTable inventory={inventory} branches={INITIAL_BRANCHES} />
          )}

          {activeTab === 'dashboard' && userRole === 'GERENTE' && (
            <ManagerDashboard 
              sales={sales} 
              inventory={inventory} 
              branches={INITIAL_BRANCHES} 
            />
          )}

          {activeTab === 'clientes' && (userRole === 'GERENTE' || userRole === 'VENTAS') && (
            <ClientAccountModule />
          )}

          {activeTab === 'carta-porte' && (
            <CartaPorteModule 
              activeTransfers={transfers} 
              recentSales={sales} 
              inventory={inventory} 
            />
          )}
          
          {/* Access Denied State */}
          {((activeTab === 'facturacion' && userRole === 'ALMACEN') || 
            (activeTab === 'traspasos' && userRole === 'VENTAS') ||
            (activeTab === 'ventas' && userRole === 'ALMACEN')) && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black uppercase text-white">Acceso Restringido</h3>
              <p className="text-zinc-500 text-sm max-w-xs mt-2">Su rol actual ({userRole}) no tiene permisos para acceder a este módulo.</p>
            </div>
          )}
        </div>
      </main>

      <NewSaleModal 
        isOpen={isSaleModalOpen} 
        onClose={() => setIsSaleModalOpen(false)} 
        inventory={inventory}
        branches={INITIAL_BRANCHES}
        onConfirmSale={handleConfirmSale}
      />
    </div>
  );
}
