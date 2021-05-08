<template>
    <div class="home">
        <b-button @click="signout" type="submit" class="btn" variant="danger">Signout</b-button>
        <b-button class="button btn-primary" @click="home">Home</b-button>
        <b-button class="btn" variant="info" @click="nft">NFT</b-button>
        <div style="font-size:2vw">update every 30sec %cpu blue:0-70% yellow:70-100% red>100% MineTime </div>
        <div style="font-size:2vw">MineTime -7hours(90sec refresh) if lastmine>15min bg=red /NFT(120sec refresh) </div>
        <p style="font-size:1vw">WaxBalance:<input v-model="waxBalance"> totalTML:<input v-model="tlm"> totalWaxStake:<input v-model="waxStake"></p>
        <b-button class="btn" variant="success" @click="forceup">fouce update</b-button>
        <b-table striped hover :items="items" :fields="fields">
            <template v-slot:cell(index)="row">
                <div style="font-size:25px">{{ row.index + 1 }}</div>
            </template>
            <template v-slot:cell(accname)="row">
                <div style="font-size:25px">{{ row.item.accname }}</div>
            </template>
            <template v-slot:cell(tlm)="row">
                <div style="font-size:25px">{{ row.item.tlm }}</div>
            </template>
            <template v-slot:cell(balance)="row">
                <div style="font-size:25px">{{ row.item.balance }}</div>
            </template>
            <template v-slot:cell(stake)="row">
                <div style="font-size:25px">{{ row.item.stake }}</div>
            </template>
            <template v-slot:cell(cpu)="row">
                <div style="font-size:25px">{{ row.item.cpu }}</div>
            </template>
            <template v-slot:cell(cpuusage)="row">
                <b-progress class="w-500 mb-4" height="40px"  animated show-value v-if="row.item.cpuusage >= 100">
                    <b-progress-bar :value="row.item.cpuusage" variant="danger"></b-progress-bar>
                </b-progress>
                <b-progress class="w-500 mb-4" height="40px"  animated show-value v-else-if="row.item.cpuusage >= 70">
                    <b-progress-bar :value="row.item.cpuusage" variant="warning"></b-progress-bar>
                </b-progress>
                <b-progress class="w-500 mb-4" height="40px" animated show-value v-else>
                    <b-progress-bar :value="row.item.cpuusage" variant="info"></b-progress-bar>
                </b-progress>
            </template>
            <template v-slot:cell(lastmine)="row">
                <div style="background-color:#ff3300;font-size:20px" v-if="row.item.lastmine >= 15">
                    {{ row.item.lastmine }} Minutes ago
                </div>
                <div style="background-color:#ffb84d;font-size:20px" v-else-if="row.item.lastmine >= 10">
                    {{ row.item.lastmine }} Minutes ago
                </div>
                <div style="font-size:20px" v-else-if="row.item.lastmine > 0">
                    {{ row.item.lastmine }} Minutes ago
                </div>
            </template>
            <template v-slot:cell(lasttlm)="row">
                <div style="background-color:#ff3300;font-size:25px" v-if="row.item.lasttlm >= 0.3">
                    {{ row.item.lasttlm }} TLM
                </div>
                <div style="background-color:#ff9900;font-size:25px" v-else-if="row.item.lasttlm >= 0.2">
                    {{ row.item.lasttlm }} TLM
                </div>
                <div style="background-color:#ffff66;font-size:25px" v-else-if="row.item.lasttlm >= 0.1">
                    {{ row.item.lasttlm }} TLM
                </div>
                <div style="background-color:#ffffcc;font-size:25px" v-else-if="row.item.lasttlm >= 0.0005">
                    {{ row.item.lasttlm }} TLM
                </div>
                <div style="background-color:#993333;font-size:25px" v-else-if="row.item.lasttlm > 0">
                    {{ row.item.lasttlm }} TLM
                </div>
            </template>
            <template v-slot:cell(lastNFT)="row">
                <img :src= row.item.lastNFT width="120" height="120">
            </template>
        </b-table>
        <p style="font-size:1vw">WaxBalance:<input v-model="waxBalance"> totalTML:<input v-model="tlm"> totalWaxStake:<input v-model="waxStake"></p>
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
                fields: {
                    Index: "index", accname: "accname", tlm: "tlm", balance: "balance", stake: "stake"
                    , cpu: "cpu", cpuusage: "cpuusage", lasttlm: "lasttlm", lastmine: "lastmine", lastNFT: "lastNFT"
                },
                items: [],
                waxStake: 0,
                tlm: 0,
                waxBalance:0,
                waxStaketemp: 0,
                tlmtemp: 0,
                waxBalancetemp:0,
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
            this.dbRef = firebase.database().ref('users/' + this.userid);
            this.dbRef.on('value', (snapshot) => {
                const data = snapshot.val();
                for (let i = 0; i < data.length; i++) {
                    this.items.push({ index: i + 1, accname: data[i], balance: 0, tlm: 0, stake: 0, cpu: "", cpuusage: 0, lasttlm: "", lastmine: '',lastNFT: '' })
                }
            });
            // this.getaccount();
            // this.postapi();
            // this.gettlm();
            // this.getlastminetx()
            // this.papi = setInterval(() => this.postapi(), 35000);
            // this.gtlm = setInterval(() => this.gettlm(), 35000);
            // this.glm = setInterval(() => this.getlastminetx(), 30000);
            this.pp();
            this.getacc = setInterval(() => this.pp(), 30000);
            // this.getlastnft();
            // this.gnft = setInterval(() => this.getlastnft(), 120000);

        },
        beforeDestroy() {
            clearInterval(this.papi)
            clearInterval(this.gtlm)
            clearInterval(this.glm)
            clearInterval(this.gnft)
            clearInterval(this.getacc)
        },
        computed: {
            ...mapGetters({
                user: "user"
            })
        },
        methods: {
            home() {
                this.$router.replace("/home")
            },
            nft() {
                this.$router.replace("/nft")
            },
            forceup() {
                this.postapi();
                this.gettlm();
                this.getlastminetx();
            },
            async getlastnft(){
                for (let i = 0; i < this.items.length; i++) {
                    const res = await axios.get('https://hyperion.wax.eosdetroit.io/v2/state/get_account?account='+this.items[i].accname);
                    for (let j = 0; j < res.data.actions.length; j++) {
                        if(res.data.actions[j].act.name ==="logmint"){
                            for (let k = 0; k < res.data.actions[j].act.data.immutable_template_data.length; k++) {
                                if(res.data.actions[j].act.data.immutable_template_data[k].key === "img"){
                                    this.items[i].lastNFT = "https://ipfs.atomichub.io/ipfs/" + res.data.actions[j].act.data.immutable_template_data[k].value[1];
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
            },
            async pp(){
                this.tlmtemp = 0;
                this.waxStaketemp = 0;
                this.waxBalancetemp = 0;
                for (let i = 0; i < this.items.length; i++) {
                    this.getaccount(i);
                }
            },
            async getaccount(i){
                    await axios.get('https://api.waxsweden.org/v2/state/get_account?account='+this.items[i].accname)
                    // .then(response => {
                    // })
                    // .catch(error => {
                    // this.errorMessage = error.message;
                    //  });
                    .then(response => {
                        this.items[i].balance = response.data.account.core_liquid_balance;
                        this.items[i].cpuusage = (response.data.account.cpu_limit.used / response.data.account.cpu_limit.max) * 100;
                        this.items[i].cpu = "" + response.data.account.cpu_limit.used / 1000 + "ms / "
                        + response.data.account.cpu_limit.max / 1000 + "ms ";
                        this.items[i].stake = response.data.account.self_delegated_bandwidth.cpu_weight;
                        this.items[i].tlm = response.data.tokens[1].amount;
                    
                        for (let j = 0; j < 4; j++) {
                            if(response.data.actions[j].act.name ==="transfer"){
                                // this.items[i].lastmine = response.data.actions[j].timestamp;
                                this.items[i].lastmine = Math.floor((Date.now()-Date.parse(response.data.actions[j].timestamp)-25200000)/(60000))
                                this.items[i].lasttlm = response.data.actions[j].act.data.amount;
                                break;
                            }
                            
                            this.tlmtemp += parseFloat(this.items[i].tlm);
                            this.waxStaketemp += parseFloat(this.items[i].stake.split("WAX")[0]);
                            this.waxBalancetemp += parseFloat(this.items[i].balance.split("WAX")[0]);
                            if(i == this.items.length-1){
                                this.tlm = 0;
                                this.tlm += this.tlmtemp;
                                this.waxStake = 0;
                                this.waxBalance = 0;
                                this.waxStake += this.waxStaketemp;
                                this.waxBalance += this.waxBalancetemp;
                            }
                        }
                        for (let j = 0; j < response.data.actions.length; j++) {
                        if(response.data.actions[j].act.name ==="logmint"){
                            for (let k = 0; k < response.data.actions[j].act.data.immutable_template_data.length; k++) {
                                if(response.data.actions[j].act.data.immutable_template_data[k].key === "img"){
                                    this.items[i].lastNFT = "https://ipfs.atomichub.io/ipfs/" + response.data.actions[j].act.data.immutable_template_data[k].value[1];
                                    break;
                                }
                            }
                            break;
                        }
                        }
                    })
                    .catch(error => {
                    this.errorMessage = error.message;
                    this.getaccount(i)
                     });
                
            },
            async postapi() {
                this.waxStaketemp = 0;
                this.waxBalancetemp = 0;
                for (let i = 0; i < this.items.length; i++) {
                    const res = await axios.post("https://chain.wax.io/v1/chain/get_account",
                        JSON.stringify({ "account_name": this.items[i].accname }));
                    this.items[i].balance = res.data.core_liquid_balance;
                    this.items[i].cpuusage = (res.data.cpu_limit.used / res.data.cpu_limit.max) * 100;
                    this.items[i].cpu = "" + res.data.cpu_limit.used / 1000 + "ms / "
                        + res.data.cpu_limit.max / 1000 + "ms ";
                    this.items[i].stake = res.data.self_delegated_bandwidth.cpu_weight;

                    this.waxBalancetemp += parseFloat(this.items[i].balance.split("WAX")[0]);
                    this.waxStaketemp += parseFloat(this.items[i].stake.split("WAX")[0]);
                    if(i == this.items.length-1){
                        this.waxStake = 0;
                        this.waxBalance = 0;
                        this.waxStake += this.waxStaketemp;
                        this.waxBalance += this.waxBalancetemp;
                    }
                }
            },
            async gettlm() {
                this.tlmtemp = 0;
                for (let i = 0; i < this.items.length; i++) {
                    const res = await axios.post("https://chain.wax.io/v1/chain/get_currency_balance",
                        JSON.stringify({
                            "code": "alien.worlds",
                            "account": this.items[i].accname,
                            "symbol": "TLM"
                        }));
                    this.items[i].tlm = res.data[0];
                    this.tlmtemp += parseFloat(this.items[i].tlm.split("TLM")[0]);
                    if(i == this.items.length-1){
                        this.tlm = 0;
                        this.tlm += this.tlmtemp;
                    }
                }
            },
            async getlastminetx() {
                for (let i = 0; i < this.items.length; i++) {
                    const res = await axios.post('https://wax.pink.gg/v1/chain/get_table_rows',
                        {
                            json: true,
                            code: "m.federation",
                            scope: "m.federation",
                            table: 'miners',
                            lower_bound: this.items[i].accname,
                            upper_bound: this.items[i].accname
                        });
                    this.getlastmine(res.data.rows[0].last_mine_tx, i);
                }
            },
            async getlastmine(txid, i) {
                const res = await axios.get('https://api.waxsweden.org/v2/history/get_transaction?id=' + txid);
                this.items[i].lastmine = Math.floor((Date.now()-Date.parse(res.data.actions[1].timestamp)-25200000)/(60000))
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
