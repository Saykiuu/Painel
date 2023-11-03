
<template>
    <div class="sidebar">
        <div class="profile">
                <span class="title">{{ profile.nome }}</span>
        </div>
        <ul class="menu">
                <router-link :to="'/adm/usuarios'" v-slot="{ isActive}" ><li class="menu-item "> <div v-bind:class="isActive? 'actived' : ''"></div> Usuarios </li></router-link>
                <router-link :to="'/adm/servicos'" v-slot="{ isActive}" ><li class="menu-item "> <div v-bind:class="isActive? 'actived' : ''"></div> Serviços </li></router-link>
                <router-link :to="'/adm/style'" v-slot="{ isActive}" ><li class="menu-item "> <div v-bind:class="isActive? 'actived' : ''"></div> Configuração </li></router-link>

                <li class="menu-item" v-on:click="logout()"><div></div>Sair</li>
        </ul>
    </div>
</template>
<script>
    export default {
       
        data(){
            return {
                profile: {
                    nome: '',
                    id: '',
                    guiche : '',
                    servico: '',
                    tipo:''
                },
            }
        },

        methods: {
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
                if(this.profile.tipo != 'adm'){
                    this.logout()
                }
            }
            
        },

        created(){
            this.getInfos()
        }
        
    }
</script>
<style scoped>

    
    .sidebar{
        width: 230px;
        background-color: var(--color-main);
        height: 100vh;
    }

    a{
        text-decoration: none;
    }

    .profile{
        border-bottom: var(--border);
        border-color: #f1f1f1;
        color: #f1f1f1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        
    }

    .menu{
        margin: 10px;
        list-style: none;
    }

    .title{
        font-size: 18px;
    }

    li{
        border: var(--border);
        border-color: transparent;
        border-radius: 7px;
        margin-top: 10px;
        padding: 10px;
        text-align: left;
        position: relative;
        display: flex;
        align-items: center;
        color: white;
        cursor: pointer;
        text-decoration: none !important;
    }

    li::after{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 0%;
        height: 100%;
        transition: all 0.3s;
        content: '';
        border: solid 2px transparent;
    }

    li:hover::after {
        width: 30%;
        border-bottom: solid 1px #f1f1f1;
    }

    .actived {
        height: 7px;
        width: 7px;
        background-color: white;
        border-radius: 100%;
        transform: translateX(-10px);
    }
</style>