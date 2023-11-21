
import { createRouter, createWebHashHistory  } from "vue-router";
import LoginViewVue from "@/view/LoginView.vue";
import painelVuewVue from "@/view/painelVuew.vue";
import AtenViewVue from "@/view/AtenView.vue";
import AdmViewVue from "@/view/AdmView.vue";
import ServicosViewVue from "@/view/ServicosView.vue";
import UsuariosViewVue from "@/view/UsuariosView.vue";
import NotFound from "@/view/NotFound.vue"
import TriagemViewVue from "@/view/TriagemView.vue";
import StyleViewVue from "@/view/StyleView.vue";

const routes = [
    {path: '', redirect: 'login'},
    {path: '/login', name: 'login', component: LoginViewVue},
    {path: '/painel', name: 'painel', component: painelVuewVue},
    {path: '/triagem', name: 'triagem', component: TriagemViewVue},
    {path: '/atendimento', name: 'atendimento', component: AtenViewVue},
    {
        path: '/adm', 
        name: 'admin', 
        component: AdmViewVue,
        children: [
            { path: '/', redirect: 'adm/usuarios'},
            { path: 'usuarios', component: UsuariosViewVue},
            { path: 'servicos', component: ServicosViewVue},
            { path: 'style', component: StyleViewVue}
        ]
    },
    { path: '/404', component: NotFound}
]
const router = createRouter({
    history: createWebHashHistory(''),
    routes,

});

export default router