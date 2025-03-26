<script setup>
import { onMounted, ref } from "vue";
import CoinService from "../service/CoinService";
import { useRouter } from "vue-router";

const isLoggedIn = ref(false);

const coinData = ref([]);
const isLoading = ref(true);
const router = useRouter();

const fetchAllCoinsData = async () => {
  const myCoins = ["BTC", "DOGE", "ETH", "SOL", "LTC"];
  try {
    const response = await CoinService.getCoins();
    coinData.value = response.data.data.filter((coin) =>
      myCoins.includes(coin.symbol)
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchAllCoinsData);
</script>

<template>
  <div
    class="relative bg-[#1B2028] w-[400px] rounded-[10px] p-[20px] ml-[50px] h-[636px] pt-[30px] overflow-hidden">

    <h1 class="text-white font-bold text-2xl">My Portfolio</h1>

    <div v-if="!isLoggedIn" class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10">
      <p class="text-lg font-semibold text-white">
        <router-link to="/login" class="text-logoBlue font-bold text-xl hover:underline">
        Sign in
      </router-link>
         to access your portfolio.</p>
      
      <p class="text-sm text-gray-400 mt-2">
        or
        <router-link to="/register" class="text-logoBlue hover:underline">
          register
        </router-link>
        to get your own.
      </p>
    </div>

    <div :class="{ 'blur-md': !isLoggedIn }" class="relative">
      <div
        v-for="coin in coinData"
        :key="coin.id"
        class="flex gap-[10px] pt-[20px] text-white"
      >
        <div>
          <img :src="`/static/${coin.symbol.toLowerCase()}.png`" />
        </div>
        <div class="flex gap-[80px]">
          <div class="w-[75px]">
            <h1>{{ coin.name }}</h1>
            <h3 class="text-[#454151]">{{ Number(coin.priceUsd).toFixed(2) }}</h3>
          </div>
          <div class="flex flex-col">
            <p
              :class="
                coin.changePercent24Hr < 0
                  ? 'font-bold text-red-500'
                  : 'font-bold text-[#1ECB4F]'
              "
            >
              {{ Number(coin.changePercent24Hr).toFixed(2) }}%
            </p>
            <h3>0.12543 ETH</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
