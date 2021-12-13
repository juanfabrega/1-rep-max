import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore"
import { firebaseConfig } from '../../firebaseConfig';
const firebaseApp = initializeApp(firebaseConfig); // eslint-disable-line

export const db = getFirestore();

export const getCollection = async (collectionName) => await getDocs(collection(db, collectionName));
export const createNewDoc = async (collectionName, payload) => await addDoc(collection(db, collectionName), payload);