import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase/app'
import 'firebase/database'
import router from './router'
import store from "./store";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config  = {
  apiKey: "AIzaSyAfcE5BHcvujbNjOgEcAWfHWj3_feCSLBI",
  authDomain: "waxinfo-5f1dc.firebaseapp.com",
  projectId: "waxinfo-5f1dc",
  storageBucket: "waxinfo-5f1dc.appspot.com",
  messagingSenderId: "677914278646",
  appId: "1:677914278646:web:d9f54bfa3f740021ee4ad7",
  measurementId: "G-1TE0J02V2R",
  databaseURL: 'https://waxinfo-5f1dc-default-rtdb.firebaseio.com/'
};
firebase.initializeApp(config)

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
