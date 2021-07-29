console.log(
  "js/firebase.js : Remember to replace the instructor's firebase keys with yours!"
);

// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
  apiKey: "AIzaSyBWLqWBENBE0dDR3zmml6QvCzDD_2kMhoI",
  authDomain: "cssiday12.firebaseapp.com",
  databaseURL: "https://cssiday12-default-rtdb.firebaseio.com",
  projectId: "cssiday12",
  storageBucket: "cssiday12.appspot.com",
  messagingSenderId: "296526094438",
  appId: "1:296526094438:web:b53e22c3079608b7684da7"
};
// END TODO

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
