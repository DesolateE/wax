<template>
  <div class="home">
    <button @click="signout" type="submit" class="btn">Signout</button>
    <button @click="check" type="submit" class="btn">check</button>
    <h1>{{account_name}}</h1>
    <h1>{{core_liquid_balance}}</h1>
  </div>

  
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import axios from 'axios';
export default {
  name: "Home",
  data() {
    return {
      account_name: '',
      core_liquid_balance: '',
    };
  },
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
    async check() {
      
      const res = await axios.post("https://chain.wax.io/v1/chain/get_account", 
      JSON.stringify({"account_name": "b5kc.wam"}));
      console.log(res.data)

      this.account_name = res.data.account_name
      this.core_liquid_balance = res.data.core_liquid_balance
      // .account_name
      //.cpu_limit.used
      //.cpu_limit.available
      //.cpu_limit.max
      // .core_liquid_balance
      // .self_delegated_bandwidth.cpu_weight
      // this.dbRef.set({
      //   a: "aaa"
      // })
      // console.log("check");
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
