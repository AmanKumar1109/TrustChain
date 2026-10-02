export type ManufacturerTab =
  | 'overview'
  | 'products'
  | 'batches'
  | 'supply-chain'
  | 'partners'
  | 'hotspots'
  | 'analytics'
  | 'recall'
  | 'rewards'
  | 'billing'
  | 'settings';

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: 'Pharmaceutical' | 'Electronics' | 'Cosmetics' | 'Luxury' | 'FMCG';
  description: string;
  image: string;
  totalBatches: number;
  activeUnits: number;
  createdAt: string;
}

export interface BatchItem {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  mfgDate: string;
  expiryDate: string;
  protectionLevel: 'high-value' | 'standard';
  status: 'active' | 'in-transit' | 'recalled' | 'depleted';
  creditsCost: number;
  qrGenerated: boolean;
  txHash: string;
}

export interface SupplyChainTransfer {
  id: string;
  transferId: string;
  batchNumber: string;
  productName: string;
  partnerName: string;
  partnerRole: 'Distributor' | 'Wholesaler' | 'Retailer';
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected';
  requestDate: string;
  completionDate?: string;
  sourceLocation: string;
  destLocation: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  role: 'Distributor' | 'Wholesaler' | 'Retailer';
  location: string;
  status: 'active' | 'pending' | 'suspended';
  reputationScore: number;
  totalTransfers: number;
  joinedDate: string;
  gstin: string;
}

export interface HotspotReport {
  id: string;
  city: string;
  state: string;
  area: string;
  productName: string;
  batchNumber: string;
  reportCount: number;
  threatLevel: 'critical' | 'high' | 'medium';
  coordinates: { x: number; y: number }; // Percentage for interactive map SVG
  lastReported: string;
  suspectedCause: string;
}

export interface RecallRecord {
  id: string;
  batchNumber: string;
  productName: string;
  unitsRecalled: number;
  recallDate: string;
  reason: string;
  status: 'active' | 'completed';
  returnedUnits: number;
}
