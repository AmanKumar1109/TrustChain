export type ConsumerTab = 'home' | 'rewards' | 'products' | 'history' | 'profile';

export interface ClaimedProduct {
  id: string;
  name: string;
  brand: string;
  batchNumber: string;
  serialNumber: string;
  category: string;
  image: string;
  status: 'Claimed' | 'Pending Claim';
  claimedDate: string;
  warrantyValidUntil: string;
  purchaseProof: {
    retailerName: string;
    invoiceNumber: string;
    purchaseDate: string;
    amountPaid: string;
  };
  ownershipHistory: {
    role: string;
    name: string;
    location: string;
    date: string;
  }[];
}

export interface RewardOffer {
  id: string;
  brandName: string;
  brandLogo: string;
  title: string;
  discountText: string;
  pointsCost: number;
  expiryDate: string;
  category: string;
  couponCode: string;
  terms: string;
}

export interface UserReport {
  id: string;
  reportId: string;
  productName: string;
  shopName: string;
  location: string;
  reportedDate: string;
  status: 'Submitted' | 'Under review' | 'Valid' | 'Invalid';
  comment: string;
  bonusPointsEarned?: number;
}

export interface ScanHistoryRecord {
  id: string;
  code: string;
  productName: string;
  brand: string;
  timestamp: string;
  resultState: 'Genuine' | 'Suspicious' | 'Fake' | 'Recalled';
  pointsAwarded: number;
}
