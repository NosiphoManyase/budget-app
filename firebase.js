import { initializeApp, getApp, getApps } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "budget-app-388609.firebaseapp.com",
  projectId: "budget-app-388609",
  storageBucket: "budget-app-388609.appspot.com",
  messagingSenderId: "570036373151",
  appId: "1:570036373151:web:6d1529a6d33db171de04aa",
  measurementId: "G-3G70K49QY8"
}

const app = !getApps().length ? initializeApp(firebaseConfig): getApp()
const db = getFirestore()
const auth = getAuth(app)
 export {app, db, auth}