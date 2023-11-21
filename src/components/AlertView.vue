
<script>
    export default{
        
        data(){
            return { }
        },
        props: ['alert'],
       
    }
</script>



<template>
    <div class="alert" :style=" alert.tipo? {'background-color': '#d4edda', 'color': '#155724'}: {'background-color': '#f8d7da', 'color': '#721c24'}" >
        <div>
            <div class="title">{{ alert.title }}</div>
            <div class="mensagem">{{ alert.message }}</div>
        </div>
    </div>
</template>

<style scoped>
    .alert{
        position: fixed;
        top: 5px;
        left: 20px;
        right: 20px;
        border-radius: 35px;
        padding: 5px 20px;
        font-size: 18px;
        box-shadow: 5px 5px 20px #000000d8;
        transform: translateY(-160%);
        animation: show 4s;
    }

    @keyframes show {
        20% {
            transform: translateY(0);
        }

        80% {
            transform: translateY(0%);
        }

        100% {
            transform: translateY(-160%);
        }
    }

</style>

