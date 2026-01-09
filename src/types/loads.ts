import { OrderItem } from './orders';

export interface LoadItem extends OrderItem {
  orderId: string;
  orderedQuantity: number;
  loadedQuantity: number;
}

export interface Load {
  id: string;
  franchiseId: string;
  vehiclePlate: string;
  vehicleModel: string;
  trailerPlate?: string;
  trailerModel?: string;
  driverName: string;
  driverDocument: string;
  origin: string;
  loadDateTime: Date;
  orderIds: string[];
  items: LoadItem[];
  totalFreight: number;
  totalItems: number;
  status: 'pending' | 'loading' | 'in_transit' | 'delivered' | 'cancelled';
  nfeStatus: 'pending' | 'emitted' | 'error';
  nfeNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  finalizedAt?: Date;
}

export const calculateLoadFreight = (items: LoadItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.freightPerTire * item.loadedQuantity);
  }, 0);
};

export const calculateTotalLoadedItems = (items: LoadItem[]): number => {
  return items.reduce((total, item) => total + item.loadedQuantity, 0);
};
