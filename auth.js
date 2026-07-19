/* ==========================================================
   FIREBASE IMPORTS
========================================================== */

import { auth, db } from "./firebase.js";

import {

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    updateProfile,

    sendPasswordResetEmail

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {

    doc,

    setDoc,

    getDoc

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";




/* ==========================================================
   REGISTER FUNCTIONALITY
========================================================== */

const registerForm = document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener("submit", async function(event){

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();

        const email = document.getElementById("registerEmail").value.trim();

        const phone = document.getElementById("registerPhone").value.trim();

        const password = document.getElementById("registerPassword").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        if(password !== confirmPassword){

            alert("Passwords do not match!");

            return;

        }

        try{

            /* ==================================================
               CREATE FIREBASE ACCOUNT
            =================================================== */

            const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            /* ==================================================
               UPDATE USER NAME
            =================================================== */

            await updateProfile(
                userCredential.user,
                {
                    displayName: name
                }
            );

            /* ==================================================
               SAVE USER DETAILS IN FIRESTORE
            =================================================== */

            await setDoc(

                doc(db, "users", userCredential.user.uid),

                {

                    uid: userCredential.user.uid,

                    name: name,

                    email: email,

                    phone: phone

                }

            );

            alert("Registration Successful!");

            window.location.href = "login.html";

        }

       catch(error){

    console.error(error);

    alert(error.message);

}

    });

}
/* ==========================================================
   LOGIN FUNCTIONALITY
========================================================== */

const loginForm = document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit", async function(event){

        event.preventDefault();

        const email =
        document.getElementById("loginEmail").value.trim();

        const password =
        document.getElementById("loginPassword").value;

        try{

            /* ==================================================
               FIREBASE LOGIN
            =================================================== */

            const userCredential =
            await signInWithEmailAndPassword(

                auth,

                email,

                password

            );

            /* ==================================================
               GET USER DATA FROM FIRESTORE
            =================================================== */

            const docRef = doc(

                db,

                "users",

                userCredential.user.uid

            );

            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){

                localStorage.setItem(

                    "currentUser",

                    JSON.stringify(docSnap.data())

                );

            }

            alert("Login Successful!");

            window.location.href = "dashboard.html";

        }

        catch(error){

            console.error(error);

            alert(error.message);

        }

    });

}

/* ==========================================================
   FORGOT PASSWORD
========================================================== */

const forgotPasswordForm =
document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const email =
        document.getElementById("resetEmail").value;

        try {

            await sendPasswordResetEmail(auth, email);

            alert(
                "✅ Password reset link has been sent to your email."
            );

            window.location.href = "login.html";

        }

        catch(error) {

            console.error(error);

            alert(
                "❌ Failed to send reset email. Please check your email address."
            );

        }

    });

}