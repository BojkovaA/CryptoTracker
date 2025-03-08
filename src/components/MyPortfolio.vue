<script setup>
import { onMounted } from "vue";
import CoinService from "../service/CoinService";
import { ref } from "vue";
const coinData = ref([]);
const fetchAllCoinsData = async () => {
    const myCoins = ['BTC', 'DOGE', 'ETH', 'SOL', 'LTC'];
    try{
        const response = await CoinService.getCoins();
        coinData.value = response.data.data.filter((coin) => myCoins.includes(coin.symbol));
    }catch(error){
        console.error("Грешка при вчитување на податоците:", error);
    }
}

onMounted(fetchAllCoinsData);

</script>
<template>
    <div  className="bg-[#1B2028] w-[400px] rounded-[10px] p-[20px] ml-[50px] h-[458px] pt-[30px] h-[636px]">
        <h1 className="text-white font-bold text-2xl">My Portfolio</h1>
        <div v-for="coin in coinData" className="flex gap-[10px] pt-[20px] text-white ">
            <div>
                <img :src="`/static/${coin.symbol.toLowerCase()}.png`">
            </div>
            <div className="flex gap-[80px]">
                <div class="w-[75px]">
                    <h1>{{coin.name}}</h1>
                    <h3 className="text-[#454151]">{{Number(coin.priceUsd).toFixed(2)}}</h3>
                </div>
                <div class="flex flex-col">
                    <p  :class="(coin.changePercent24Hr) < 0 ? 'font-bold text-red-500' : 'font-bold text-[#1ECB4F]'">{{ Number(coin.changePercent24Hr).toFixed(2)}}%</p>
                    <h3>0.12543 ETH</h3>
                </div>
            </div>
        </div>
    </div>
</template>