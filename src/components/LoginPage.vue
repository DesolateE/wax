<template>
  <div id="login" class="main-box">
    <div>or Sign in with 3rd Party</div>
    <button id="google" @click="googleSignIn" class="btn-pic">
      google
    </button>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "LoginPage",
  methods: {
       googleSignIn: function(){
           let provider = new firebase.auth.GoogleAuthProvider();
        firebase
        .auth()
        .signInWithPopup(provider)
        .then((user) => {
            console.log(user) // User that was authenticated
            this.$router.replace("home");
        })
        .catch((err) => {
          alert(err.message)// This will give you all the information needed to further debug any errors
        });
       }
  }
}
</script>