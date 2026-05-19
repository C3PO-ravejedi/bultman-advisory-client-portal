import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, type Auth } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, serverTimestamp, where, type Firestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, type FirebaseStorage } from 'firebase/storage';
import type { AuditEvent, Message } from './types';

export const MAX_CLIENT_DOCUMENT_BYTES = 25 * 1024 * 1024;
export const ALLOWED_CLIENT_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

const app: FirebaseApp | null = firebaseEnabled ? initializeApp(firebaseConfig) : null;
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;

export function sanitizeStorageFileName(name: string) {
  const cleaned = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+/, '')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return cleaned || 'client-document';
}

export function validateClientDocumentFile(file: File) {
  if (file.size > MAX_CLIENT_DOCUMENT_BYTES) return 'Document must be 25 MB or smaller.';
  if (!ALLOWED_CLIENT_DOCUMENT_TYPES.includes(file.type)) return 'Upload a PDF, image, text, Word, or DOCX file.';
  return '';
}

export async function firebaseEmailLogin(email: string, password: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  return signInWithEmailAndPassword(auth, email, password);
}

export async function firebaseGoogleLogin() {
  if (!auth) throw new Error('Firebase is not configured.');
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export async function firebaseLogout() {
  if (!auth) return;
  await signOut(auth);
}

export async function fetchMessages(clientId: string): Promise<Message[]> {
  if (!db) return [];
  const q = query(collection(db, 'messages'), where('clientId', '==', clientId), orderBy('createdAt', 'desc'), limit(25));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Message);
}

export async function sendMessage(clientId: string, from: string, role: string, body: string) {
  if (!db) throw new Error('Firebase is not configured.');
  await addDoc(collection(db, 'messages'), { clientId, from, role, body, createdAt: serverTimestamp() });
  await writeAudit(from, 'Sent message', `Client ${clientId}`);
}

export async function writeAudit(actor: string, action: string, target: string) {
  if (!db) return;
  await addDoc(collection(db, 'auditEvents'), { actor, action, target, createdAt: serverTimestamp() });
}

export async function fetchAuditEvents(): Promise<AuditEvent[]> {
  if (!db) return [];
  const q = query(collection(db, 'auditEvents'), orderBy('createdAt', 'desc'), limit(25));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as AuditEvent);
}

export async function uploadClientDocument(clientId: string, file: File, actor = 'Current user') {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  const validationError = validateClientDocumentFile(file);
  if (validationError) throw new Error(validationError);
  const safeName = sanitizeStorageFileName(file.name);
  const path = `clients/${clientId}/${Date.now()}-${safeName}`;
  const result = await uploadBytes(ref(storage, path), file, { contentType: file.type, customMetadata: { clientId } });
  const url = await getDownloadURL(result.ref);
  if (db) {
    await addDoc(collection(db, 'documents'), {
      clientId,
      name: safeName,
      category: 'Document',
      storagePath: path,
      size: `${Math.round(file.size / 1024)} KB`,
      updatedAt: serverTimestamp(),
      downloadUrl: url,
    });
  }
  await writeAudit(actor, 'Uploaded document', safeName);
  return { path, url };
}
