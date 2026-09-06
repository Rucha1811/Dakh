import { SELLERS } from '../data/mockData';

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  address: string;
  state: string;
  district: string;
  pinCode: string;
  verificationStatus: 'DRAFT' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'ACTIVE';
  exportReadiness: number;
}

export function getSellerForUser(user: { id?: string; name?: string; location?: string; role?: string } | null): Seller {
  if (!user) {
    return SELLERS[0];
  }
  const found = SELLERS.find((s) => s.userId === user.id);
  if (found) return found;

  // Fallback for custom registered user
  return {
    id: `SEL_${user.id || 'NEW'}`,
    userId: user.id || 'USR_NEW',
    businessName: user.name ? `${user.name} Exports` : 'My Handicrafts',
    businessType: 'Individual Artisan',
    address: user.location || 'Ahmedabad, Gujarat',
    state: 'Gujarat',
    district: 'Ahmedabad',
    pinCode: '380001',
    verificationStatus: 'ACTIVE',
    exportReadiness: 75,
  };
}
