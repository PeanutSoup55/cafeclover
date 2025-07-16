export interface CloverMerchant {
  id: string;
  name: string;
  address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  timezone: string;
  currency: string;
}

export interface CloverItem {
  id: string;
  name: string;
  price: number;
  priceType: 'FIXED' | 'VARIABLE';
  defaultTaxRates: boolean;
  isRevenue: boolean;
  stockCount?: number;
  categories?: CloverCategory[];
}

export interface CloverCategory {
  id: string;
  name: string;
  sortOrder: number;
}

export interface CloverOrder {
  id: string;
  currency: string;
  total: number;
  taxAmount: number;
  state: 'OPEN' | 'LOCKED' | 'PAID';
  createdTime: number;
  modifiedTime: number;
  lineItems: CloverLineItem[];
}

export interface CloverLineItem {
  id: string;
  name: string;
  price: number;
  unitQty: number;
  item: {
    id: string;
  };
}

export interface CloverEmployee {
  id: string;
  name: string;
  nickname?: string;
  email?: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'MANAGER';
  pin?: string;
}

export interface CloverPayment {
  id: string;
  order: {
    id: string;
  };
  amount: number;
  tipAmount?: number;
  cashTendered?: number;
  cashbackAmount?: number;
  result: 'SUCCESS' | 'FAIL' | 'CANCEL';
  createdTime: number;
  cardTransaction?: {
    type: 'CREDIT' | 'DEBIT';
    first6: string;
    last4: string;
    cardType: string;
  };
}