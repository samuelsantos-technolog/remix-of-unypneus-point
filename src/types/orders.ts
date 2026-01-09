export type PaymentCondition = 'on_delivery' | '7_days' | '14_days' | '21_days' | 'custom';

export interface OrderItem {
  id: string;
  brand: string;
  model: string;
  dimension: string;
  quantity: number;
  purchaseCost: number;
  freightPerTire: number;
  salePrice: number;
}

export interface Order {
  id: string;
  franchiseId: string;
  recipient: string;
  deliveryAddress: string;
  paymentCondition: PaymentCondition;
  customPaymentDays?: number;
  observations: string;
  items: OrderItem[];
  totalAmount: number;
  totalMargin: number;
  marginPercentage: number;
  status: 'pending' | 'in_load' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderCalculations {
  itemTotal: number;
  marginPerTire: number;
  totalMargin: number;
  marginPercentage: number;
}

export const PAYMENT_CONDITIONS: { value: PaymentCondition; label: string }[] = [
  { value: 'on_delivery', label: 'Na entrega' },
  { value: '7_days', label: '7 dias' },
  { value: '14_days', label: '14 dias' },
  { value: '21_days', label: '21 dias' },
  { value: 'custom', label: 'Customizado' },
];

export const calculateItemMargin = (item: OrderItem): OrderCalculations => {
  const itemTotal = item.quantity * item.salePrice;
  const marginPerTire = item.salePrice - item.purchaseCost - item.freightPerTire;
  const totalMargin = marginPerTire * item.quantity;
  const marginPercentage = item.salePrice > 0 ? (marginPerTire / item.salePrice) * 100 : 0;
  
  return { itemTotal, marginPerTire, totalMargin, marginPercentage };
};

export const calculateOrderTotals = (items: OrderItem[]) => {
  let totalAmount = 0;
  let totalMargin = 0;
  let totalSaleValue = 0;

  items.forEach(item => {
    const calcs = calculateItemMargin(item);
    totalAmount += calcs.itemTotal;
    totalMargin += calcs.totalMargin;
    totalSaleValue += calcs.itemTotal;
  });

  const marginPercentage = totalSaleValue > 0 ? (totalMargin / totalSaleValue) * 100 : 0;

  return { totalAmount, totalMargin, marginPercentage };
};
