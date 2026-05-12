
export type PartStatus = 'OK' | 'BAJO' | 'CRITICO';
export type UserRole = 'GERENTE' | 'VENTAS' | 'ALMACEN';

export interface InventoryItem {
  id: string;
  sku: string;
  description: string;
  brand: string;
  compatibility: string;
  engineType?: string;
  stock: Record<string, number>; // branchId -> stock
  price: number;
  status: PartStatus;
  salesCount: number; // For Top 5 BI
}

export interface ClientAccount {
  id: string;
  name: string;
  rfc: string;
  creditLimit: number;
  balance: number;
  history: Array<{
    id: string;
    date: string;
    amount: number;
    type: 'VENTA' | 'PAGO';
  }>;
}

export interface Sale {
  id: string;
  date: string;
  items: Array<{
    itemId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta';
  branchId: string;
}

export interface Transfer {
  id: string;
  itemId: string;
  quantity: number;
  originBranchId: string;
  destinationBranchId: string;
  status: 'En Tránsito' | 'Entregado';
  date: string;
  operator?: string;
  vehicleId?: string;
}

export interface Branch {
  id: string;
  name: string;
}
