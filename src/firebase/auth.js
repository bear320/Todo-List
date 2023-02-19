import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDUsz3Bk2fejDwoxiAd9U7uLP_349BCE6c",
    authDomain: "todolist-2395c.firebaseapp.com",
    databaseURL: "https://todolist-2395c-default-rtdb.firebaseio.com",
    projectId: "todolist-2395c",
    storageBucket: "todolist-2395c.appspot.com",
    messagingSenderId: "860096240753",
    appId: "1:860096240753:web:4b10b51bb174ad2c090fd0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
