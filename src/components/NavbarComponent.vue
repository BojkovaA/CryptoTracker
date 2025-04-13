<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { auth } from '../firebase/firebase'; // Tvoj Firebase config
import { onAuthStateChanged } from 'firebase/auth';

const route = useRoute();
const user = ref(null);

onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      user.value = firebaseUser; 
    } else {
      user.value = null;
    }
  });
});

const logout = async() => {
    try {
    await auth.signOut(); 
    user.value = null;
  } catch (error) {
    console.error("Error logouting:", error);
  }
};
</script>

<template>
    <div className="h-full lg:h-[100px] flex items-center py-[10px] bg-[#1B2028]">
      <div className="container mx-auto max-w-7xl flex justify-between items-center flex-col lg:flex-row gap-[10px]">
        
        <!-- Logo -->
        <div className="flex items-center gap-[10px]">
          <img src="/src/static/logo2.png" class="w-11">
          <router-link to="/" class="font-bold text-lightGray text-2xl">Crypto Tracker</router-link>
        </div>
  
        <!-- Search bar -->
        <div v-if="route.path === '/'" class="bg-[#454151] rounded-[20px]">
          <input
            type="text"
            placeholder="Search.."
            className="bg-transparent outline-none px-[30px] py-[15px] rounded-[20px] placeholder:text-mainYellow text-mainPurple"
          />
          <button className="bg-lightGray px-[30px] py-[15px] rounded-[20px] text-textWhite">
            Search
          </button>
        </div>
  
        <!-- Right section -->
        <div className="flex items-center gap-[10px]">
          <template v-if="user">
            <p class="text-textWhite font-semibold">Hi, {{ user.displayName }}!</p>
            <button @click="logout" class="text-red-400 hover:text-red-600">Logout</button>
          </template>
  
          <template v-else>
            <template v-if="route.path === '/'">
              <router-link
                to="/login"
                class="bg-lightGray text-textWhite px-[20px] py-[10px] rounded-[20px]"
              >
                Sign in
              </router-link>
              <router-link
                to="/register"
                class="bg-lightGray text-textWhite px-[20px] py-[10px] rounded-[20px]"
              >
                Register
              </router-link>
            </template>
  
            <template v-else-if="route.path === '/login'">
              <router-link
                to="/register"
                class="bg-lightGray text-textWhite px-[20px] py-[10px] rounded-[20px]"
              >
                Register
              </router-link>
            </template>
  
            <template v-else-if="route.path === '/register'">
              <router-link
                to="/login"
                class="bg-lightGray text-textWhite px-[20px] py-[10px] rounded-[20px]"
              >
                Sign in
              </router-link>
            </template>
          </template>
        </div>
      </div>
    </div>
  </template>
  