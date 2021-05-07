<template>
  <div class="home">
    <b-button @click="signout" type="submit" class="btn" variant="danger">Signout</b-button>
    <b-button class="button btn-primary" @click="home">Home</b-button>
    <b-button class="btn" variant="primary" @click="watch">Watch</b-button>
    <b-table striped hover :items="items" :fields="fields">
      <template v-slot:cell(index)="row">
        {{ row.index + 1 }}
      </template>
      <template v-slot:cell(accname)="row">
        {{ row.item.accname }}
      </template>
      <!-- <template  v-slot:cell(img)="row">
        <b-table striped hover :items="row.item.img">
        <img src= row.item.img >
        </b-table>
      </template> -->
    </b-table>
    <b-button class="button btn-primary" @click="test2">test</b-button>
    <b-button class="button btn-primary" @click="home">Home</b-button>
    <b-button class="btn" variant="primary" @click="watch">Watch</b-button>
  </div>
</template>
<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
// import axios from 'axios';
export default {
name: "Nft",
  data() {
    return {
      fields: { Index: "index",accname: "accname",img: "img"},
      // items: [{index:1,accname: "31wbc.wam",img:["https://resizer.atomichub.io/images/v1/preview?QmRpVKMkvuaSDGhkKfGLGJ4ZNAPXSE7vf7YrLErrP12dkB&size=370",
      // "https://resizer.atomichub.io/images/v1/preview?Qmat8TPicX9b4rr3m3KEbCXvXHQYU1DDjSfmjEbcw6xCk7&size=370",
      // "https://resizer.atomichub.io/images/v1/preview?QmRbZ68ueFgpdbmJsRUTBSGiNK9cuHVKkjRPww9xSG8vqQ&size=370"]}],
      items: [],
      imgdata:[]
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
    // this.userid = firebase.auth().currentUser.uid;
    // this.dbRef = firebase.database().ref('users/'+this.userid);
    // this.dbRef2 = firebase.database().ref('imgdata/');
    // this.dbRef.on('value', (snapshot) => {
    //   const data = snapshot.val();
    //   for (let i = 0; i < data.length; i++) {
    //     this.items.push({index:i+1,accname: data[i],img:''})
    //   } 
    // });
    // this.dbRef2.on('value', (snapshot) => {
    //   const data = snapshot.val();
    //   for (let i = 0; i < data.length; i++) {
    //     this.imgdata.push({template: data[i].template,img: data[i].img})
    //   } 
    // });
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
    watch(){
      this.$router.replace("/watch")
    },
    test(){
    },
    signout() {
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
