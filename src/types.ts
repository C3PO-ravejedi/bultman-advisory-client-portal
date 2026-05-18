export type Role = 'Owner' | 'Advisor' | 'Associate' | 'Client' | 'External Collaborator';

export interface PortalUser {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  clientId?: string;
}

export interface Artwork {
  id: string;
  clientId: string;
  artist: string;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  location: string;
  status: 'In Collection' | 'On Loan' | 'In Conservation' | 'Under Review';
  valuation: number;
  imageUrl: string;
  provenance: string;
  nextAction: string;
}

export interface DocumentItem {
  id: string;
  clientId: string;
  artworkId?: string;
  name: string;
  category: 'Appraisal' | 'Insurance' | 'Provenance' | 'Condition Report' | 'Estate Planning' | 'Invoice';
  size: string;
  updatedAt: string;
  storagePath: string;
}

export interface MarketUpdate {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  tag: string;
}

export interface Message {
  id: string;
  clientId: string;
  from: string;
  role: Role;
  body: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}
