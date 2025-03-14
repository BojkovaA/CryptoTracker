import HomePageComponent from "../components/HomePageComponent.vue";
import LoginComponent from "../components/LoginComponent.vue";
import RegisterComponent from "../components/RegisterComponent.vue";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
    {path: '/', component: HomePageComponent},
    {path: '/login', component: LoginComponent},
    {path: '/register', component: RegisterComponent},
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  });

export default router;
