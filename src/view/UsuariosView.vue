<script>
import axios from 'axios';
import ModalAdd from '@/components/ModalAdd.vue';
import ModalEdit from '@/components/ModalEdit.vue';


export default {
    
    data(){
        return {
            isModalVisible: false,
            isModalEditVisible: false,

            usuario: {
                nome: '',
                login: '',
                senha: '',
                tipo: '',
                guiche: '',
                s_id: 0,
                s_nome: ''
            },

            editUsuario: {
                id: 0,
                nome: '',
                login: '',
                status: '',
                tipo: '',
                guiche: '',
                s_id: 0,
                s_nome: ''

            },

            listUsuarios: [{
                id: 0,
                nome: '',
                login: '',
                status: '',
                tipo: '',
                guiche: '',
                s_id: 0,
                s_nome: ''
            }],
            listServicos: [{
                id: 0,
                description: '',
                status: false
            }]
        }
    },
    methods: {
        async getUsuarios(){
            try {
                let usuario = localStorage.getItem('token');
                let con = await axios.get("http://192.168.102.168:3000/consulta/usuario", { headers: { Authorization: usuario }});
                this.listUsuarios= [];
                if(con.status == 200){
                    this.listUsuarios = con.data
                }

            } catch (error) {
                if(error.response.status == 401){
                    sessionStorage.clear()
                    this.$router.push('/login')
                }
            }
        },

        showModal(){
            this.isModalVisible = true
        },

        closeModal(){
            this.isModalVisible = false
            this.usuario = {
                nome: '',
                login: '',
                senha: '',
                tipo: '',
                guiche: "",
                s_nome: "" ,
                s_id: 0
            }
        },

        showModalEdit(val){
            
            this.editUsuario = JSON.parse(JSON.stringify(val))
            this.isModalEditVisible = true
        },

        closeModalEdit(){
            this.isModalEditVisible = false
            this.editUsuario = {
                login : '',
                nome : '',
                senha: "",
                status: true,
                guiche: "",
                s_nome: "" 
            }
        },

        async cadastrarUsuario(){
            try {
                let usuario = localStorage.getItem('token');
                let con = await axios.post("http://192.168.102.168:3000/cadastrar/usuario", this.usuario , { headers: { Authorization: usuario }});
                if(con.status == 200){
                    this.getUsuarios()        
                    this.closeModal()        
                }
            } catch (error) {
                console.log(error)
                if(error.response?.status == 401){
                    sessionStorage.clear()
                    this.$router.push('/login')
                }
            }
        },

        async editarUsuario(){
           try {
                let usuario = localStorage.getItem('token');
                let con = await axios.post("http://192.168.102.168:3000/atualizar/usuario", this.editUsuario , { headers: { Authorization: usuario }});
                if(con.status == 200){
                    this.closeModalEdit()        
                }
            } catch (error) {
                console.log(error)
                if(error.response?.status == 401){
                    sessionStorage.clear()
                    this.$router.push('/login')
                }
            }
        },

        async getServico(){
            try {
                let usuario = localStorage.getItem('token');
                let con = await axios.get("http://192.168.102.168:3000/consulta/servicos", { headers: { Authorization: usuario }});
                this.listServicos = [];
                if(con.status == 200){
                    this.listServicos = con.data
                }
            } catch (error) {
                if(error.response.status == 401){
                    sessionStorage.clear()
                    this.$router.push('/login')
                }
            }
        },

        convertStatus(val){
            if(val) return "Ativo";
            else return "Inativo";
        },
    },
    
    created(){
        this.getServico()
        this.getUsuarios()
    },
    components: { ModalAdd, ModalEdit }


}
</script>

<template>
     
    <section>
        <div class="actions">
            <button class="btn" v-on:click="showModal()">Adicionar</button>
            <audio id="audio-player">
                <source :src="'@/assets/alert/ding-dong.wav'" type="audio/mpeg">
                Your browser does not support the audio tag.
            </audio>
        </div>
        <div class="content-table">
            <table class="customers">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>status</th>
                        <th>Tipo</th>
                        <th>Guichê</th>
                        <th>Serviço</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in listUsuarios" :key="index">
                        <td>{{ item.nome }}</td>
                        <td>{{ convertStatus(item.status) }}</td>
                        <td>{{ item.tipo }}</td>
                        <td>{{ item.guiche }}</td>
                        <td>{{ item.s_nome }}</td>

                        <td>
                            <span class="material-icons btn" style="padding: 3px;"  v-on:click="showModalEdit(item)">
                                edit
                            </span>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
        
    </section>
    
    <ModalAdd
        v-show="isModalVisible"
        @close="closeModal"
        >
        <template v-slot:header>
            Novo Usuário
        </template>

        <template v-slot:body>
            
                <div class="content-form">
                    <div class="form-group">
                        <label for="">Nome *</label>
                        <input type="text" class="form-input" v-model="usuario.nome">
                    </div>   
                    <div class="form-row">
                        <div class="form-group">
                            <label for="">Login *</label>
                            <input type="text" class="form-input" v-model="usuario.login">
                        </div>
                        <div class="space"></div>

                        <div class="form-group">
                            <label for="">Senha *</label>
                            <input type="text" class="form-input" v-model="usuario.senha">
                        </div>  
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="">Tipo * </label>
                            <select class="form-input" v-model="usuario.tipo">
                                <option value="" disabled selected >Selecione</option>
                                <option value="adm">Administrador</option>
                                <option value="atend">Atendente</option>
                                <option value="triagem">Triagem</option>
                                <option value="painel">Painel</option>
                            </select>
                        </div>  
                        <div class="space"></div>
                        <div class="form-group">
                            <label for="">Guiche</label>
                            <input type="text" class="form-input" v-model="usuario.guiche">
                        </div> 
                        <div class="space"></div>
                        <div class="form-group">
                            <label for="">Servico</label>
                            <select class="form-input" v-model="usuario.s_id">
                                <option :value="0" disabled selected >Selecione</option>
                                <option :value="item.id" v-for="(item, index) in listServicos" :key="index">{{ item.description }}</option>
                            </select>
                        </div>  
                    </div>
                </div>
        </template>
        <template v-slot:footer>
            <button class="btn btn-color" v-on:click="cadastrarUsuario"> Salvar</button>
        </template>
       
    </ModalAdd>


    <ModalEdit
        v-show="isModalEditVisible"
        @close="closeModalEdit"
        >
        <template v-slot:header>
            Edit Usuário
        </template>

        <template v-slot:body>
            <div class="content-form">
                <div class="form-group">
                    <label for="">Nome *</label>
                    <input type="text" class="form-input" v-model="editUsuario.nome">
                </div>   
                <div class="form-row">
                    <div class="form-group">
                        <label for="">Login *</label>
                        <input type="text" class="form-input" v-model="editUsuario.login">
                    </div>
                    <div class="space"></div>
                    <div class="form-group">
                        <label for="">Serviço</label>
                        <select class="form-input" v-model="editUsuario.s_id">
                            <option :value="0" disabled selected >Selecione</option>
                            <option :value="item.id" v-for="(item, index) in listServicos" :key="index">{{ item.description }}</option>
                        </select>
                    </div>
                    
                </div>
                <div class="form-row">
                    <div class="form-group" style="width: 30%;" >
                        <div>Status *</div>
                        <div>
                            <input type="checkbox" id="check-edit-user" v-model="editUsuario.status"> 
                            <label for="check-edit-user"> {{ convertStatus(editUsuario.status) }}</label>
                        </div>
                    </div> 
                    <div class="space"></div>
                    <div class="form-group">
                        <label for="">Guichê</label>
                        <input type="text" class="form-input" v-model="editUsuario.guiche" >
                    </div>
                </div>
                <div class="form-group" >
                    <label for="">Nova Senha</label>
                    <input type="password" class="form-input" v-model="editUsuario.senha" >
                    <div style="font-size: 11px;">OBS: Se nenhuma senha for digitada, permancerá a senha atual</div>
                </div>
            </div>
        </template>

        <template v-slot:footer>
            <button class="btn btn-color" v-on:click="editarUsuario"> Salvar</button>
        </template>

       
    </ModalEdit>
    
</template>

<style scoped>
    section{
        width: calc(100vw - 250px);
        padding: 10px;
        display: flex;
        flex-direction: column;
    }
    .content-table{
        width: 100%;
    }
    .actions{
        margin-bottom: 10px;
    }

    
</style>