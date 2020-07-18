import firebase from 'firebase/app'
import 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_STORE_API_KEY,
    authDomain: "todolist-e792f.firebaseapp.com",
    databaseURL: "https://todolist-e792f.firebaseio.com",
    projectId: "todolist-e792f",
    storageBucket: "todolist-e792f.appspot.com",
    messagingSenderId: "131864800217",
    appId: "1:131864800217:web:11a933675e7c00f31987c8",
    measurementId: "G-VQQHDVW2MM"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
  
export const db = firebase.firestore()

export default {
  db,
}
