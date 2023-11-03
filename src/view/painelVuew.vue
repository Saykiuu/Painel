<script>
    import socket, { state } from "@/socket"
    import axios from "axios"
    export default {
        data(){
            return {
                listHistóric: [{ 
                    servico: "",
                    tipo: "",
                    senha: "",
                    status: "",
                    data: "",
                    hora: "",
                    guiche: ""
                }],

                selectedSenha : {
                    servico: "",
                    tipo: "",
                    senha: "",
                    status: "",
                    data: "",
                    hora: "",
                    guiche: ""
                },

                hours: '00',
                minutes: '00',
                seconds: '00',

                mensagem: "",
                conteudo: "",
                som: "",
                tipo: ""

            }
        },
        
        methods: {
            getHistoric(){
                let t = JSON.parse(JSON.stringify( state.senhasAtendidas))
                let d = JSON.parse(JSON.stringify( state.senhasChamadas))
                d.pop()
                this.listHistóric = t.concat(d)
                return this.listHistóric.reverse();
            },
            
            getSelected(){
                let pass = state.senhasChamadas[state.senhasChamadas.length -1];
                if(pass != undefined ){
                    if(pass.senha != this.selectedSenha.senha){
                        let sound = new Audio(require('@/assets/alert/infobleep.wav'))
                        sound.play()
                    }
                    this.selectedSenha = pass
                    return this.selectedSenha
                }else{
                    return undefined
                }
            },

            formatConteudo(youtube){
                let str = ''
                if(youtube.indexOf('=') == -1){
                    let splited = youtube.split('/')
                    str = splited[splited.length -1];
                }else{
                    str = youtube.split('=')[1];
                }
                return `${str}`;
            },

            async getConfigs(){
                try {
                    let con = await axios.get("http://192.168.102.168:3000/consulta/configs");
                    if(con.status == 200){
                        console.log(con)
                        con.data.forEach(element => {
                            this.mensagem = element.mensagem,
                            this.som = element.son
                            this.conteudo = element.conteudo,
                            this.tipo = element.tipo_conteudo
                        });
                    }
                } catch (error) {
                    if(error.response.status == 401){
                        sessionStorage.clear()
                        this.$router.push('/login')
                    }
                }
            },

            setTime(){
                const date = new Date();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                let seconds = date.getSeconds();
                hours = hours <= 9 ? `${hours}`.padStart(2, 0) : hours;
                minutes = minutes <= 9 ? `${minutes}`.padStart(2, 0) : minutes;
                seconds = seconds <= 9 ? `${seconds}`.padStart(2, 0) : seconds;
                this.hours = hours;
                this.minutes = minutes;
                this.seconds = seconds;
            },
        },

        created(){
            socket.listemSenha();
            this.getConfigs()
        },
        
        mounted(){
            setInterval(() => {
                this.setTime()
            }, 1000),

            this.getSelected()
        }
    }
</script>

<template>
    <section class="esquerda">
        <iframe :src="`https://www.youtube.com/embed/${formatConteudo(conteudo)}?&autoplay=1&controls=0`" frameborder="0" v-if="tipo=='video'"></iframe>
        <img :src="`${conteudo}`" v-else>
        
        <div class="content-history">
            <div class="ult-senha" v-for="(item, index) in getHistoric()" :key="index">
                <span class="senha">
                    {{item.senha}}
                </span>
                <span class="guiche">
                    {{ item.guiche }} 
                </span>    
                <span class="guiche">
                    {{ item.tipo }} 
                </span>    
            </div>
            
        </div>
    </section>

    <section class="direita">
        <div class="content-body" v-if="getSelected() !=undefined">
            <div class="content-tipo">
                {{ selectedSenha.tipo}}
            </div>
            <div class="content-pass">
                <label for="">Senha: </label>
                <p class="senha" >
                    {{ selectedSenha.senha}}
                </p>
            </div>
            <div class="content-guiche">
                <label for="">Guichê:</label>
                <p class="guiche">
                    {{ selectedSenha.guiche }}
                </p>
            </div>
        </div>

        <div class="content-body" v-else>  
            <div class="feijao">
                <img src="./../assets/mascote_chapeu.png" width="100%" alt="">
            </div>
        </div>
        <div class="content-footer">
            <div class="logo">
                <img src="./../assets/LOGO_BRANCO_PNG.png" width="110">
            </div>
            <p class="relogio">
                {{hours}}:{{ minutes }}:{{ seconds }}
            </p>
        </div>
    </section>

    <section class="baixo">
        <p>{{ mensagem }}</p>
    </section>

</template>

<style scoped>
    .feijao{
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        justify-content: center;
    }

    .feijao img{
        width: 100% !important;
    }
    .content-footer{
        display: flex;
        flex-direction: column;
        align-items: center;
        
    }
    .relogio{
        font-size: 55px;
        color:#fff;
    }
    .content-tipo{
        text-transform: capitalize;
        font-size: 55px;
    }

    .senha, .guiche{
        font-size: 90px;
        color:yellow;
      
    }
    .content-guiche, .content-pass{
        width: 70%;
    }
     
    .content-guiche .guiche, .content-pass .senha{
        transform: translateY(-30px);
    }
    label{
        font-size: 30px;

    }

    .content-tipo, .content-guiche, .content-pass{
        color: #fff;    
        
    }
    .content-body{
     height: 70%;
     background-color: var(--color-main);
     display: flex;
     flex-direction: column;
     align-items: center;

    }
   .esquerda{
    position: absolute;
    width: 70vw;
    left: 0;
    top: 0;
    bottom: 70px;
    overflow-x: hidden;
    overflow-y: hidden;
   }
   .content-history{
    width: 100%;
    display: flex;
    height: 25%;
    transform: translateY(-10px);
    background-color:var(--color-main);

   }
   .ult-senha{
    min-width:calc(100%/4);
    border-right:1px #fff solid;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: start;
    padding-left: 5px;
    justify-content: center;
   }
   iframe, .esquerda img{
    height: 80%;
    width: 100%;
   }
   
   .ult-senha .senha{
    font-size: 50px;
    color: #fff;
    transform: translateY(-10px);
   }
   .ult-senha .guiche{
    font-size: 30px;
    transform: translateY(-30px);
    color: #fff;

   }
   .direita{
    position: absolute;
    right: 0;
    top:0;
    bottom:70px;
    background-color: var(--color-main);
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

   }
   .baixo{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-main);
    height: 70px;
    color:#fff;
    text-align: center;
    border-top: 1px #fff solid;

   }

   .baixo p{
    font-size: 40px;
   }

</style>