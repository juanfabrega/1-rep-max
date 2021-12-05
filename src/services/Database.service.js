import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDsGwboDdOlIQlBxRtUa7gXRVnjlYCTCow",
  authDomain: "rep-max-4b6d2.firebaseapp.com",
  projectId: "rep-max-4b6d2",
  storageBucket: "rep-max-4b6d2.appspot.com",
  messagingSenderId: "760555941502",
  appId: "1:760555941502:web:cb0a418f59d5c45e3ff22f"
};

const firebaseApp = initializeApp(firebaseConfig); // eslint-disable-line

export const db = getFirestore();

export const getCollection = async (collectionName) => await getDocs(collection(db, collectionName));
export const createNewDoc = async (collectionName, payload) => await addDoc(collection(db, collectionName), payload);