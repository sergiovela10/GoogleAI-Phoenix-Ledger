export type PropertyType = 'House' | 'Land' | 'Commercial' | 'Industrial' | 'Mixed-use' | 'Office';

export type DealType = 'Sell' | 'Rent' | 'Both';

export type PropertyStatus = 
  | 'Available' 
  | 'In talks' 
  | 'Under NCND' 
  | 'Due Diligence' 
  | 'On Hold' 
  | 'Closed';

export interface PropertyFile {
  id: string;
  name: string;
  type: 'pdf' | 'cadastre' | 'contract' | 'blueprint' | 'appraisal';
  size: string;
  date: string;
  url?: string;
}

export interface NegotiationNote {
  id: string;
  date: string;
  author: string;
  note: string;
}

export interface BrokerContact {
  name: string;
  phone: string;
  email: string;
  agency: string;
  isOwnerDirect: boolean;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  dealType: DealType;
  district: string;
  address: string;
  priceMxn: number;
  rentPriceMxn?: number;
  landAreaM2: number;
  builtAreaM2?: number;
  status: PropertyStatus;
  mandateExpiryDate?: string; // ISO date format YYYY-MM-DD
  brokerContact: BrokerContact;
  files: PropertyFile[];
  photos: string[];
  zoning: string;
  description: string;
  negotiationNotes: NegotiationNote[];
  capRateEstimated?: number;
  commissionPct: number;
  featured?: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export type ViewMode = 'grid' | 'table' | 'pipeline' | 'map' | 'analytics';

export type Currency = 'MXN' | 'USD' | 'EUR';

export type Language = 'en' | 'es';

export interface AccentTheme {
  id: string;
  name: string;
  hex: string;
  soft: string;
}
