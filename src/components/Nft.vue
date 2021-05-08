<template>
  <div class="home">
    <b-button @click="signout" type="submit" class="btn" variant="danger">Signout</b-button>
    <b-button class="button btn-primary" @click="home">Home</b-button>
    <b-button class="btn" variant="primary" @click="watch">Watch</b-button>
    <b-table striped hover :items="items" :fields="fields">
      <template v-slot:cell(index)="row">
        <div style="font-size:40px">{{ row.index + 1 }}</div>
      </template>
      <template v-slot:cell(accname)="row">
        <div style="font-size:40px">{{ row.item.accname }}</div>
      </template>
      <template  v-slot:cell(img)="row">
        <div class="container">
          <div class="row">
          <div class="col" v-for="(img,index) in row.item.img" v-bind:key=index>
            <img :src= img width="120" height="150" >
          </div>
        </div>
      </div>
      </template>
    </b-table>
    <b-button class="button btn-primary" @click="home">Home</b-button>
    <b-button class="btn" variant="primary" @click="watch">Watch</b-button>
  </div>
</template>
<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import axios from 'axios';
export default {
name: "Nft",
  data() {
    return {
      fields: { Index: "index",accname: "accname",img: "img"},
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
    this.userid = firebase.auth().currentUser.uid;
    this.dbRef = firebase.database().ref('users/'+this.userid);
    this.dbRef2 = firebase.database().ref('imgdata/');
    this.dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      for (let i = 0; i < data.length; i++) {
        this.items.push({index:i+1,accname: data[i],img:[]})
      } 
    });
    this.fetchdata();
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
    async fetchdata(){
      let group = Math.ceil(this.items.length/4)
      for(let i=0;i<group;i++){
        for (let j = 3*i; j < 3*(i+1); j++) {
          // console.log(j)
          if(j < this.items.length)
            this.getacctemplate(j)
        }
        await this.delay(5000)
      }
    },
    async getacctemplate(index){
        await axios.get("https://wax.api.atomicassets.io/atomicassets/v1/accounts/"+this.items[index].accname)
        .then(response => {
          for(let j =0; j < response.data.data.templates.length; j++){
          this.searchtemplate(response.data.data.templates[j].template_id,index,response.data.data.templates[j].assets);
          }
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.delay(2000)
          this.getacctemplate(index);
        });
        // const res = await axios.get('https://wax.api.atomicassets.io/atomicassets/v1/accounts/'+this.items[i].accname);
        // for(let j =0; j < res.data.data.templates.length; j++){
        //   this.searchtemplate(res.data.data.templates[j].template_id,i,res.data.data.templates[j].assets);
        // }
        // console.log(res.data.data)
      
    },
    async searchtemplate(temid,i,assetsamount){
      await axios.get('https://wax.api.atomicassets.io/atomicassets/v1/templates/alien.worlds/'+temid)
        .then(response => {
          for(let j=0; j<assetsamount; j++){
            this.items[i].img.push("https://ipfs.atomichub.io/ipfs/"+response.data.data.immutable_data.img);
          }
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.delay(2000)
          this.searchtemplate(temid,i,assetsamount)
        });
      // const res = await axios.get('https://wax.api.atomicassets.io/atomicassets/v1/templates/alien.worlds/'+temid);
      // for(let j=0; j<assetsamount; j++){
      //   this.items[i].img.push("https://ipfs.atomichub.io/ipfs/"+res.data.data.immutable_data.img);
      // }
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
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
