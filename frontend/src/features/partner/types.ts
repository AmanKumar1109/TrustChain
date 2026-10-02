export type PartnerRole = 'distributor' | 'retailer';

export type PartnerTab =
  | 'overview'
  | 'incoming'
  | 'inventory'
  | 'transfer' // distributor only
  | 'scan-and-sell' // retailer only
  | 'history'
  | 'reputation'
  | 'settings';

export interface ShipmentItem {
  id: string;
  shipmentId: string;
  sender: string;
  batchNumber: string;
  productName: string;
  quantity: number;
  originLocation: string;
  dispatchDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string;
}

export interface InventoryBatch {
  id: string;
  batchNumber: string;
  productName: string;
  category: string;
  unitsInStock: number;
  mfgDate: string;
  expiryDate: string;
  status: 'in-stock' | 'low-stock' | 'recalled';
  lastScannedDate: string;
}

export interface ActivityHistoryItem {
  id: string;
  type: 'sale' | 'transfer_in' | 'transfer_out';
  title: string;
  detail: string;
  units: number;
  timestamp: string;
  targetEntity?: string;
  status: 'completed' | 'flagged';
}
