import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Policy } from '../types';

const policiesCol = (uid: string) => collection(db, 'users', uid, 'policies');

export async function loadPolicies(uid: string): Promise<Policy[]> {
  const snap = await getDocs(policiesCol(uid));
  return snap.docs.map(d => d.data() as Policy);
}

export async function savePolicy(uid: string, policy: Policy): Promise<void> {
  const { pdfUrl, ...rest } = policy; // don't store blob URL in Firestore
  await setDoc(doc(policiesCol(uid), policy.id), rest);
}

export async function deletePolicy(uid: string, policyId: string): Promise<void> {
  await deleteDoc(doc(policiesCol(uid), policyId));
}
