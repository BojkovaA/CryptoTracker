<script setup>

import { ref, onMounted } from "vue";
import CoinService from '../service/CoinService';

const coinData = ref([]);

const fetchAllCoinsData = async () => {
  try {

    const myCoins = ['BTC', 'DOGE', 'ETH', 'SOL', 'LTC'];


    const response = await CoinService.getCoins(); 
    const cryptoCoins = response.data.data.filter((coin) => myCoins.includes(coin.symbol)); 
    
    
    console.log("live market", cryptoCoins)

   

   

    coinData.value = cryptoCoins
  } catch (error) {
    console.error("Грешка при вчитување на податоците:", error);
  }
};


onMounted(() => {
  fetchAllCoinsData();
});
</script>
<template>
    <div class="bg-[#1B2028] w-full rounded-[10px] p-[20px] mt-[20px] mx-auto max-w-7xl">
        <h1 class="text-white font-bold text-3xl">Live Market</h1>
        <div class="grid grid-cols-5 gap-4 mt-[20px] text-gray-400">
            <p>Coin</p>
            <p>Change</p>
            <p>Marekt Cup</p>
            <p>24h Volume</p>
            <p>Price</p>
        </div>
        <div v-for="coin in coinData" class="grid grid-cols-5 gap-4 mt-[20px] text-gray-300">
            <p>{{ coin.name }}</p>
            <p  :class="(coin.changePercent24Hr) < 0 ? 'font-bold text-red-500' : 'font-bold text-[#1ECB4F]'">{{ Number(coin.changePercent24Hr).toFixed(2)}}%</p>
            <p>${{ Number(coin.marketCapUsd).toFixed(0) }}M</p>
            <p>${{ Number(coin.volumeUsd24Hr).toFixed(0)}}M</p>
            <p>${{ Number(coin.priceUsd).toFixed(0) }}</p>
        </div>

        <div>

        </div>
    </div>
</template>