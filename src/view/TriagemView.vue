<script>
import axios from "axios";
import LoadingView from '@/components/LoadingView.vue';
import { io } from "socket.io-client";

export default {
    components:{
        LoadingView
    },    
    data (){
        return{
            profile: {
                nome: '',
                id: '',
                guiche : '',
                servico: '',
                tipo:''
            },
            senhaServiços: [],
            senhas: {
                senhasAtendidas:[],
                senhasChamadas: [],
                senhasEsperando: []
            },
            controleSenhas:[],


            listServicos: [{
                id: 0,
                description: ''
            }],
            socketInstance: [],
            load: false,
            printSenha : {
                data: '',
                hora: '',
                senha: '',
                tipo: '',
            },
            mensagem : ''
        }
        
    },
    methods:{

        async connectar(){
            this.socketInstance = io('http://192.168.102.168:3000');
            await this.socketInstance.on('listar senhas', (data)=>{
                this.senhas = data;
                this.countSenhasService();
                this.load = false;
            })
           
        },

        async getConfigs(){
                try {
                    let con = await axios.get("http://192.168.102.168:3000/consulta/configs");
                    if(con.status == 200){
                        this.mensagem = con.data[0].mensagem
                    }
                } catch (error) {
                    if(error.response?.status == 401){
                        sessionStorage.clear()
                        this.$router.push('/login')
                    }
                }
            },

        async getServico(){
            try {
                let usuario = localStorage.getItem('token');
                let con = await axios.get("http://192.168.102.168:3000/consulta/normal/servicos", { headers: { Authorization: usuario }});
                this.listServicos = [];
                if(con.status == 200){
                    this.listServicos = con.data
                    this.countSenhasService();
                }
            } catch (error) {
                console.log(error)
                if(error.response?.status == 401){
                    sessionStorage.clear()
                    this.$router.push('/login')
                }
            }
            
        },

        logout(){
            this.$router.push({ path: '/login' })
            localStorage.clear()
        },

        getInfos(){
            let perfil = localStorage.getItem('perfil')
            if(perfil == undefined || perfil == null || perfil == ''){
                localStorage.clear()
                this.$router.push('/login')
            }
            this.profile = JSON.parse(perfil)
            if(this.profile.tipo != 'triagem'){
                this.logout()
            }

        },

        countSenhasService(){
            if(this.senhas != undefined){
                this.controleSenhas.length = 0;
                console.log(this.controleSenhas)
                let pass = this.senhas.senhasAtendidas.concat(this.senhas.senhasChamadas, this.senhas.senhasEsperando)
                for (let k = 0; k < this.listServicos.length; k++) {
                    const servico = this.listServicos[k];
                    let y = [];
                    for (let o = 0; o < pass.length; o++) {
                        const senha = pass[o];
                        if(senha.servico.toUpperCase() == servico.description.toUpperCase()){
                            y.push(senha)
                        }
                    }
                    let normal = y.filter(cont => cont.tipo == 'normal');
                    let prioridade = y.filter(cont => cont.tipo == 'prioridade');
    
                    this.controleSenhas.push({normal: normal.length, prioridade: prioridade.length});
                   
                }
                
            }
        },

        async criarSenha( servico, tipo, index){
            let alfabeto = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","U","V","W","X","Y","Z"];
            let cont = this.controleSenhas[index][tipo] + 1
            let data = new Date();
            this.printSenha = {
                data: data.toLocaleDateString(),
                hora: data.toLocaleTimeString(),
                senha : `${alfabeto[this.listServicos.findIndex((e)=>e.description === servico)]}${tipo.substring(0, 1).toUpperCase()}${cont}`,
                tipo: tipo,
            }
            let jsn = {
                servico: servico,
                tipo: tipo,
                senha: this.printSenha.senha,
                status: "esperando",
                data: this.printSenha.data,
                hora: this.printSenha.hora,
                guiche: ''
            }
            
            this.socketInstance.emit('criar senha', jsn);
            this.load = true;
            await new Promise(()=>{
                setTimeout(() => {
                    print()
                }, 1000);
            })
        },
       
    },
    beforeUnmount (){
        this.socketInstance.disconnect()
    },
    beforeMount(){
        this.connectar();
        this.getServico();
        this.getConfigs();
        this.getInfos();
    }
    // ,
    // watch: {
    //     controleSenhas(newValue, oldValue){
    //         console.log(newValue, oldValue)
    //         console.log('será');
    //     }
    // }
}
</script>

<template>
    <nav>
        <div class="configs">
            <div class="content-prof">
                <span class="title">{{ profile.nome }}</span>
                <span>{{ profile.tipo }} - {{ profile.guiche }}</span>
            </div>
            <div>
                <button class="btn" v-on:click="logout()">sair</button>
            </div>
        </div>
    </nav>
    <section class="content-card" >
            <div class="cards" v-for="(item, index) in listServicos" :key="index" >
                <div class="cards-header">
                    <div class="title">{{ item.description }}</div>
                    
                    <div class="senha">
                        Senhas  {{ controleSenhas[index]?.normal }} / {{ controleSenhas[index]?.prioridade }}
                    </div>

                </div>
                
                <div class="cards-body" >
                    <button class="btn" v-on:click="criarSenha(item.description,'normal', index)">Normal</button>
                    <div class="space"></div>
                    <button class="btn" v-on:click="criarSenha(item.description,'prioridade', index)">Prioridade</button>
                </div>

                
            </div>
        <LoadingView v-if="load"></LoadingView>
            
    </section>

    <div id="showPrint">
        <div class="content-print">
            <span class="pass">{{ printSenha.senha }}</span>
            <span class="type">{{ printSenha.tipo }}</span>
            <span class="date">{{ printSenha.data }} - {{ printSenha.hora }}</span>
            <span class="message">{{ mensagem }}</span>

        </div>
    </div>
    
</template>

<style scoped>
    
    @media print{
        nav{
            display: none;
        }

        .content-card{
            display: none;
        }

        #showPrint{
            display: block !important;
        }
    }
    #showPrint{
        display: none;
    }
    .message{
        width: 80%;
        text-align: center;
        margin-bottom: 20px;
    }
    .content-print{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        display: flex;
        justify-content: start;
        margin: 30px;
        align-items: center;
        flex-direction: column;
    }
    .pass{
        font-size: 40px;
        font-weight: bold;
        text-transform: uppercase;
    }
    .type{
        font-size: 25px;
        text-transform: capitalize;
    }
    
    .cards-body{
        align-items: center;
        display: flex;
    }
    

    section{
        display: grid;
        grid-template-columns: auto auto auto auto;
    }
    .cards{
        border: var(--border);
        height: 100px;
        width: clamp(30%, 420px, 100%);
        border-radius: 7px;
        padding: 10px;
        margin: 5px;
        background-color: white;
        box-shadow: var(--shadow);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        justify-self: flex-start;
        grid-template-columns: 200px 200px;

    }
    
     .configs{
        position: fixed;
        right: 0;
        left: 0;
        top: 0;
        z-index: 3;
        padding: 10px;
        background-color: var(--color-main);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .content-prof{
        display: flex;
        flex-direction: column;
        font-size: 11px;
    }

    .title{
        font-weight: 700;
        font-size: 15px;
    }
    section{
        position: absolute;
        right: 0;
        left: 0;
        top: 70px;
        padding: 5px;
        display: flex;
        flex-wrap: wrap
    }
    .title-pass{
        font-size: 30px;
    }

</style>