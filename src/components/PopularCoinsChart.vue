<script setup>
import { ref, onMounted } from "vue";
import { Line } from "vue-chartjs";
import ChartService from "../service/chartService";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const coins = ref(["BTC", "LTC", "ETH", "SOL"]);
const selectedCoinData = ref("1DAY");  

const chartData = ref({});

const coinColors = {
  BTC: {
    backgroundColor: "rgba(75, 192, 192, 0.5)",  
    borderColor: "rgba(75, 192, 192, 1)",  
  },
  LTC: {
    backgroundColor: "rgba(54, 162, 235, 0.5)", 
    borderColor: "rgba(54, 162, 235, 1)",  
  },
  ETH: {
    backgroundColor: "rgba(255, 99, 132, 0.5)",  
    borderColor: "rgba(255, 99, 132, 1)",  
  },
  SOL: {
    backgroundColor: "rgba(255, 206, 86, 0.5)",  
    borderColor: "rgba(255, 206, 86, 1)",  
  },
};

coins.value.forEach((coin) => {
  chartData.value[coin] = {
    labels: [],
    datasets: [
      {
        label: `${coin} Цена во USD`,
        backgroundColor: coinColors[coin].backgroundColor, 
        borderColor: coinColors[coin].borderColor,  
        borderWidth: 2,
        fill: true,
        data: [],
      },
    ],
  };
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
  for (const coin of coins.value) {
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
              backgroundColor: coinColors[coin].backgroundColor,  
              borderColor: coinColors[coin].borderColor,
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

onMounted(fetchChartData);
</script>

<template>
  <div className="bg-[#1B2028] rounded-[10px] p-[20px] w-[1000px] flex flex-wrap justify-around">
    <h1 className="font-bold text-white w-full text-center mb-4 text-3xl">Today's most popular coins chart</h1>
    <div v-for="coin in coins" :key="coin" className="w-[45%] mb-6">
      <h2 className="text-white font-bold text-center mb-2">{{ coin }} Price</h2>
      <Line v-if="chartData[coin] && chartData[coin].labels.length > 0" :data="chartData[coin]" :options="chartOptions" />
      <p v-else className="text-white text-center">Error fetching chart data for {{ coin }}</p>
    </div>
  </div>
</template>
