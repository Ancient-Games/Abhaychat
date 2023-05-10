const { initializeApp } = require("firebase/app")
const { getFirestore } = require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyCwFYJttHm1jVG1ThqYjx6Sdzz1D3hw3a8",
  authDomain: "abhay-angular.firebaseapp.com",
  projectId: "abhay-angular",
  storageBucket: "abhay-angular.appspot.com",
  messagingSenderId: "989067736338",
  appId: "1:989067736338:web:41581df0ffeb9806d0efcb"
}

const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

module.exports = {
  firestore
}
