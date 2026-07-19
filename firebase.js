/* ==========================================================
   FIREBASE IMPORTS
========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {

    getFirestore,

    collection,

    addDoc,

    getDocs,

    doc,

    setDoc,

    updateDoc,

    deleteDoc,

    query,

    orderBy,

    onSnapshot

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

/* ==========================================================
   FIREBASE CONFIGURATION
========================================================== */

const firebaseConfig = {

    apiKey: "AIzaSyDeWFcBhZwErengxFY_oJCiWNd81BrxUPs",

    authDomain: "campus-lost-found-portal.firebaseapp.com",

    projectId: "campus-lost-found-portal",

    storageBucket: "campus-lost-found-portal.firebasestorage.app",

    messagingSenderId: "161148365467",

    appId: "1:161148365467:web:56b5bebe51fc9be78b343e"

};


/* ==========================================================
   INITIALIZE FIREBASE
========================================================== */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


/* ==========================================================
   EXPORT
========================================================== */

export {

    auth,

    db,

    collection,

    addDoc,

    getDocs,

    doc,

    setDoc,

    updateDoc,

    deleteDoc,

    query,

    orderBy,

    onSnapshot

};