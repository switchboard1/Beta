import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsqJbQewrz6wafFpqufEzD6Nsian-1XBE",
  authDomain: "beerlist-648f2.firebaseapp.com",
  databaseURL: "https://beerlist-648f2.firebaseio.com",
  projectId: "beerlist-648f2",
  storageBucket: "beerlist-648f2.appspot.com",
  messagingSenderId: "751909380288",
  appId: "1:751909380288:web:1bafc9639bbc51f65f8d25",
  measurementId: "G-K03S55HGQV"
};

let app = null;

if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
