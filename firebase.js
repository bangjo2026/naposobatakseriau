const firebaseConfig = {
  apiKey: "AIzaSyCTI-8OnpN-hw6m8ibXI_n5JPe1i9plbuY",
  authDomain: "naposo-batak-riau.firebaseapp.com",
  projectId: "naposo-batak-riau",
  storageBucket: "naposo-batak-riau.firebasestorage.app",
  messagingSenderId: "370499037826",
  appId: "1:370499037826:web:880cf4c6754c31471a229b"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();