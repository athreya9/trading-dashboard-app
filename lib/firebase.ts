import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhaDubrIcII4MWuzILTXSvGR-MOCyxNLg",
  authDomain: "my-trading-platform-sheets.firebaseapp.com",
  projectId: "my-trading-platform-sheets",
  storageBucket: "my-trading-platform-sheets.firebasestorage.app",
  messagingSenderId: "390383470275",
  appId: "1:390383470275:web:4e03d75d839daa5daa4476"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
