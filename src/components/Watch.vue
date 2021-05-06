<template>
  <div class="home">
    <b-button @click="signout" type="submit" class="btn" variant="danger">Signout</b-button>
    <b-button class="button btn-primary" @click="home">Home</b-button>
    <div style="font-size:2vw">update every 20sec %cpu blue:0-70% yellow:70-100% red>100%</div>
    <b-table striped hover :items="items" :fields="fields">
      <template v-slot:cell(index)="row">
        {{ row.index + 1 }}
      </template>
      <template v-slot:cell(accname)="row">
        {{ row.item.accname }}
      </template>
      <template v-slot:cell(balance)="row">
        {{ row.item.balance }}
      </template>
      <template v-slot:cell(tlm)="row">
        {{ row.item.tlm }}
      </template>
      <template v-slot:cell(cpu)="row">
        {{ row.item.cpu }}
      </template>
      <template v-slot:cell(cpuusage)="row" >
          <b-progress class="mt-2" animated show-value v-if="row.item.cpuusage >= 100">
            <b-progress-bar :value="row.item.cpuusage" variant="danger"></b-progress-bar>
         </b-progress>
         <b-progress class="mt-2" animated show-value v-else-if="row.item.cpuusage >= 70">
            <b-progress-bar :value="row.item.cpuusage" variant="warning"></b-progress-bar>
         </b-progress>
         <b-progress class="mt-2" animated show-value v-else>
            <b-progress-bar :value="row.item.cpuusage" variant="info"></b-progress-bar>
         </b-progress>
      </template>
    </b-table>
    <b-button class="button btn-primary" @click="home">Home</b-button>
  </div>
</template>
<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import axios from 'axios';
export default {
name: "Watch",
  data() {
    return {
      fields: { Index: "index",accname: "accname", balance: "balance",tlm: "tlm",cpu: "cpu",cpuusage: "cpuusage" },
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
        this.items.push({index:i+1,accname: data[i],balance:"",tlm:"",cpu:"",cpuusage:0})
      } 
    });
    this.postapi();
    this.gettlm();
    this.papi = setInterval(() => this.postapi(), 20000);
    this.gtlm = setInterval(() => this.gettlm(), 20000);
  },
  beforeDestroy() {
    clearInterval(this.papi)
    clearInterval(this.gtlm)
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
    forceup(){
        this.postapi();
        this.gettlm();
    },
    async postapi() {
      for (let i = 0; i < this.items.length; i++) {
        const res = await axios.post("https://chain.wax.io/v1/chain/get_account", 
        JSON.stringify({"account_name": this.items[i].accname}));
        this.items[i].balance = res.data.core_liquid_balance;
        // let cpuuse = (res.data.cpu_limit.used / res.data.cpu_limit.max)*100;
        this.items[i].cpuusage = (res.data.cpu_limit.used / res.data.cpu_limit.max)*100;
        this.items[i].cpu = "" + res.data.cpu_limit.used/1000 + "ms / " 
                                + res.data.cpu_limit.max/1000 + "ms " 
                                // + cpuuse + " %";
        } 
    },
    async gettlm() {
      for (let i = 0; i < this.items.length; i++) {
        const res = await axios.post("https://chain.wax.io/v1/chain/get_currency_balance", 
        JSON.stringify({
          "code": "alien.worlds",
          "account": this.items[i].accname,
          "symbol": "TLM"
        }));
        this.items[i].tlm = res.data[0];
        } 
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
