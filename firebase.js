import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ================= FIREBASE CONFIG =================

const firebaseConfig = {

    apiKey:
    "AIzaSyBdDY1me5pZa4bUc2Dz95qfk1neKK1UmDQ",

    authDomain:
    "recipe-app-e485f.firebaseapp.com",

    projectId:
    "recipe-app-e485f",

    storageBucket:
    "recipe-app-e485f.appspot.com",

    messagingSenderId:
    "187926906213",

    appId:
    "1:187926906213:web:5f8c8806a105d3d2ffcd8c"
};


// ================= INITIALIZE FIREBASE =================

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

const provider =
new GoogleAuthProvider();


// ================= GOOGLE LOGIN =================

async function googleLogin(){

    try{

        const result =

        await signInWithPopup(
            auth,
            provider
        );

        const user =
        result.user;

        localStorage.setItem(

            "recipeUser",

            JSON.stringify({

                name:
                user.displayName,

                email:
                user.email,

                photo:
                user.photoURL
            })
        );

        alert(
            `Welcome ${user.displayName}`
        );

        location.reload();

    }catch(error){

        console.log(error);

        alert(
            "Login failed"
        );
    }
}


// ================= LOGOUT =================

async function logoutUser(){

    try{

        await signOut(auth);

        localStorage.removeItem(
            "recipeUser"
        );

        alert(
            "Logged Out Successfully"
        );

        location.reload();

    }catch(error){

        console.log(error);

        alert(
            "Logout failed"
        );
    }
}


// ================= AUTH STATE =================

onAuthStateChanged(
auth,
(user) => {

    if(user){

        localStorage.setItem(

            "recipeUser",

            JSON.stringify({

                name:
                user.displayName,

                email:
                user.email,

                photo:
                user.photoURL
            })
        );

    }
});


// ================= EXPORT =================

export {

    googleLogin,
    logoutUser
};