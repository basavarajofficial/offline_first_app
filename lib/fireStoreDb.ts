// Firebase configuration

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// In a real scenario, these should be stored in environment variables
const firebaseConfig = {
    apiKey: "AIzaSyADGOkHCYWaHFh4TQ4Dbg4YiytDVkFzpAs",
    authDomain: "offlinefirstcrud.firebaseapp.com",
    projectId: "offlinefirstcrud",
    storageBucket: "offlinefirstcrud.firebasestorage.app",
    messagingSenderId: "221744709348",
    appId: "1:221744709348:web:da9d0ebeb53838a87f36f1",
  }

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  export const firestoreDb = getFirestore(firebaseApp);
