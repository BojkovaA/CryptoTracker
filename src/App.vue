<script setup>
import HomePageComponent from './components/HomePageComponent.vue';
import NavbarComponent from './components/NavbarComponent.vue';
import router from './router';

</script>

<template>
  
  <NavbarComponent/>
  <router-view></router-view>
  </template>

