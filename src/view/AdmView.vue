<script>
import SideNav from '@/components/SideNav.vue';
export default {
    data(){
        return {
            usuario:"",
        }
    },
    methods: {
        getUsuario(){
           this.usuario =  localStorage.getItem('nome')
        }
    },
    created(){
        this.getUsuario()
    },
    components: {SideNav}
}
</script>

<template>
    <section>
        <SideNav :usuario="usuario" ></SideNav>
        <RouterView></RouterView>
    </section>
    
    
</template>
<style scoped>
    section{
        display: flex;
    }
</style>