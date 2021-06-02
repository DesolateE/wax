<template>
    <div class="home">
        
        <b-button class="button btn-primary" @click="home">Home</b-button>
        <b-button class="button btn-primary" @click="up">Update</b-button>
        <p style="font-size:0.8vw">Alcor TLM/WAX: <input v-model="alcortlmwax"> ------ Real TLM/WAX: <input v-model="tlmwax"> ------ Rate_Difference: <input v-model="diff"></p>
        <p style="font-size:1.2vw">CurrentRate WAX/USDT: <input v-model="waxrate"> USDT</p>
        <p style="font-size:1.2vw">CurrentRate TLM/USDT: <input v-model="tlmrate"> USDT</p>
        <b-alert
            :show="dismissCountDown"
            dismissible
            variant="success"
            @dismissed="dismissCountDown=0"
            >
            <p style="font-size:1.5vw">You got {{nftcount}} NFT - {{ show }}</p>
            <p style="font-size:1.1vw">{{ nft }}</p>
        </b-alert>
        <b-table striped hover :items="items" :fields="fields">
            <template v-slot:cell(index)="row">
                <div style="font-size:25px">{{ row.index + 1 }}</div>
            </template>
            <template v-slot:cell(accname)="row">
                <div style="font-size:25px">{{ row.item.accname }}</div>
            </template>
            <template  v-slot:cell(claim)="row">
                <div class="container">
                    <div class="row">
                        <div class="col" v-for="(claim,index) in row.item.claim" v-bind:key=index>
                            <img :src= claim width="120" height="150" >
                        </div>
                    </div>
                </div>
            </template>
        </b-table>
        <p style="font-size:0.8vw">Alcor TLM/WAX: <input v-model="alcortlmwax"> ------ Real TLM/WAX: <input v-model="tlmwax"> ------ Rate_Difference: <input v-model="diff"></p>
        <p style="font-size:1.2vw">CurrentRate WAX/USDT: <input v-model="waxrate"> USDT</p>
        <p style="font-size:1.2vw">CurrentRate TLM/USDT: <input v-model="tlmrate"> USDT</p>
    </div>
</template>
<script>
    import firebase from "firebase";
    import { mapGetters } from "vuex";
    import axios from 'axios';
    export default {
        name: "claimcheck",
        data() {
            return {
                fields: {
                    Index: "index", accname: "accname",claim:"claim"
                },
                items: [],
                claim: [],
                alcortlmwax:0,
                diff:0,
                waxrate:0,
                tlmrate:0,
                dismissSecs: 100000000,
                dismissCountDown: 0,
                showDismissibleAlert: false,
                nft: '',
                nftcount:0,
                show:''
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
                    this.items.push({ index: i + 1, accname: data[i],claim:[]})
                    this.claim.push([]);
                }
            });
            this.getprice();
            this.price = setInterval(() => this.getprice(), 30000);
            this.bag();
            this.ba = setInterval(() => this.bag(), 30000);

        },
        beforeDestroy() {
            clearInterval(this.ba)
            clearInterval(this.price)
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
            up(){
              this.bag();
              this.getprice();
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
            async bag(){
                for (let i = 0; i < this.items.length; i++) {
                    this.claimcheck(i);
                }
                // this.nft = "";
                this.nftcount = 0;
                for (let i = 0; i < this.claim.length; i++) {
                    this.items[i].claim = [];
                    console.log("checking")
                    if(this.claim[i].length > 0){
                        for (let j = 0; j < this.claim[i].length; j++) {
                            this.claimpic(i,"https://wax.api.atomicassets.io/atomicassets/v1/templates/alien.worlds/"+this.claim[i][j])
                        }
                    }
                }
                this.dismissCountDown = this.dismissSecs;
                
                this.nftbuild()
            },
            nftbuild(){
                let nf = this.nft.split(",");
                this.nft = "";
                nf.pop()
                let a = [];
                for(let i=0; i<nf.length; i++){
                    let isfound = false;
                    for(let j=0; j<a.length; j++){
                        if(nf[i] === a[j].name){
                            isfound = true;
                        }
                        if(isfound){
                            a[j].count += 1;
                            break;
                        }
                    }
                    if(!isfound){
                        a.push({ name : nf[i],count: 1})
                    }
                }
                this.show = "";
                for(let i=0; i<a.length; i++){
                    this.show = this.show + a[i].count + " " + a[i].name +", "
                }
            },
            async delay(ms) {
                return new Promise((resolve) => setTimeout(resolve, ms));
            },
            async claimcheck(i){
                    await axios.post("https://api.wax.alohaeos.com/v1/chain/get_table_rows",
                        JSON.stringify({
                            "json": true,
                            "code": "m.federation",
                            "scope": "m.federation",
                            "table": "claims",
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
                            if(response.data.rows.length >0){
                                this.claim[i] = response.data.rows[0].template_ids;
                            }else{
                                this.claim[i] = []
                            }
                    })
                    .catch(error => {
                        this.errorMessage = error.message;
                        this.claimcheck(i);
                    });
            },
            async claimpic(i,url){
                await axios.get(url)
                .then(response => {
                    this.items[i].claim.push("https://ipfs.io/ipfs/" + response.data.data.immutable_data.img)
                    this.nft += response.data.data.name +","
                    this.nftcount += 1;
                })
                .catch(error => {
                    this.errorMessage = error.message;
                    this.claimpic(i,url);
                });
                    
            }
        }
    };
</script>
