<template>
  <div class="home">
    <button @click="signout" type="submit" class="btn">Signout</button>
    <button @click="check" type="submit" class="btn">check</button>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          this.$router.replace("/")
        }
    });
  },
  created() {
    this.userid = firebase.auth().currentUser.uid;
    this.dbRef = firebase.database().ref('users/'+this.userid);
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    check() {
      // this.dbRef.set({
      //   a: "aaa"
      // })
      // console.log("check");

    // const requestOptions = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body:JSON.stringify({"account_name": "b5kc.wam"})
    // };
    // fetch("https://chain.wax.io/v1/chain/get_account", requestOptions)
    //   .then(response => console.log(response))
    }
    ,signout() {
       firebase
       .auth()
       .signOut()
       .then(() => {
         this.$router.replace("/");
       });
    }
  }
};
</script>
