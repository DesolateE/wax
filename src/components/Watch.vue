<template>
    <div class="home">
        <b-button @click="signout" type="submit" class="btn" variant="danger">Signout</b-button>
        <b-button class="button btn-primary" @click="home">Home</b-button>
        <b-button class="btn" variant="info" @click="nft">NFT</b-button>
        <!-- <div style="font-size:1vw">update every 30sec %cpu blue:0-80% yellow:80-100% red>100% MineTime </div> -->
        <p style="font-size:0.8vw">Alcor TLM/WAX: <input v-model="alcortlmwax"> ------ Real TLM/WAX: <input v-model="tlmwax"> ------ Rate_Difference: <input v-model="diff"></p>
        <p style="font-size:1.2vw">CurrentRate WAX/USDT: <input v-model="waxrate"> USDT</p>
        <p style="font-size:1.2vw">CurrentRate TLM/USDT: <input v-model="tlmrate"> USDT</p>
        <p style="font-size:1.2vw">TotalWaxBalance: <input v-model="waxBalance"> WAX = ${{waxus}} / ฿{{waxth}}</p>
        <p style="font-size:1.2vw">TotalWaxStake: <input v-model="waxStake"> WAX = ${{swaxus}} / ฿{{swaxth}}</p>
        <p style="font-size:1.2vw">TotalTLM: <input v-model="tlm"> TLM = ${{tlmus}} / ฿{{tlmth}} (฿*32.5)</p>
        <b-button class="btn" variant="success" @click="forceup">fouce update</b-button>
        <b-button class="button btn-primary" @click="home">Home</b-button>
        <b-button class="btn" variant="info" @click="nft">NFT</b-button>
        <!-- <b-button class="btn" variant="info" @click="tt">tt</b-button> -->
        <!-- <b-button class="btn" variant="primary" @click="gettotal">Get_total (click when all data load)</b-button> -->
        <!-- <b-button class="btn" variant="primary" @click="getprice">Get_Currentprice</b-button> -->
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
                <b-progress class="w-500 mb-4" height="40px"  animated show-value v-else-if="row.item.cpuusage >= 80">
                    <b-progress-bar :value="row.item.cpuusage" variant="warning"></b-progress-bar>
                </b-progress>
                <b-progress class="w-500 mb-4" height="40px" animated show-value v-else>
                    <b-progress-bar :value="row.item.cpuusage" variant="info"></b-progress-bar>
                </b-progress>
            </template>
            <template v-slot:cell(lastmine)="row">
                <div style="background-color:#ff3300;font-size:25px" v-if="row.item.lastmine >= 15">
                    {{ row.item.lastmine }} Minutes ago
                </div>
                <div style="background-color:#ffb84d;font-size:25px" v-else-if="row.item.lastmine >= 10">
                    {{ row.item.lastmine }} Minutes ago
                </div>
                <div style="font-size:25px" v-else>
                    {{ row.item.lastmine }} Minutes ago
                </div>
                <!-- {{ row.item.lastmine }} -->
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
                <div style="background-color:#ffffcc;font-size:25px" v-else-if="row.item.lasttlm >= 0.025">
                    {{ row.item.lasttlm }} TLM
                </div>
                <div style="font-size:25px" v-else-if="row.item.lasttlm >= 0.0005">
                    {{ row.item.lasttlm }} TLM
                </div>
                <div style="background-color:#993333;font-size:25px" v-else-if="row.item.lasttlm > 0">
                    {{ row.item.lasttlm }} TLM
                </div>
            </template>
            <template v-slot:cell(lastNFT)="row">
                <img :src= row.item.lastNFT width="120" height="120">
            </template>
            <template v-slot:cell(timeupdate)="row">
                <div style="font-size:25px">
                {{row.item.timeupdate}}
                </div>
            </template>
            <template v-slot:cell(baglock)="row">
                <div style="font-size:20px">
                {{row.item.baglock}}
                </div>
            </template>
            <template  v-slot:cell(bagitem)="row">
                <!-- {{row.item.bagitem}} -->
                <div class="container">
                    <div class="row" v-for="(bagitem,index) in row.item.bagitem" v-bind:key=index>
                        {{bagitem}}
                    </div>
                    <!-- <div class="row">
                        <div class="col" v-for="(img,index) in row.item.img" v-bind:key=index>
                        <img :src= img width="120" height="150" >
                        </div>
                    </div> -->
                </div>
             </template>
        </b-table>
        <!-- <p style="font-size:1vw">WaxBalance:<input v-model="waxBalance"> totalTML:<input v-model="tlm"> totalWaxStake:<input v-model="waxStake"></p> -->
        <b-button class="btn" variant="success" @click="forceup">fouce update</b-button>
        <b-button class="button btn-primary" @click="home">Home</b-button>
        <b-button class="btn" variant="info" @click="nft">NFT</b-button>
        <p style="font-size:0.8vw">Alcor TLM/WAX: <input v-model="alcortlmwax"> ------ Real TLM/WAX: <input v-model="tlmwax"> ------ Rate_Difference: <input v-model="diff"></p>
        <p style="font-size:1vw">CurrentRate WAX/USDT: <input v-model="waxrate"> USDT</p>
        <p style="font-size:1vw">CurrentRate TLM/USDT: <input v-model="tlmrate"> USDT</p>
        <p style="font-size:1vw">TotalWaxBalance: <input v-model="waxBalance"> WAX = ${{waxus}} / ฿{{waxth}}</p>
        <p style="font-size:1vw">TotalWaxStake: <input v-model="waxStake"> WAX = ${{swaxus}} / ฿{{swaxth}}</p>
        <p style="font-size:1vw">TotalTLM: <input v-model="tlm"> TLM = ${{tlmus}} / ฿{{tlmth}} (฿*32.5)</p>
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
                    ,timeupdate:"timeupdate",bagitem:"bagitem",baglock:"baglock"
                },
                items: [],
                waxStake: 0,
                tlm: 0,
                waxBalance:0,
                waxrate:0,
                tlmrate:0,
                waxus:0,
                waxth:0,
                swaxus:0,
                swaxth:0,
                tlmus:0,
                tlmth:0,
                tlmwax:0,
                alcortlmwax:0,
                diff:0,
                bagid: [],
                bagitem: [],
                firsttime: true
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
                    this.items.push({ index: i + 1, accname: data[i], balance: 0, tlm: 0, stake: 0, cpu: "", cpuusage: 0, lasttlm: ""
                    , lastmine: '',lastNFT: '',timeupdate:'',baglock:'',bagitem:[]})
                    this.bagid.push([]);
                    for(let j=0;j<3;j++){
                        this.items[i].bagitem.push("")
                    }
                }
            });
            
            this.pp();
            this.getall = setInterval(() => this.pp(), 30000);
            this.getprice();
            this.price = setInterval(() => this.getprice(), 29000);
            this.bag();
            this.ba = setInterval(() => this.bag(), 30000);

        },
        beforeDestroy() {
            clearInterval(this.getall)
            clearInterval(this.price)
            clearInterval(this.ba)
        },
        computed: {
            ...mapGetters({
                user: "user"
            })
        },
        methods: {
            tt() {
                console.log(this.items)
            },
            home() {
                this.$router.replace("/home")
            },
            nft() {
                this.$router.replace("/nft")
            },
            forceup() {
                this.pp();
                this.bag();
                this.getbagitem();
            },
            async getprice(){
                await axios.get("https://api.coingecko.com/api/v3/exchanges/kucoin/tickers?coin_ids=wax")
                .then(response => {
                    for(let i=0; i<response.data.tickers.length;i++){
                        if(response.data.tickers[i].target === "USDT"){
                            this.waxrate = response.data.tickers[i].last;
                        }
                    }
                })
                .catch(error => {
                    this.errorMessage = error.message;
                    this.getprice();
                });

                await axios.get("https://api.coingecko.com/api/v3/exchanges/binance/tickers?coin_ids=alien-worlds")
                .then(response => {
                    for(let i=0; i<response.data.tickers.length;i++){
                        if(response.data.tickers[i].target === "USDT"){
                            this.tlmrate = response.data.tickers[i].last;
                        }
                    }
                })
                .catch(error => {
                    this.errorMessage = error.message;
                    this.getprice();
                });

                this.tlmwax = (this.tlmrate/this.waxrate).toFixed(6);

                await axios.get("https://wax.alcor.exchange/api/markets")
                .then(response => {
                    this.alcortlmwax = response.data.find( ({ id }) => id === 26 ).last_price.toFixed(6);
                })
                .catch(error => {
                    this.errorMessage = error.message;
                    this.getprice();
                });

                this.diff = (this.alcortlmwax - this.tlmwax).toFixed(6);

            },

            pricecal(){
                this.waxus = (this.waxrate * this.waxBalance).toFixed(2);
                this.waxth = (this.waxus * 32.5).toFixed(2);
                this.swaxus = (this.waxrate * this.waxStake).toFixed(2);
                this.swaxth = (this.swaxus * 32.5).toFixed(2);
                this.tlmus = (this.tlmrate * this.tlm).toFixed(2);
                this.tlmth = (this.tlmus * 32.5).toFixed(2);
            },

            async pp(){
                for (let i = 0; i < this.items.length; i++) {
                    // this.getlastmine(i,'https://wax.blokcrafters.io/v2/state/get_account?account=');
                    // this.getlastnft(i,'https://wax.blokcrafters.io/v2/state/get_account?account=');
                    // this.getlastmine(i,'https://api.waxsweden.org/v2/state/get_account?account=');
                    // this.getlastnft(i,'https://api.waxsweden.org/v2/state/get_account?account=');
                    // this.getlastmine(i,' https://wax.cryptolions.io/v2/state/get_account?account=');
                    this.getaccount(i,' https://wax.cryptolions.io/v2/state/get_account?account=');
                    // this.getaccount(i,'https://api.wax.alohaeos.com/v2/state/get_account?account=')
                }
                this.gettotal();
                this.pricecal();
            },
            async bag(){
                for (let i = 0; i < this.items.length; i++) {
                    this.bagcheck(i); 
                }
                this.delay(3000)
                if(this.bagid[0].length>1){
                    this.getbagitem();
                }
            },
            
            async getaccount(i,url){
                    await axios.get(url+this.items[i].accname)
                    .then(response => {
                        this.items[i].balance = response.data.account.core_liquid_balance;
                        this.items[i].cpuusage = (response.data.account.cpu_limit.used / response.data.account.cpu_limit.max) * 100;
                        this.items[i].cpu = "" + response.data.account.cpu_limit.used / 1000 + "ms / "
                        + response.data.account.cpu_limit.max / 1000 + "ms ";
                        this.items[i].stake = response.data.account.self_delegated_bandwidth.cpu_weight;
                        for(let t = 0;t < response.data.tokens.length; t++){
                            if(response.data.tokens[t].symbol === "TLM"){
                                this.items[i].tlm = ""+response.data.tokens[t].amount+" TLM";
                                break;
                            }
                        }
                    
                        for (let j = 0; j < response.data.actions.length; j++) {
                            if(response.data.actions[j].act.name ==="transfer" && response.data.actions[j].act.data.memo === "ALIEN WORLDS - Mined Trilium"){
                                this.items[i].lastmine = Math.floor((Date.now()-Date.parse(response.data.actions[j].timestamp)-25200000)/(60000));
                                this.items[i].lasttlm = response.data.actions[j].act.data.amount;
                                break;
                            }
                        }
                        for (let j = 0; j < response.data.actions.length; j++) {
                        if(response.data.actions[j].act.name ==="logmint"){
                            for (let k = 0; k < response.data.actions[j].act.data.immutable_template_data.length; k++) {
                                if(response.data.actions[j].act.data.immutable_template_data[k].key === "img"){
                                    this.items[i].lastNFT = "https://ipfs.io/ipfs/" + response.data.actions[j].act.data.immutable_template_data[k].value[1];
                                    break;
                                }
                            }
                            break;
                        }
                        }
                        var time = new Date();
                        this.items[i].timeupdate = ""+time.getHours() +":"
                        if(time.getMinutes() <= 9){
                            this.items[i].timeupdate = this.items[i].timeupdate + "0" + time.getMinutes()
                        }else{
                            this.items[i].timeupdate += time.getMinutes()
                        }
                    })
                    .catch(error => {
                    this.errorMessage = error.message;
                    this.getaccount(i,url)
                     });
                
            },
            gettotal(){
                let tlm = 0;
                let waxStake = 0;
                let waxBalance = 0;
                for (let i = 0; i < this.items.length; i++) {
                    tlm += parseFloat(this.items[i].tlm.split("TLM")[0]);
                    waxStake += parseFloat(this.items[i].stake.split("WAX")[0]);
                    waxBalance += parseFloat(this.items[i].balance.split("WAX")[0]);
                }
                this.tlm = tlm.toFixed(2);
                this.waxStake = waxStake.toFixed(2);
                this.waxBalance = waxBalance.toFixed(2);
            },
            async delay(ms) {
                return new Promise((resolve) => setTimeout(resolve, ms));
            },
            async bagcheck(i) {
                    await axios.post("https://api.wax.alohaeos.com/v1/chain/get_table_rows",
                        JSON.stringify({
                            "json": true,
                            "code": "m.federation",
                            "scope": "m.federation",
                            "table": "bags",
                            "table_key": "",
                            "lower_bound": this.items[i].accname,
                            "upper_bound": this.items[i].accname,
                            "index_position": 1,
                            "key_type": "",
                            "limit": "100",
                            "reverse": false,
                            "show_payer": false
                        },{
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                
                            }
                        }))
                    .then(response => {
                        if(response.data.rows[0].locked === 1){
                            this.items[i].baglock = "Yes";
                        }else{
                            this.items[i].baglock = "No";
                        }
                        this.bagid[i] = response.data.rows[0].items
                    })
                    .catch(error => {
                        this.errorMessage = error.message;
                        this.bagcheck(i);
                    });
            },
            async getbagitem(){
                let url ="";
                for(let i=0;i<this.bagid.length;i++){
                    if(i%5==0){
                        url = "https://atomic.3dkrender.com/atomicassets/v1/assets/"
                    }else if(i%5==1){
                        url = "https://wax-aa.eu.eosamsterdam.net/atomicassets/v1/assets/"
                    }else if(i%5==2){
                        url = "https://api.wax-aa.bountyblok.io/atomicassets/v1/assets/"
                    }else if(i%5==3){
                        url = "https://wax-atomic-api.eosphere.io/atomicassets/v1/assets/"
                    }else{
                        url = "https://wax.api.atomicassets.io/atomicassets/v1/assets/"
                    }
                    for(let j=0;j<this.bagid[i].length;j++){
                        await axios.get(url+this.bagid[i][j])
                        .then(response => {
                            this.items[i].bagitem[j] = response.data.data.name;
                        })
                        .catch(error => {
                            this.errorMessage = error.message;
                            this.getbagitem(url);
                        });
                    }
                }
            },
            // async postapi() {
            //     this.waxStaketemp = 0;
            //     this.waxBalancetemp = 0;
            //     for (let i = 0; i < this.items.length; i++) {
            //         const res = await axios.post("https://chain.wax.io/v1/chain/get_account",
            //             JSON.stringify({ "account_name": this.items[i].accname }));
            //         this.items[i].balance = res.data.core_liquid_balance;
            //         this.items[i].cpuusage = (res.data.cpu_limit.used / res.data.cpu_limit.max) * 100;
            //         this.items[i].cpu = "" + res.data.cpu_limit.used / 1000 + "ms / "
            //             + res.data.cpu_limit.max / 1000 + "ms ";
            //         this.items[i].stake = res.data.self_delegated_bandwidth.cpu_weight;

            //         this.waxBalancetemp += parseFloat(this.items[i].balance.split("WAX")[0]);
            //         this.waxStaketemp += parseFloat(this.items[i].stake.split("WAX")[0]);
            //         if(i == this.items.length-1){
            //             this.waxStake = 0;
            //             this.waxBalance = 0;
            //             this.waxStake += this.waxStaketemp;
            //             this.waxBalance += this.waxBalancetemp;
            //         }
            //     }
            // },
            // async gettlm() {
            //     this.tlmtemp = 0;
            //     for (let i = 0; i < this.items.length; i++) {
            //         const res = await axios.post("https://chain.wax.io/v1/chain/get_currency_balance",
            //             JSON.stringify({
            //                 "code": "alien.worlds",
            //                 "account": this.items[i].accname,
            //                 "symbol": "TLM"
            //             }));
            //         this.items[i].tlm = res.data[0];
            //         this.tlmtemp += parseFloat(this.items[i].tlm.split("TLM")[0]);
            //         if(i == this.items.length-1){
            //             this.tlm = 0;
            //             this.tlm += this.tlmtemp;
            //         }
            //     }
            // },
            // async getlastminetx(i,url) {
            //         await axios.post('https://wax.pink.gg/v1/chain/get_table_rows',
            //             {
            //                 json: true,
            //                 code: "m.federation",
            //                 scope: "m.federation",
            //                 table: 'miners',
            //                 lower_bound: this.items[i].accname,
            //                 upper_bound: this.items[i].accname
            //             })
            //         .then(response => {
            //             this.getlastmine(url+response.data.rows[0].last_mine_tx, i);
            //         })
            //         .catch(error => {
            //             this.errorMessage = error.message;
            //             this.getlastmine(i,url);
            //         });
                
            // },
            // async getlastmine(i,url) {
            //     await axios.get(url+this.items[i].accname)
            //     .then(response => {
            //         for (let j = 0; j < 4; j++) {
            //             if(response.data.actions[j].act.name ==="transfer" && response.data.actions[j].act.account === "alien.worlds"){
            //                 this.items[i].lastmine = Math.floor((Date.now()-Date.parse(response.data.actions[j].timestamp)-25200000)/(60000));
            //                 this.items[i].lasttlm = response.data.actions[j].act.data.amount;
            //                 break;
            //             }
            //         }
            //     })
            //     .catch(error => {
            //     this.errorMessage = error.message;
            //     this.getlastmine(i,url);
            //      });
            // },
            // async getlastnft(i,url){
            //     await axios.get(url+this.items[i].accname)
            //     .then(response => {
            //         for (let j = 0; j < response.data.actions.length; j++) {
            //             if(response.data.actions[j].act.name ==="logmint"){
            //                 for (let k = 0; k < response.data.actions[j].act.data.immutable_template_data.length; k++) {
            //                     if(response.data.actions[j].act.data.immutable_template_data[k].key === "img"){
            //                         this.items[i].lastNFT = "https://ipfs.atomichub.io/ipfs/" + response.data.actions[j].act.data.immutable_template_data[k].value[1];
            //                         break;
            //                     }
            //                 }
            //                 break;
            //             }
            //         }
            //     })
            //     .catch(error => {
            //         this.errorMessage = error.message;
            //         this.getlastnft(i)
            //     });
            // },
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
