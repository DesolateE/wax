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
      // let group = Math.ceil(this.items.length/3)
      // for(let i=0;i<group;i++){
      //   for (let j = 3*i; j < 3*(i+1); j++) {
      //     if(j < this.items.length)
      //       this.getacctemplate(j)
      //   }
      //   await this.delay(2000)
      // }
      for (let i = 0; i < this.items.length; i++) {
            this.getacctemplate(i)
        }
    },
    async getacctemplate(index){
        await axios.get("https://api.wax-aa.bountyblok.io/atomicassets/v1/accounts/"+this.items[index].accname)
        .then(response => {
          for(let j =0; j < response.data.data.templates.length; j++){
            if(j%5==0){
              this.searchtemplate(response.data.data.templates[j].template_id,index,response.data.data.templates[j].assets,"https://atomic.3dkrender.com/atomicassets/v1/templates/alien.worlds/");
            }else if(j%5==1){
              this.searchtemplate(response.data.data.templates[j].template_id,index,response.data.data.templates[j].assets,"https://wax-aa.eu.eosamsterdam.net/atomicassets/v1/templates/alien.worlds/");
            }else if(j%5==2){
              this.searchtemplate(response.data.data.templates[j].template_id,index,response.data.data.templates[j].assets,"https://api.wax-aa.bountyblok.io/atomicassets/v1/templates/alien.worlds/");
            }else if(j%5==3){
              this.searchtemplate(response.data.data.templates[j].template_id,index,response.data.data.templates[j].assets,"https://wax-atomic-api.eosphere.io/atomicassets/v1/templates/alien.worlds/");
            }else{
              this.searchtemplate(response.data.data.templates[j].template_id,index,response.data.data.templates[j].assets,"https://wax.api.atomicassets.io/atomicassets/v1/templates/alien.worlds/");
            }
          // this.searchtemplate(response.data.data.templates[j].template_id,index,response.data.data.templates[j].assets);
          }
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.getacctemplate(index);
        });
      
    },
    async searchtemplate(temid,i,assetsamount,url){
      await axios.get(url+temid)
        .then(response => {
          for(let j=0; j<assetsamount; j++){
            this.items[i].img.push("https://ipfs.io/ipfs/"+response.data.data.immutable_data.img);
          }
        })
        .catch(error => {
          this.errorMessage = error.message;
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
