// Fix: Importing from @firebase packages directly can resolve named export issues when the 'firebase' wrapper package resolution fails or provides outdated types.
import { initializeApp, getApp, getApps } from '@firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  setDoc, 
  getDoc, 
  enableIndexedDbPersistence,
  writeBatch
} from '@firebase/firestore';
import { InvestmentCall, UserProfile, MarketIndex, StockMover } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyBExaDxWAMin3PWTFbiigYHqWPuU5tYewg",
  authDomain: "investment-app-26c11.firebaseapp.com",
  projectId: "investment-app-26c11",
  storageBucket: "investment-app-26c11.firebasestorage.app",
  messagingSenderId: "270923331279",
  appId: "1:270923331279:web:21f81ac480f5f0bdd569ba"
};

// Singleton initialization pattern for Firebase Modular SDK
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Enable persistence for offline capability if in browser environment
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Firestore persistence failed: Multiple tabs open.");
    } else if (err.code === 'unimplemented') {
      console.warn("Firestore persistence is not supported in this browser.");
    }
  });
}

const toPlainObject = (data: any) => {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
};

export const subscribeToCalls = (callback: (calls: InvestmentCall[]) => void) => {
  try {
    const q = query(collection(db, "calls"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      const calls = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...toPlainObject(d.data()) 
      })) as InvestmentCall[];
      callback(calls);
    }, (error) => {
      console.error("Firestore subscription error:", error);
    });
  } catch (e) {
    console.error("Failed to setup calls subscription:", e);
    return () => {};
  }
};

export const subscribeToMarketMetadata = (callback: (data: any) => void) => {
  try {
    return onSnapshot(doc(db, "metadata", "market_live"), (d) => {
      if (d.exists()) {
        callback(toPlainObject(d.data()));
      }
    }, (error) => {
      console.error("Metadata subscription error:", error);
    });
  } catch (e) {
    console.error("Failed to setup metadata subscription:", e);
    return () => {};
  }
};

export const updateGlobalMarketData = async (indices: MarketIndex[], insights: string, movers?: StockMover[]) => {
  const ref = doc(db, "metadata", "market_live");
  return await setDoc(ref, {
    indices: toPlainObject(indices),
    insights,
    movers: movers ? toPlainObject(movers) : [],
    updatedAt: new Date().toISOString()
  });
};

export const addCall = async (call: Omit<InvestmentCall, 'id'>) => {
  return await addDoc(collection(db, "calls"), toPlainObject(call));
};

export const updateCallStatus = async (id: string, status: string) => {
  return await updateDoc(doc(db, "calls", id), { status });
};

/**
 * Bulk updates Current Market Prices for multiple signals
 */
export const bulkUpdateCMPs = async (updates: { id: string, cmp: number }[]) => {
  if (updates.length === 0) return;
  const batch = writeBatch(db);
  updates.forEach(u => {
    const ref = doc(db, "calls", u.id);
    batch.update(ref, { cmp: u.cmp });
  });
  return await batch.commit();
};

export const deleteCall = async (id: string) => {
  return await deleteDoc(doc(db, "calls", id));
};

export const syncUser = async (user: UserProfile): Promise<UserProfile> => {
  try {
    const userRef = doc(db, "users", user.mobile);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, toPlainObject(user));
      return user;
    }
    return toPlainObject(snap.data()) as UserProfile;
  } catch (e) {
    console.error("User sync failed", e);
    return user;
  }
};