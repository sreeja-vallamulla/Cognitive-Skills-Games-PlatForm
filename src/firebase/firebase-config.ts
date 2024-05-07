import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAB5C4FztrMzl-WijqOGDkNq7FodhqUA2I",
  authDomain: "cognitive-skills-games.firebaseapp.com",
  projectId: "cognitive-skills-games",
  storageBucket: "cognitive-skills-games.appspot.com",
  messagingSenderId: "930314091145",
  appId: "1:930314091145:web:5f04a070e1ba0639e9a458"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;
