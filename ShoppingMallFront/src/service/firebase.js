
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAz0BaqrSz820XA38SF3OfJYaghrUCwoD4",
  authDomain: "project-shopping-139e9.firebaseapp.com",
  projectId: "project-shopping-139e9",
  storageBucket: "project-shopping-139e9.firebasestorage.app",
  messagingSenderId: "60769509463",
  appId: "1:60769509463:web:2700046d7669b0ffea8312",
  measurementId: "G-06S7T181J6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app
export const db = getDatabase(app)