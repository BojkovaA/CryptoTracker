<script setup>
import { ref, onMounted } from "vue";
import { Line } from "vue-chartjs";
import ChartService from "../service/chartService";
import { Chart, registerables } from "chart.js";
import { useCoinsStore } from "../store/coinsStore";
import { computed } from "vue";
Chart.register(...registerables);


const coinsStore = useCoinsStore();

const topCoins = computed(() => {
  return [...coinsStore.coinDataTop50].sort((a,b) => parseFloat(b.volumeUsd24Hr) - parseFloat(a.volumeUsd24Hr)).slice(0, 4).map((coin)=> coin.symbol);
})

const coinColors2 = ref({})

const colors = [
  "rgba(75, 192, 192, 0.5)",  
  "rgba(54, 162, 235, 0.5)",  
  "rgba(255, 99, 132, 0.5)",  
  "rgba(255, 206, 86, 0.5)",  
]

console.log(topCoins.value);


const selectedCoinData = ref("1DAY");  

const chartData = ref({});

topCoins.value.forEach((coin) => {
  if (coinColors2.value[coin]) {
    chartData.value[coin] = {
      labels: [], 
      datasets: [
        {
          label: `${coin} Цена во USD`,
          backgroundColor: coinColors2.value[coin].backgroundColor,
          borderColor: coinColors2.value[coin].borderColor,
          borderWidth: 2,
          fill: true,
          data: [],
        },
      ],
    };
  }
});


const chartOptions = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: true,
  },
  plugins: {
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: true,
      callbacks: {
        label: function (context) {
          return `Price: $${context.parsed.y.toFixed(2)}`;
        },
      },
    },
  },
  scales: {
    x: { display: false },
    y: { display: true },
  },
};

const fetchChartData = async () => {
  for (const coin of topCoins.value) {
    try {
      const response = await ChartService.getChart(coin, selectedCoinData.value);
      
      if (response.data && response.data.length > 0) {
        const prices = response.data.map((entry) => ({
          date: new Date(entry.time_period_start).toLocaleTimeString(),
          price: entry.rate_close,
        }));


        chartData.value[coin] = {
          labels: prices.map((entry) => entry.date),
          datasets: [
            {
              label: `${coin} Цена во USD`,
              backgroundColor: coinColors2.value[coin].backgroundColor,  
              borderColor: coinColors2.value[coin].borderColor,
              borderWidth: 2,
              fill: true,
              data: prices.map((entry) => entry.price),
            },
          ],
        };
      } else {
        console.error(`There is no data for ${coin}`);
      }
    } catch (error) {
      console.error("Error fetching chart data for " + coin, error);
    }
  }
};

onMounted(()=>{
  topCoins.value.forEach((coin, index) => {
    coinColors2.value[(coin)] = {
      backgroundColor: colors[index],  
      borderColor: colors[index].replace("0.5", "1"),
    }
  })

  fetchChartData();
});
</script>

<template>
  <div className="bg-[#1B2028] rounded-[10px] p-[20px] w-[1000px] flex flex-wrap justify-around">
    <h1 className="font-bold text-white w-full text-center mb-4 text-3xl">Today's most popular coins chart</h1>
    <div v-for="coin in topCoins" :key="coin" className="w-[45%] mb-6">
      <h2 className="text-white font-bold text-center mb-2">{{ coin }} Price</h2>
      <Line v-if="chartData[coin] && chartData[coin].labels.length > 0" :data="chartData[coin]" :options="chartOptions" />
      <p v-else className="text-white text-center">Error fetching chart data for {{ coin }}</p>
    </div>
  </div>
</template>
