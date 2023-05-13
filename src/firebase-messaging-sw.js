importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: "AIzaSyCwFYJttHm1jVG1ThqYjx6Sdzz1D3hw3a8",
  authDomain: "abhay-angular.firebaseapp.com",
  projectId: "abhay-angular",
  storageBucket: "abhay-angular.appspot.com",
  messagingSenderId: "989067736338",
  appId: "1:989067736338:web:41581df0ffeb9806d0efcb"
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function(payload) {
 
 const notificationTitle = payload.data.title
 const notificationOptions = {
  ...payload.data,
 }

 self.registration.showNotification(notificationTitle,
    notificationOptions)
})

self.addEventListener("notificationclick", (e) => {
 
}, false)

