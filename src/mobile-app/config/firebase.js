import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBv-HjKhRvBpK74Wm0DbCK6T4uhhhUM82I",
  authDomain: "appmetrix-73b41.firebaseapp.com",
  projectId: "appmetrix-73b41",
  storageBucket: "appmetrix-73b41.firebasestorage.app",
  messagingSenderId: "402279134834",
  appId: "1:402279134834:web:d8db8cf870fa301e6834eb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };