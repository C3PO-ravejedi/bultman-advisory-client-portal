import type { Artwork, AuditEvent, DocumentItem, MarketUpdate, Message, PortalUser } from './types';

export const demoUsers: PortalUser[] = [
  { uid: 'owner-demo', email: 'tristan@bultmanadvisory.com', displayName: 'Tristan Bultman', role: 'Owner' },
  { uid: 'advisor-demo', email: 'advisor@bultmanadvisory.com', displayName: 'Leigh Mozes', role: 'Advisor' },
  { uid: 'client-demo', email: 'client@example.com', displayName: 'Eleanor Whitfield', role: 'Client', clientId: 'whitfield' },
];

export const artworks: Artwork[] = [
  {
    id: 'art-001', clientId: 'whitfield', artist: 'Helen Frankenthaler', title: 'Provincetown Study', year: '1963', medium: 'Acrylic on canvas', dimensions: '48 × 62 in', location: 'New York Residence', status: 'In Collection', valuation: 1850000,
    imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1400&q=80', provenance: 'Private collection, New York; acquired through advisor review in 2018.', nextAction: 'Update insurance schedule before June renewal.'
  },
  {
    id: 'art-002', clientId: 'whitfield', artist: 'Sam Gilliam', title: 'Drape Variation', year: '1971', medium: 'Acrylic-stained canvas', dimensions: '72 × 84 in', location: 'Crozier Fine Arts', status: 'Under Review', valuation: 740000,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1400&q=80', provenance: 'Estate of the artist; private sale, 2021.', nextAction: 'Condition photography requested from storage facility.'
  },
  {
    id: 'art-003', clientId: 'whitfield', artist: 'Joan Mitchell', title: 'Untitled Works on Paper', year: '1958', medium: 'Oil and charcoal on paper', dimensions: '22 × 30 in', location: 'On loan — museum exhibition', status: 'On Loan', valuation: 520000,
    imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=80', provenance: 'Galerie Jean Fournier; family collection by descent.', nextAction: 'Loan return inspection scheduled.'
  },
];

export const documents: DocumentItem[] = [
  { id: 'doc-1', clientId: 'whitfield', artworkId: 'art-001', name: '2026 Insurance Schedule.pdf', category: 'Insurance', size: '428 KB', updatedAt: '2026-05-12', storagePath: 'clients/whitfield/insurance-2026.pdf' },
  { id: 'doc-2', clientId: 'whitfield', artworkId: 'art-002', name: 'Gilliam Condition Report.pdf', category: 'Condition Report', size: '3.2 MB', updatedAt: '2026-05-08', storagePath: 'clients/whitfield/gilliam-condition.pdf' },
  { id: 'doc-3', clientId: 'whitfield', name: 'Estate Transition Memo.pdf', category: 'Estate Planning', size: '812 KB', updatedAt: '2026-04-28', storagePath: 'clients/whitfield/estate-transition.pdf' },
];

export const marketUpdates: MarketUpdate[] = [
  { id: 'mu-1', title: 'Postwar abstraction remains selective but resilient', summary: 'Auction depth continues to favor fresh-to-market works with strong provenance and museum history.', publishedAt: 'May 2026', tag: 'Market Intelligence' },
  { id: 'mu-2', title: 'Insurance renewals: appraisal cadence tightening', summary: 'Carriers are increasingly requesting refreshed valuations for collections above $5M every 18–24 months.', publishedAt: 'May 2026', tag: 'Risk' },
];

export const messages: Message[] = [
  { id: 'msg-1', clientId: 'whitfield', from: 'Leigh Mozes', role: 'Advisor', body: 'We received the updated storage images. I flagged one stretcher concern for conservation review.', createdAt: 'Today, 9:42 AM' },
  { id: 'msg-2', clientId: 'whitfield', from: 'Eleanor Whitfield', role: 'Client', body: 'Please include the Mitchell works in the family governance packet for next week.', createdAt: 'Yesterday, 5:10 PM' },
];

export const auditEvents: AuditEvent[] = [
  { id: 'audit-1', actor: 'Leigh Mozes', action: 'Viewed document', target: 'Gilliam Condition Report.pdf', createdAt: 'May 18, 10:21 AM' },
  { id: 'audit-2', actor: 'Tristan Bultman', action: 'Updated valuation', target: 'Provincetown Study', createdAt: 'May 17, 4:02 PM' },
  { id: 'audit-3', actor: 'Eleanor Whitfield', action: 'Downloaded report', target: '2026 Insurance Schedule.pdf', createdAt: 'May 16, 2:18 PM' },
];
