<template>
  <div id="login" class="main-box">
    <div style="font-size:5vw">Sign Up and Login with google</div>
    <button id="google" @click="googleSignIn" class="btn-pic">
      <img src="../assets/google-logo.png" alt width="500px" height="500px">
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
            console.log(user.name)
            this.$router.replace("home");
        })
        .catch((err) => {
          alert(err.message)// This will give you all the information needed to further debug any errors
        });
       }
  }
}
</script>