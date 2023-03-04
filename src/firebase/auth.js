import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.VUE_FIREBASE_apiKey,
    authDomain: "todolist-2395c.firebaseapp.com",
    databaseURL: "https://todolist-2395c-default-rtdb.firebaseio.com",
    projectId: "todolist-2395c",
    storageBucket: "todolist-2395c.appspot.com",
    messagingSenderId: process.env.VUE_FIREBASE_messagingSenderId,
    appId: process.env.VUE_FIREBASE_appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
