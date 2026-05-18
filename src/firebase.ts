import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, type Auth } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, serverTimestamp, type Firestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, type FirebaseStorage } from 'firebase/storage';
import type { AuditEvent, Message } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;
export let storage: FirebaseStorage | null = null;

if (firebaseEnabled) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
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
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(25));
  const snap = await getDocs(q);
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Message)
    .filter((message) => message.clientId === clientId);
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

export async function uploadClientDocument(clientId: string, file: File) {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  const path = `clients/${clientId}/${Date.now()}-${file.name}`;
  const result = await uploadBytes(ref(storage, path), file, { customMetadata: { clientId } });
  const url = await getDownloadURL(result.ref);
  if (db) {
    await addDoc(collection(db, 'documents'), {
      clientId,
      name: file.name,
      category: 'Document',
      storagePath: path,
      size: `${Math.round(file.size / 1024)} KB`,
      updatedAt: serverTimestamp(),
      downloadUrl: url,
    });
  }
  await writeAudit('Current user', 'Uploaded document', file.name);
  return { path, url };
}
