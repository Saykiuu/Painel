<script>

import ModalAdd from '@/components/ModalAdd.vue';
import ModalEdit from '@/components/ModalEdit.vue';

import axios from 'axios'
export default {
    data(){
        return {
            isModalVisible: false,
            isModalEditVisible: false,
            servico: {
                description: '', 
            },

            editServico :{
                id: 0,
                description: '',
                status: true
            },

            listServicos: [{
                id: 0,
                description: '',
                status: false
            }]
        }
    },
    methods: {
        showModal(){
            this.isModalVisible = true
        },

        closeModal(){
            this.servico = { description: '', guiche: ''}
            this.isModalVisible = false
          
        },

        showModalEdit(val){
            this.editServico = JSON.parse(JSON.stringify(val))
            this.isModalEditVisible = true
        },

        closeModalEdit(){
            this.servicoEdit = { description: '', guiche: '', status : true}
            this.isModalEditVisible = false
        },
        

        convertStatus(val){
            if(val) return "Ativo";
            else return "Inativo";
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

        async editarUsuario(){
            try {
                let usuario = localStorage.getItem('token');
                let con = await axios.post("http://192.168.102.168:3000/atualizar/servico", this.editServico , { headers: { Authorization: usuario }});
                if(con.status == 200){
                    this.getServico()        
                    this.closeModalEdit()        
                }
            } catch (error) {
                console.log(error)
                if(error.response?.status == 401){
                    localStorage.clear()
                    this.$router.push('/login')
                }
            }
        },

        async cadastrarServico(){
            try {
                let usuario = localStorage.getItem('token');
                let con = await axios.post("http://192.168.102.168:3000/cadastrar/servico", this.servico , { headers: { Authorization: usuario }});
                if(con.status == 200){
                    this.getServico()        
                    this.closeModal()        
                }
            } catch (error) {
                console.log(error)
                if(error.response?.status == 401){
                    sessionStorage.clear()
                    this.$router.push('/login')
                }
            }
        }

    },
    components: { ModalAdd, ModalEdit},

    created(){
        this.getServico()
    }
}

</script>

<template>
    <section>
        <div class="actions">
            <button class="btn" v-on:click="showModal()">Adicionar</button>
        </div>
        <div class="content-table">
            <table class="customers">
                <thead>
                    <tr>
                        <th>Descricão</th>
                        <th>status</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in listServicos" :key="index">
                        <td>{{ item.description }}</td>
                        <td>{{ convertStatus(item.status) }}</td>
                        <td><span class="material-icons btn" style="padding: 3px;"  v-on:click="showModalEdit(item)">
                                edit
                            </span></td>
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
            Novo Serviço
        </template>

        <template v-slot:body>
            <form @submit.prevent="cadastrarServico">
                <div class="content-form">
                    <div class="form-group">
                        <label for="">Descricão *</label>
                        <input type="text" class="form-input" v-model="servico.description">
                    </div>   
                </div>
                <button class="btn btn-color"> Salvar</button>
            </form>
        </template>
    </ModalAdd>

    <ModalEdit
        v-show="isModalEditVisible"
        @close="closeModalEdit"
        >
        <template v-slot:header>
            Edit Serviço
        </template>

        <template v-slot:body>
            <div class="content-form">
                <div class="form-group">
                    <label for="">Descrição *</label>
                    <input type="text" class="form-input" v-model="editServico.description">
                </div>   
                <div class="form-group" >
                    <div>Status *</div>
                    <div>
                    <input type="checkbox" id="check-edit-serv" v-model="editServico.status"> <label for="check-edit-serv"> {{ convertStatus(editServico.status) }}</label>
                    </div>
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