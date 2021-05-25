<template>
  <div class="home">
    <b-button @click="signout" type="submit" class="btn" variant="danger">Signout</b-button>
    <b-button class="btn" variant="primary" @click="watch">Watch</b-button>
    <b-button class="btn" variant="info" @click="nft">NFT</b-button>
    <!-- <b-button class="btn" variant="danger" @click="noti">NOTI</b-button> -->
  <!-- <button @click="removeRow(row)">Remove</button>
  <button class="button btn-primary" @click="addRow">Add row</button> -->
    <b-table striped hover :items="items" :fields="fields">
      <template v-slot:cell(index)="row">
        {{ row.index + 1 }}
      </template>
      <template v-slot:cell(accname)="row">
        <b-form-input v-model="row.item.accname" @change="save"/>
      </template>
    </b-table>
    <b-button class="button btn-primary" @click="addRow">Add row</b-button>
    <b-button class="btn" variant="primary" @click="watch">Watch</b-button>
    <b-button class="btn" variant="info" @click="nft">NFT</b-button>
    <br>
    <b-button class="button btn-danger" @click="removeRow">Remove lastRow</b-button>
  </div>

  
</template>
<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
// import axios from 'axios';
export default {
  name: "Home",
  data() {
    return {
      fields: { Index: "index",accname: "accname"},
      items: [
      ]
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
    this.dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      this.items = [];
      for (let i = 0; i < data.length; i++) {
        this.items.push({index:i+1,accname: data[i]})
      } 
      });
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    watch(){
      this.$router.replace("/watch")
    },
    noti(){
      this.$router.replace("/noti")
    },
    nft(){
      this.$router.replace("/nft")
    },
    addRow(){
      this.items.push({ index:this.items.length+1,accname: ""});
    },
    removeRow(){
      this.items.pop(this.items[this.items.length-1]);
      this.save();
    },
    save() {
      let arr = [];
      for (let i = 0; i < this.items.length; i++) {
          arr.push(this.items[i].accname);
      }
      this.dbRef.set(arr);
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
