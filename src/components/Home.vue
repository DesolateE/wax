<template>
  <div class="home">
    <b-button @click="signout" type="submit" class="btn" variant="danger">Signout</b-button>
  <!-- <button @click="removeRow(row)">Remove</button>
  <button class="button btn-primary" @click="addRow">Add row</button> -->
    <b-table striped hover :items="items" :fields="fields">
      <template v-slot:cell(index)="row">
        {{ row.index + 1 }}
      </template>
      <template v-slot:cell(accname)="row">
        <b-form-input v-model="row.item.accname"/>
      </template>
      <template v-slot:cell(balance)="row">
        {{ row.item.balance }}
      </template>
      <template v-slot:cell(cpu)="row">
        {{ row.item.cpu }}
      </template>
    </b-table>
    <b-button class="button btn-primary" @click="addRow">Add row</b-button>
    <b-button @click="saveandpost" class="btn" variant="primary">SaveAndGetCPU</b-button>
    <b-button class="button btn-primary" @click="aa">AAAAA</b-button>
  </div>
</template>
<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
// import axios from 'axios';
export default {

  data() {
    return {
      fields: { Index: "index",accname: "accname", balance: "balance",Cpu: "cpu" },
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
    
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
     aa () {
      this.dbRef('value', (snapshot) => {
      const data = snapshot.val();
      for (let i = 0; i < data.length; i++) {
        console.log(data[i])
        this.items.push({index:i+1,accname: data[i], balance: 0,cpu: ""})
      } 
      });
    },
    addRow(){
      this.items.push({ index:this.items.length+1,accname: "", balance: 0 ,cpu: ""});
      console.log(this.items)
    },
    removeRow: function(item){
      console.log(item);
      this.items.pop(item);
    },
    saveandpost() {
      let arr = [];
      for (let i = 0; i < this.items.length; i++) {
        arr.push(this.items[i].accname);
      }
      console.log(this.items)
      this.dbRef.set(arr);

      // for (let i = 0; i < arr.length; i++) {
      //   const res = await axios.post("https://chain.wax.io/v1/chain/get_account", 
      //   JSON.stringify({"account_name": arr[i]}));
      //   console.log(i);
      //   console.log(res);
      //   arr.push(this.items[i].accname);
      // } 
      // const res = await axios.post("https://chain.wax.io/v1/chain/get_account", 
      // JSON.stringify({"account_name": "b5kc.wam"}));
      // console.log(res.data)
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
