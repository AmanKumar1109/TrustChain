export type AdminTab =
  | 'overview'
  | 'brand-approvals'
  | 'fake-reports'
  | 'users-brands'
  | 'reward-partners'
  | 'analytics'
  | 'system-health';

export interface BrandApplication {
  id: string;
  brandName: string;
  legalEntity: string;
  category: string;
  gstNumber: string;
  cinNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  appliedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'More Info Requested';
  documents: {
    type: string;
    filename: string;
    verified: boolean;
    previewUrl?: string;
  }[];
  notes?: string;
}

export interface AdminFakeReport {
  id: string;
  reportId: string;
  reporterPhone: string;
  reportedDate: string;
  productName: string;
  brandName: string;
  batchNumber: string;
  shopName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  photoUrl: string;
  comment: string;
  status: 'Submitted' | 'Under review' | 'Valid' | 'Invalid';
  bountyPoints: number;
}

export interface PlatformUserEntity {
  id: string;
  name: string;
  identifier: string; // phone, email, or GST
  role: 'Consumer' | 'Manufacturer' | 'Distributor' | 'Retailer';
  joinedDate: string;
  totalActivityCount: number; // scans, products, or transfers
  status: 'Active' | 'Suspended';
}

export interface AdminRewardPartner {
  id: string;
  name: string;
  logo: string;
  category: string;
  activeOffersCount: number;
  totalRedemptions: number;
  pointsRequired: number;
  offerTitle: string;
  status: 'Active' | 'Paused';
}

export interface SystemServiceStatus {
  name: string;
  type: string;
  status: 'Operational' | 'Degraded' | 'Offline';
  latency: string;
  uptime: string;
}

export interface NetworkTransaction {
  hash: string;
  type: string;
  brandOrUser: string;
  timestamp: string;
  gasCostInr: string;
  status: 'Success' | 'Pending' | 'Failed';
  failureReason?: string;
}
