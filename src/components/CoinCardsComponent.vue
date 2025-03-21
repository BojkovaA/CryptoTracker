<script setup>
import 'vue3-carousel/carousel.css';
import { ref, onMounted, onBeforeMount } from "vue";
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import 'primeicons/primeicons.css'


const myCoins = ['BTC', 'DOGE', 'ETH', 'SOL', 'LTC'];

const config = {
  height: 450,
  itemsToShow: 4,
  gap: 5,
  breakpoints: {
    320: { itemsToShow: 1 },
    768: { itemsToShow: 2 },
    1024: { itemsToShow: 3 },
    1280: { itemsToShow: 4 },
  },
  wrapAround: true,
};
</script>

<template>
<Carousel v-bind="config" :loop="true" :navigation="true" :pagination="true">
    <Slide v-for="coin in myCoins" :key="coin">
      <div class="bg-[#1B2028] w-[300px] rounded-[10px] p-[20px] transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg group">
        <div class="flex gap-[10px] items-center mb-[10px]">
          <img :src="`/static/${coin.toLowerCase()}.png`" alt="icon" class="w-12" />
          <div>
            <h3 class="font-bold text-white">{{ coin }}</h3>
            <span class="text-white">CryptoCurrency</span>
          </div>
        </div>
        <hr class=" mt-[10px]">
        <div class=" items-center mt-[10px] text-white">
          
          <h4 class="text-gray-400 mt-[30px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit sit vitae donec aliquam pretium sociis ultrices aenean faucibus congue mattis penatibus malesuada convallis.</h4>
          <router-link >Invest in {{ coin }} <span class=" mt-[20px] pi pi-arrow-right transition-transform duration-300 group-hover:translate-x-[5px]"></span></router-link>
        </div>
      </div>
    </Slide>

    <template #addons>
      <Navigation />
      <Pagination />
    </template>
    
  </Carousel>

</template>