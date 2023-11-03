<script>
import axios from "axios";
export default {
    data(){
        return {
            login: "",
            senha: "",
            message: ''
        }
    },
    methods: {
        async save(){
            try {
                let temp = {
                    login: this.login,
                    senha: this.senha
                }
                let con = await axios.post('http://192.168.102.168:3000/login', temp);
                if(con.status == 200){
                    localStorage.setItem('token', con.data.token)
                    let temp = {
                        nome: con.data.nome,
                        guiche: con.data.guiche,
                        id: con.data.id,
                        tipo: con.data.type,
                        servico: con.data.s_nome
                    }

                    localStorage.setItem('perfil', JSON.stringify(temp))

                    
                    switch (con.data.type) {
                        case "adm":
                            this.$router.push('/adm')
                            break;
                        case "atend":
                            this.$router.push('/atendimento')
                            break;
                        case "painel":
                            this.$router.push('/painel')
                            break;
                        case "triagem":
                            this.$router.push('/triagem')
                            break;
                    
                        default:
                            break;
                    }
                }
                
            } catch (error) {
                console.log(error)
                this.message = error.response.data.message

            }
        }
    }
}
</script>

<template>
    <section>
        <form @submit.prevent="save">
        <div class="center card">
                <h1>Login</h1>
                <div>
                    <div class="form-group">
                        <label for="">Login</label>
                        <input type="text" class="form-input" placeholder="Usuário" v-model="login">
                    </div>
                    <div class="form-group">
                        <label for="">Senha</label>
                        <input type="password" class="form-input" v-model="senha" placeholder="Senha">
                    </div>

                </div>
                <button class="btn">Entrar</button>
                <div>
                    <span class="text-danger">
                        {{ message }}
                    </span>
                </div>
            </div>

        </form>
    </section>
</template>

<style scoped>
    section{
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
        background-color: #f9f9f9;
    }
    .center{
        width: 300px;
        height: 300px;
        background-color: white;
        padding: 7px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
</style>