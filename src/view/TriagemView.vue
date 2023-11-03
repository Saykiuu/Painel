<script>
import axios from "axios";
import {state } from '@/socket'
import socket from './../socket';
import LoadingView from '@/components/LoadingView.vue';

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
            controleSenhas: [],

            listServicos: [{
                id: 0,
                description: ''
            }],
            socketInstance: state,
            count:[],
            load: false
        }
        
    },
    methods:{

        async getServico(){
            try {
                let usuario = localStorage.getItem('token');
                let con = await axios.get("http://192.168.102.168:3000/consulta/normal/servicos", { headers: { Authorization: usuario }});
                this.listServicos = [];
                if(con.status == 200){
                    this.listServicos = con.data
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

            this.senhaServiços = state.senhas
        },

        countSenhasService(i){
                let senhas = state.senhasAtendidas.concat(state.senhasChamadas, state.senhasEsperando)
                this.count= []
                for (let k = 0; k < this.listServicos.length; k++) {
                    const servico = this.listServicos[k];
                    let y = [];
                    for (let o = 0; o < senhas.length; o++) {
                        const senha = senhas[o];
                        if(senha.servico.toUpperCase() == servico.description.toUpperCase()){
                            y.push(senha)
                        }
                    }
                    this.count.push(y)
                }

                let normal = this.count[i].filter(cont => cont.tipo == 'normal')
                
                let prioridade = this.count[i].filter(cont => cont.tipo == 'prioridade')
               
                return `${ normal.length} / ${prioridade.length}` 
        },

        criarSenha( servico, tipo, index){
            let alfabeto = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","U","V","W","X","Y","Z"];
            
            let cont = this.count[index].filter(cont => cont.tipo == 'normal').length + 1
            let numero = `${alfabeto[this.listServicos.findIndex((e)=>e.description === servico)]}${tipo.substring(0, 1).toUpperCase()}${cont}` 
            let data= new Date()
            let jsn = {
                servico: servico,
                tipo: tipo,
                senha: numero,
                status: "esperando",
                data: data.toLocaleDateString(),
                hora: data.toLocaleTimeString(),
                guiche: ''
            }
            
            socket.sentData(jsn)
        },

        loading(){
            this.load = state.loadtria
            return this.load
        }
       
    },
    created(){
        this.getServico();
        this.getInfos();
    }
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
    <section >
            <div class="cards" v-for="(item, index) in listServicos" :key="index" >
                <div class="cards-header">
                    <div class="title">{{ item.description }}</div>
                    
                    <div class="senha">
                        Senhas  {{ countSenhasService(index) }}
                    </div>

                </div>
                
                <div class="cards-body" >
                    <button class="btn" v-on:click="criarSenha(item.description,'normal', index)">Normal</button>
                    <div class="space"></div>
                    <button class="btn" v-on:click="criarSenha(item.description,'prioridade', index)">Prioridade</button>
                </div>
            </div>
    </section>
    <LoadingView v-if="loading()"></LoadingView>
</template>

<style scoped>
    
   
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