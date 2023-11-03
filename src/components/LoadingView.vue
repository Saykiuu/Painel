<script>
    export default {
        
    }
</script>

<template>
    <div class="bg-load">
        <div class="container-ld">
            <div class="icon letter2">
                <svg version="1.0" viewBox="0 0 64 64">
                    <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
                    fill="#000000" stroke="none">
                        <path d="M60 320 l0 -320 75 0 75 0 2 167 3 168 109 -168 109 -167 74 0 73 0
                        0 320 0 320 -75 0 -75 0 -2 -172 -3 -173 -110 172 -110 172 -72 1 -73 0 0
                        -320z"/>
                    </g>
                </svg>
            </div>
            <div class="icon letter3">
                <svg version="1.0" viewBox="0 0 64 64">

                    <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
                    fill="#000000" stroke="none">
                    <path d="M60 570 l0 -70 90 0 90 0 0 -250 0 -250 80 0 80 0 0 250 0 250 90 0
                    90 0 0 70 0 70 -260 0 -260 0 0 -70z"/>
                    </g>
                </svg>
            </div>
            <div class="icon letter1">
                <svg version="1.0" viewBox="0 0 64 64">
                    <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
                    fill="#000000" stroke="none">
                    <path d="M240 320 l0 -320 80 0 80 0 0 320 0 320 -80 0 -80 0 0 -320z"/>
                    </g>
                </svg>
            </div>
        </div>
    </div>

</template>

<style scoped>
    .bg-load{
        background-color: #00000020;
    }
    .container-ld{
        position: relative;
        width: 200px;
        height: 200px;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container-ld .icon{
        width: 50px;
    }

    .container-ld .icon path{
        fill: transparent;
        stroke-width: 40;
        stroke: var(--color-main);
    }

    .container-ld .icon.letter1 path {
        stroke-dasharray: 300;
        stroke-dashoffset: 100;
        animation: initletter1 4s linear infinite;
    }

    .container-ld .icon.letter2 path {
        stroke-dasharray: 610;
        stroke-dashoffset: 200;
        animation: initletter2 4s linear infinite;
    }

    .container-ld .icon.letter3 path {
        stroke-dasharray: 400;
        stroke-dashoffset: 100;
        animation: initletter3 4s linear infinite;
    }

    @keyframes initletter1 {
        0% {
            stroke-dashoffset: 0;
        }
        100% {
            stroke-dashoffset: 4900;
        }
    }

    @keyframes initletter3 {
        0% {
            stroke-dashoffset: 0;
        }
        100% {
            stroke-dashoffset: 3200;
        }
    }

    @keyframes initletter2 {
        0% {
            stroke-dashoffset: 0;
        }
        100% {
            stroke-dashoffset: 3660;
        }
    }

    
</style>