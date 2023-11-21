<script>
import LoadingView from '@/components/LoadingView.vue';
import { io } from "socket.io-client";


export default {
    data(){
        return {
            profile: {
                nome: '',
                id: '',
                guiche : '',
                servico: '',
                tipo: ''
            },
            selectedSenha : [],
            listSenhasEspera:[{
                servico: "",
                tipo: "",
                senha: "",
                status: "",
                data: "" ,
                hora: "",
            }],
            listSenhasHistorico:[{
                servico: "",
                tipo: "",
                senha: "",
                status: "",
                data: "" ,
                hora: "",
            }],

            load: false,
            socketInstance: undefined
        }
    },
    methods: {

        formatHora(val){
            let t = val.substring(0, 5)
            return t;
        },

        getInfos(){
            let perfil = localStorage.getItem('perfil')
            if(perfil == undefined || perfil == null || perfil == ''){
                localStorage.clear()
                this.$router.push('/login')
            }
            this.profile = JSON.parse(perfil)
            if(this.profile.tipo != 'atend'){
                this.logout()
            }
        },
        logout(){
            this.$router.push({ path: '/login' })
            localStorage.clear()
        },

        captalize(val){
            return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
        },

        selecionarSenha(item){
            this.load = true;
            item.guiche = this.profile.guiche
            this.socketInstance.emit('chamar senha', item)
        },

        chamarNovamente(){
            this.socketInstance.emit('chamar novamente',  this.selectedSenha[0])
        },

       
        finalizarAtendimento(){
            this.socketInstance.emit('finalizar atendimento', this.selectedSenha[0])
            this.load = true
        },

        voltarSenha(){
            this.load = true
            this.socketInstance.emit('voltar senha', this.selectedSenha[0])
        },

        connectar(){
            this.socketInstance = io('http://192.168.102.168:3000')
            this.socketInstance.on('listar senhas', (data)=>{
                this.listSenhasEspera = [];
                this.listSenhasHistorico = [];
                this.listSenhasEspera = data.senhasEsperando.filter(senha=> senha.servico == this.profile.servico)
                this.listSenhasHistorico = data.senhasAtendidas.filter(senha=> senha.servico == this.profile.servico)
                this.selectedSenha = data.senhasChamadas.filter(e=>{if(e.servico == this.profile.servico && e.guiche == this.profile.guiche ) return e})
                this.load = false;
            })
        }
    },  

    created(){
        this.getInfos()
        this.connectar();
    },
    beforeUnmount (){
        this.socketInstance.disconnect()
    },
    components: {
        LoadingView
    }
}
</script>

<template>
   <nav>
        <div class="configs">
            <div class="content-prof">
                <span class="title">{{ profile.nome }}</span>
                <span>{{ profile.guiche }} - {{ profile.servico }}</span>
            </div>
            <div>
                <button class="btn" v-on:click="logout()">sair</button>
            </div>
        </div>
    </nav>
    <div class="content-sections">
        <section class="content-list">
            <ul class="list">
                <li class="item-list" v-for="(item, index) in listSenhasEspera" :key="index" >
                    <div >
                        <p> {{ item.senha }} - {{ captalize(item.tipo) }}</p>
                        <p> {{ formatHora(item.hora) }}</p>
                    </div>
                    <button class="btn btn-icon" v-on:click="selecionarSenha(item)" v-if="this.selectedSenha.length == 0">
                        <span class="material-icons">
                            campaign
                        </span>
                    </button>
                </li>
            </ul>
        </section> 
        <section class="atual">
            <div class="conteudo"  >
                <span class="senha-pass" v-if="selectedSenha.length != 0">
                    {{ selectedSenha[0].senha }} <br>
                    {{ selectedSenha[0].tipo }}
                </span>
                <span class="senha-pass"  v-else>
                    Nenhuma senha foi chamada
                </span>
                <div class="list-actions">
                    <button class="btn btn-yellow" :disabled="selectedSenha.length == 0" v-on:click="chamarNovamente">Chamar Novamente</button>
                    <div class="space"></div>
                    <button class="btn btn-main" :disabled="selectedSenha.length== 0" v-on:click="finalizarAtendimento">Finalizar Atendimento</button>
                    <div class="space"></div>
                    <button class="btn btn-red" :disabled="selectedSenha.length== 0"  v-on:click="voltarSenha">Voltar para espera</button>
                </div>
            </div>
        </section>      
        <section class="container-historico">
            <ul class="list" >
                <li class="itens" v-for="(item, index) in listSenhasHistorico.reverse()" :key="index">
                    <span>{{ item?.senha }}</span>
                    <span>{{ item?.status }}</span>
                    <span>{{ formatHora(item?.hora) }} - {{ captalize(item?.tipo) }}</span>
                </li>
            </ul>
        </section> 
    </div>
    
    <LoadingView v-if="load"></LoadingView>
</template>

<style scoped>

    .btn-yellow{
        color: white;
        background-color: rgb(226, 190, 29);
    }
    .btn-main{
        color: white;
        background-color: var(--color-main)
    }
    .btn-red{
        color: white;
        background-color: rgb(46, 207, 108);
    }
    .btn-icon{
        padding: 0;
        height: 30px;
        width: 30px;
        border-radius: 100%;
        transform: translateY(100%);
        opacity: 0;
        transition: all 0.6s;

    }
    .container-historico{
        position: fixed;
        right: 0;
        bottom: 0;
        left: 300px;
        height: 100px;
        background-color: #fff;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .container-historico .list  {
        display: flex;
        height: 100%;
        list-style: none;
    }

    .container-historico .list .itens {
        min-width: calc(100% / 5);
        display: flex;
        flex-direction: column;
        padding: 5px;
        border-left: var(--border);
        height: 100%;
    }
    .conteudo{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .list-actions{
        display: flex;
    }
    .senha-pass{
        font-weight: bold;
        vertical-align: middle;
        padding: 10px;
        width: 300px;
        text-align: center;
        background-color: #ffffff;
        box-shadow: var(--shadow);
        border-radius: 10px;
        border: var(--border);
        margin: 10px;
        font-size: 30px;
    }
    .atual{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 63px;
        left: 300px;
        right: 0;
        bottom: 70px;
        overflow: auto;
    }

    .content-list{
        background-color: #ffffff;
        position: fixed;
        top: 63px;
        left: 0;
        width: 300px;
        bottom: 0;
        overflow-y: auto ;
    }
  
    
    .item-list{
        padding: 10px 5px;
        border-bottom: var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: all 0.2s;
        overflow-y: hidden;
    }
    

    .item-list:hover{
        background-color: #ececec;
    }

    .item-list:hover>.btn-icon{
        transform: translateY(0%);
        opacity: 1;
    }
    .content-sections{
        height: calc(100vh - 63px);
        display: flex;
        justify-content: end;
    }
    .configs{
        padding: 10px;
        background-color: var(--color-main);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--shadow);
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
</style>