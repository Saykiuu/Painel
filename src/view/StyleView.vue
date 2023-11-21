<script>

import ModalAdd from '@/components/ModalAdd.vue';
import AlertView from '@/components/AlertView.vue';
import axios from 'axios'

export default {
    components: {
        ModalAdd,
        AlertView
    },
    data(){
        return {
            tipo: "video",
            selectedTipo: "video",
            alerts: [],

            conteudo: "",
            newConteudo: "",

            mensagens: "Feliz 2023!",
            newMensagem: "",
            
            optEdit: "",
            
            isvisible: false
        }
    },
    
    methods:{
        closeModal(){
            this.isvisible = false
        },

        showModal(val){
            this.isvisible = true
            this.optEdit = val
        },

        async getConfigs(){
            try {
                let con = await axios.get("http://192.168.102.168:3000/consulta/configs");
                if(con.status == 200){
                    console.log(con);
                    con.data.forEach(element => {
                        this.mensagens = element.mensagem,
                        this.newMensagem = element.mensagem,
                        this.tipo = element.tipo_conteudo,
                        this.conteudo = element.conteudo,
                        this.newConteudo = element.conteudo
                        this.selectedTipo = element.tipo_conteudo
                    });
                }
            } catch (error) {
                if(error.response2.status == 401){
                    sessionStorage.clear()
                    this.$router.push('/login')
                }
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
            
            return `https://img.youtube.com/vi/${str}/hqdefault.jpg`;
        },

        async updateConfigs(){
            try {
                let temp = {
                    som: this.selectSom != ""? this.selectSom : this.sons.path,
                    mensagem: this.newMensagem,
                    conteudo: this.newConteudo,
                    tipo: this.selectedTipo    
                }
                let usuario = localStorage.getItem('token');
                let con = await axios.post("http://192.168.102.168:3000/atualizar/configs", temp , { headers: { Authorization: usuario }});
                if(con.status == 200){
                    this.getConfigs();    
                    this.closeModal()
                    this.alerts.push({
                        message: con.data.message, 
                        tipo: true,
                        title:"Sucesso!"
                    })     
                }
            } catch (error) {
                
                console.log(error)
                if(error.response?.status == 401){
                    localStorage.clear()
                    this.$router.push('/login')
                }
            }
        },

        onChange(event){
            if(event.target.value != this.tipo) this.newConteudo = ""
            else{
                this.newConteudo = this.conteudo
            }
        }
    },

    created(){
        this.getConfigs()
    }
}
</script>

<template>
    <AlertView v-for="(item, index) in alerts" :key="index" :alert="item"></AlertView>
    <section>
        <div class="content-cards">
            
            <div class="cards"  v-on:click="showModal('conteúdo')">
                <div class="header-cards" >
                    Conteúdo
                </div>
                <div class="body-cards">
                    {{ tipo }}
                    <img :src="formatConteudo(conteudo)" alt="">
                </div>
            </div>
            <div class="cards"  v-on:click="showModal('mensagem')">
                <div class="header-cards">
                    mensagem
                </div>
                <div class="body-cards">
                    {{ mensagens }}
                </div>
            </div>
        </div>
    </section>

    <ModalAdd 
        v-show="isvisible"
        @close="closeModal"
    >

        <template v-slot:header>
            Editar {{ optEdit }}
        </template>

        <template v-slot:body>
            <div class="container" v-if="optEdit == 'som'">
                <div class="form-group">
                    <select class="form-input" v-model="selectSom">
                        <option value="" selected disabled>Selecione</option>
                        <option :value="item.path" v-for="(item, index) in listasSons" :key="index">
                            {{ item.son }}
                        </option>   
                    </select>
                </div>
                <button class="btn" v-on:click="updateConfigs()">
                    Salvar
                </button>
            </div>
            <div class="container" v-else-if="optEdit == 'conteúdo'">
                <div class="form-group">
                    <input type="radio" value="video" name="radioConteudo" v-model="selectedTipo" v-on:change="onChange($event)"  id="radio-conteudo-video">
                    <label for="radio-conteudo-video"> Vídeo</label>
                </div>
                <div class="form-group content" v-bind:class="{'form-group content ocult': selectedTipo == 'imagem' }">
                    <label for="">Link do Youtube</label> 
                    <input class="form-input" v-model="newConteudo" placeholder="Link do youtube">
                </div>
                <div class="form-group content">
                    <input type="radio" value="imagem" v-model="selectedTipo" v-on:change="onChange($event)" name="radioConteudo" id="radio-conteudo-img">
                    <label for="radio-conteudo-img"> Imagem</label>
                </div>
                <div class="form-group" v-bind:class="{'form-group content ocult': selectedTipo == 'video' }">
                    <label for="">Link da imagem</label> 
                    <input class="form-input" v-model="newConteudo" placeholder="http://flucianofeijao.com.br/uploads/">                   

                </div>
                <button class="btn" v-on:click="updateConfigs()">
                    Salvar
                </button>
            </div>
            <div class="container" v-else>
                <div class="form-group">
                    <label for="">Mensagem</label> 
                    <input class="form-input" v-model="newMensagem" >                   
                </div>

                <button class="btn" v-on:click="updateConfigs()">
                    Salvar
                </button>
            </div>

        </template>
    </ModalAdd>
</template>

<style scoped>
    section{
        width: calc(100vw - 250px);
        padding: 10px;
        display: flex;
        flex-direction: column;
    }

    .ocult{
        position: relative;
    }

    .ocult::after{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-color: white;
        content: '';
        
    }

    .content{
        overflow: hidden;
    }

    .content-cards{
        display: flex;
        width: 100%;
        flex-direction: column;
    }

    .cards{
        border: var(--border);
        background-color: white;
        border-radius: 13px;
        min-height: 100px;
        margin: 10px 0;
        padding: 5px;
        display: flex;
        flex-direction: column;
        transition: all 0.4s;
    }

    .cards:hover{
        box-shadow: var(--shadow);
        cursor: pointer;
    }
    .header-cards{
        font-size: 21px;
        text-transform: capitalize;
    }
    .body-cards{
        color: #313131;
        font-size: 15px;
        padding: 10px;
    }

    .body-cards img{
        display: flex;
        flex-direction: column;
        width: 100px !important;
        margin-top: 5px;
        box-shadow: var(--shadow);
    }

   
</style>