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
  {
    id: 'art-004', clientId: 'whitfield', artist: 'Richard Diebenkorn', title: 'Ocean Park Drawing', year: '1976', medium: 'Gouache, graphite, and crayon on paper', dimensions: '19 × 24 in', location: 'Family office archive', status: 'In Collection', valuation: 680000,
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1400&q=80', provenance: 'Private California collection; acquired at auction, 2019.', nextAction: 'Confirm UV glazing recommendation before reinstallation.'
  },
  {
    id: 'art-005', clientId: 'whitfield', artist: 'Lee Krasner', title: 'Collage Study', year: '1967', medium: 'Collage and oil on paper mounted to board', dimensions: '18 × 22 in', location: 'Conservation studio', status: 'In Conservation', valuation: 920000,
    imageUrl: 'https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?auto=format&fit=crop&w=1400&q=80', provenance: 'Marlborough-Gerson Gallery; private collection by descent.', nextAction: 'Review conservator treatment proposal and framing estimate.'
  },
  {
    id: 'art-006', clientId: 'whitfield', artist: 'Norman Lewis', title: 'Nocturne Field', year: '1961', medium: 'Oil on canvas', dimensions: '40 × 50 in', location: 'Upper East Side residence', status: 'In Collection', valuation: 1250000,
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1400&q=80', provenance: 'Private New York collection; advisor-brokered purchase, 2022.', nextAction: 'Prepare market memo for lender collateral review.'
  },
  {
    id: 'art-007', clientId: 'whitfield', artist: 'Alma Thomas', title: 'Color Field Study', year: '1972', medium: 'Acrylic on paper', dimensions: '24 × 30 in', location: 'Advisor review queue', status: 'Under Review', valuation: 310000,
    imageUrl: 'https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=1400&q=80', provenance: 'Private Washington, DC collection; diligence file pending.', nextAction: 'Create provenance checklist and condition photography request.'
  },
  {
    id: 'art-008', clientId: 'whitfield', artist: 'Grace Hartigan', title: 'Study for Interior', year: '1955', medium: 'Oil and ink on paper', dimensions: '26 × 20 in', location: 'Pending charitable placement review', status: 'Under Review', valuation: 265000,
    imageUrl: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=1400&q=80', provenance: 'Artist studio inventory; private collection, Baltimore.', nextAction: 'Shortlist museum placement options and tax documentation needs.'
  },
];

export const documents: DocumentItem[] = [
  { id: 'doc-1', clientId: 'whitfield', artworkId: 'art-001', name: '2026 Insurance Schedule.pdf', category: 'Insurance', size: '428 KB', updatedAt: '2026-05-12', storagePath: 'clients/whitfield/insurance-2026.pdf' },
  { id: 'doc-2', clientId: 'whitfield', artworkId: 'art-002', name: 'Gilliam Condition Report.pdf', category: 'Condition Report', size: '3.2 MB', updatedAt: '2026-05-08', storagePath: 'clients/whitfield/gilliam-condition.pdf' },
  { id: 'doc-3', clientId: 'whitfield', name: 'Estate Transition Memo.pdf', category: 'Estate Planning', size: '812 KB', updatedAt: '2026-04-28', storagePath: 'clients/whitfield/estate-transition.pdf' },
  { id: 'doc-4', clientId: 'whitfield', artworkId: 'art-005', name: 'Krasner Treatment Proposal.pdf', category: 'Condition Report', size: '1.8 MB', updatedAt: '2026-05-15', storagePath: 'clients/whitfield/krasner-treatment-proposal.pdf' },
  { id: 'doc-5', clientId: 'whitfield', artworkId: 'art-006', name: 'Lewis Collateral Review Memo.pdf', category: 'Appraisal', size: '596 KB', updatedAt: '2026-05-14', storagePath: 'clients/whitfield/lewis-collateral-review.pdf' },
  { id: 'doc-6', clientId: 'whitfield', artworkId: 'art-004', name: 'Diebenkorn Provenance Packet.pdf', category: 'Provenance', size: '2.4 MB', updatedAt: '2026-05-03', storagePath: 'clients/whitfield/diebenkorn-provenance.pdf' },
  { id: 'doc-7', clientId: 'whitfield', name: '2026 Advisory Retainer Invoice.pdf', category: 'Invoice', size: '212 KB', updatedAt: '2026-05-01', storagePath: 'clients/whitfield/advisory-retainer-invoice.pdf' },
];

export const marketUpdates: MarketUpdate[] = [
  { id: 'mu-1', title: 'Postwar abstraction remains selective but resilient', summary: 'Auction depth continues to favor fresh-to-market works with strong provenance and museum history.', publishedAt: 'May 2026', tag: 'Market Intelligence' },
  { id: 'mu-2', title: 'Insurance renewals: appraisal cadence tightening', summary: 'Carriers are increasingly requesting refreshed valuations for collections above $5M every 18–24 months.', publishedAt: 'May 2026', tag: 'Risk' },
  { id: 'mu-3', title: 'Works on paper: condition standards are rising', summary: 'Collectors are seeing stronger buyer scrutiny around hinging, UV exposure, paper acidity, and framing history.', publishedAt: 'May 2026', tag: 'Conservation' },
  { id: 'mu-4', title: 'Museum loans still matter for long-term value', summary: 'Institutional exhibition history remains a key differentiator for mid-career and postwar women artists.', publishedAt: 'April 2026', tag: 'Institutional' },
  { id: 'mu-5', title: 'Private sales gaining share for estate transitions', summary: 'Families are increasingly using discreet dealer and advisor channels before testing auction liquidity.', publishedAt: 'April 2026', tag: 'Estate Strategy' },
];

export const messages: Message[] = [
  { id: 'msg-1', clientId: 'whitfield', from: 'Leigh Mozes', role: 'Advisor', body: 'We received the updated storage images. I flagged one stretcher concern for conservation review.', createdAt: 'Today, 9:42 AM' },
  { id: 'msg-2', clientId: 'whitfield', from: 'Eleanor Whitfield', role: 'Client', body: 'Please include the Mitchell works in the family governance packet for next week.', createdAt: 'Yesterday, 5:10 PM' },
  { id: 'msg-3', clientId: 'whitfield', from: 'Tristan Bultman', role: 'Owner', body: 'The Lewis collateral memo is ready for review. I recommend we keep the lender packet narrow: valuation summary, provenance chain, and condition image appendix.', createdAt: 'May 18, 3:44 PM' },
  { id: 'msg-4', clientId: 'whitfield', from: 'Leigh Mozes', role: 'Advisor', body: 'Krasner conservation estimate added. The treatment is preventative, not urgent, but I would approve before summer humidity becomes a factor.', createdAt: 'May 17, 11:06 AM' },
  { id: 'msg-5', clientId: 'whitfield', from: 'Eleanor Whitfield', role: 'Client', body: 'Let’s discuss charitable placement options for the Hartigan study after the estate planning call.', createdAt: 'May 16, 4:28 PM' },
];

export const auditEvents: AuditEvent[] = [
  { id: 'audit-1', actor: 'Leigh Mozes', action: 'Viewed document', target: 'Gilliam Condition Report.pdf', createdAt: 'May 18, 10:21 AM' },
  { id: 'audit-2', actor: 'Tristan Bultman', action: 'Updated valuation', target: 'Provincetown Study', createdAt: 'May 17, 4:02 PM' },
  { id: 'audit-3', actor: 'Eleanor Whitfield', action: 'Downloaded report', target: '2026 Insurance Schedule.pdf', createdAt: 'May 16, 2:18 PM' },
  { id: 'audit-4', actor: 'Leigh Mozes', action: 'Attached condition proposal', target: 'Krasner Treatment Proposal.pdf', createdAt: 'May 15, 1:37 PM' },
  { id: 'audit-5', actor: 'Tristan Bultman', action: 'Opened lender packet', target: 'Lewis Collateral Review Memo.pdf', createdAt: 'May 14, 5:19 PM' },
  { id: 'audit-6', actor: 'Leigh Mozes', action: 'Updated location', target: 'Ocean Park Drawing', createdAt: 'May 13, 9:04 AM' },
  { id: 'audit-7', actor: 'Eleanor Whitfield', action: 'Approved document release', target: 'Insurance schedule to carrier', createdAt: 'May 12, 3:22 PM' },
];
