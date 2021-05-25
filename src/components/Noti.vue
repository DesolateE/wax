<template>
  <div class="home">
    <b-button class="btn" variant="info" @click="home">Home</b-button>
    <br>
    Line token: <b-form-input v-model="linetoken" @change="save"/>
    <b-button class="btn" variant="info" @click="test">test</b-button>
  </div>

  
</template>
<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import axios from 'axios';
// import qs from 'qs';
export default {
  name: "Noti",
  data() {
    return {
      linetoken:""
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
    this.dbRef = firebase.database().ref('notiusers/'+this.userid);
    this.dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
        this.linetoken = data
      });
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    home(){
      this.$router.replace("/home")
    },
    save() {
      this.dbRef.set(this.linetoken);
    },
    async  test() {
  const result = await axios({
    method: "post",
    url: "https://notify-api.line.me/api/notify",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer pIux2yOHMXyuGI9hUBgndsQUcQvzxanbSnEAGW0xMi2",

    },
    data: 'message=你好哇'
  })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(result)
  }
  }
};
</script>
