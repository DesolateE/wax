<template>
  <div class="home">
    <b-button @click="signout" type="submit" class="btn" variant="danger">Signout</b-button>
    <b-button class="button btn-primary" @click="home">Home</b-button>
    <b-button class="btn" variant="info" @click="nft">NFT</b-button>
    <div style="font-size:2vw">update every 30sec %cpu blue:0-70% yellow:70-100% red>100% MineTime -7hours(90sec refresh) if ban bg=brown</div>
    <b-button class="btn" variant="success" @click="forceup">fouce update</b-button>
    <b-table striped hover :items="items" :fields="fields">
      <template v-slot:cell(index)="row">
        {{ row.index + 1 }}
      </template>
      <template v-slot:cell(accname)="row">
        {{ row.item.accname }}
      </template>
      <template v-slot:cell(tlm)="row">
        {{ row.item.tlm }}
      </template>
      <template v-slot:cell(balance)="row">
        {{ row.item.balance }}
      </template>
      <template v-slot:cell(stake)="row">
        {{ row.item.stake }}
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
      <template v-slot:cell(lastmine)="row">
        {{ row.item.lastmine }}
      </template>
      <template v-slot:cell(lasttlm)="row">
        <div style="background-color:#ff3300" v-if="row.item.lasttlm >= 0.3">
          {{ row.item.lasttlm }} TLM
        </div>
        <div style="background-color:#ff9900" v-else-if="row.item.lasttlm >= 0.2">
          {{ row.item.lasttlm }} TLM
        </div>
        <div style="background-color:#ffff66" v-else-if="row.item.lasttlm >= 0.1">
          {{ row.item.lasttlm }} TLM
        </div>
        <div style="background-color:#ffffcc" v-else-if="row.item.lasttlm >= 0.0005">
          {{ row.item.lasttlm }} TLM
        </div>
        <div style="background-color:#993333" v-else-if="row.item.lasttlm > 0">
          {{ row.item.lasttlm }} TLM
        </div>
      </template>
    </b-table>
    <b-button class="button btn-primary" @click="home">Home</b-button>
    <b-button class="btn" variant="info" @click="nft">NFT</b-button>
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
      fields: { Index: "index",accname: "accname",tlm: "tlm", balance: "balance",stake: "stake"
          ,cpu: "cpu",cpuusage: "cpuusage",lasttlm: "lasttlm",lastmine: "lastmine" },
      items: []
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
      for (let i = 0; i < data.length; i++) {
        this.items.push({index:i+1,accname: data[i],balance:0,tlm:0,stake:0,cpu:"",cpuusage:0,lasttlm:"",lastmine:''})
      } 
    });
    this.postapi();
    this.gettlm();
    this.getlastminetx()
    this.papi = setInterval(() => this.postapi(), 30000);
    this.gtlm = setInterval(() => this.gettlm(), 30000);
    this.glm = setInterval(() => this.getlastminetx(), 60000);
  },
  beforeDestroy() {
    clearInterval(this.papi)
    clearInterval(this.gtlm)
    clearInterval(this.glm)
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
    nft(){
      this.$router.replace("/nft")
    },
    forceup(){
        this.postapi();
        this.gettlm();
        this.glm();
    },
    async postapi() {
      // let totalwax = 0;
      for (let i = 0; i < this.items.length; i++) {
        const res = await axios.post("https://chain.wax.io/v1/chain/get_account", 
        JSON.stringify({"account_name": this.items[i].accname}));
        this.items[i].balance = res.data.core_liquid_balance;
        this.items[i].cpuusage = (res.data.cpu_limit.used / res.data.cpu_limit.max)*100;
        this.items[i].cpu = "" + res.data.cpu_limit.used/1000 + "ms / " 
                                + res.data.cpu_limit.max/1000 + "ms " ;
        this.items[i].stake = res.data.self_delegated_bandwidth.cpu_weight;
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
    async getlastminetx() {
      for (let i = 0; i < this.items.length; i++) {
        const res = await axios.post('https://wax.pink.gg/v1/chain/get_table_rows', 
                {json: true,
                code: "m.federation",
                scope: "m.federation",
                table: 'miners',
                lower_bound: this.items[i].accname,
                upper_bound: this.items[i].accname});
        this.getlastmine(res.data.rows[0].last_mine_tx,i);
      }
    },
    async getlastmine(txid,i) {
      const res = await axios.get('https://api.waxsweden.org/v2/history/get_transaction?id='+txid);
      this.items[i].lastmine = res.data.actions[1].timestamp.split("T")[1];
      this.items[i].lasttlm = res.data.actions[1].act.data.amount;
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
