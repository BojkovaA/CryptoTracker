<script setup>
import { useRoute } from 'vue-router'
import { useCoinsStore } from '../store/coinsStore'
import { onMounted, ref } from 'vue'
import { Line } from "vue-chartjs";
import ChartService from "../service/chartService";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const route = useRoute()
const coinName = route.params.coinName

const coin = useCoinsStore().coinDataTop50.find((coin) => coin.name === coinName)

const chartData = ref({});

const selectedCoinData = ref("1MTH");


const chartOptions = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: true,
  },
  plugins: {
    tooltip: {
      enabled: true,
      mode: "index",
      intersect: true,
      callbacks: {
        label: function (context) {
          return `Price: $${context.parsed.y.toFixed(2)}`;
        },
      },
    },
  },
  scales: {
    x: { display: true },
    y: { display: true },
  },
};

const fetchChartData = async () => {
  try {
    const response = await ChartService.getChart(coin.id, selectedCoinData.value);
    const chartArray = response.data?.data;

    if (chartArray && chartArray.length > 0) {
      const prices = chartArray.map((entry) => ({
        rawDate: new Date(entry.date),
        date: new Date(entry.date).toLocaleTimeString(),
        price: parseFloat(entry.priceUsd),
      }));

      prices.sort((a, b) => a.rawDate - b.rawDate);
      const horizontalThreshold = prices[0].price;

      console.log(horizontalThreshold);
      const labels = prices.map((entry) => entry.date);

      const aboveThreshold = prices.map(p => p.price > horizontalThreshold ? p.price : null);
      const belowThreshold = prices.map(p => p.price <= horizontalThreshold ? p.price : null);

      chartData.value[coin.id] = {
        labels,
        datasets: [
          {
            label: `${coin.symbol} (Above Threshold)`,
            backgroundColor: "rgba(30, 203, 79, 0.3)",
            borderColor: "#1ECB4F",
            data: aboveThreshold,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 6,
            fill: false,
          },
          {
            label: `${coin.symbol} (Below Threshold)`,
            backgroundColor: "rgba(239, 68, 68, 0.3)",
            borderColor: "#EF4444",
            data: belowThreshold,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 6,
            fill: false,
          },
          {
            label: `Threshold (${horizontalThreshold})`,
            data: new Array(labels.length).fill(horizontalThreshold),
            borderColor: "#FFD700",
            borderWidth: 1,
            borderDash: [10, 5],
            pointRadius: 0,
            fill: false,
          },
        ],
      };
    } else {
      console.error(`There is no chartArray data for ${coin.id}`);
    }
  } catch (error) {
    console.error("Error fetching chart data for " + coin.id, error);
  }
};

onMounted(() => {
  if (coin && coin.id) {
    fetchChartData();
  } else {
    console.warn("Coin not found");
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-white font-bold text-3xl mb-4">Invest in {{ coinName }}</h1>

      <h1 class="text-white">{{ coin.symbol }}</h1>
      <h2 class="text-white">${{ coin.priceUsd }}</h2>
      <p
        :class="
          coin.changePercent24Hr < 0
            ? 'font-bold text-red-500'
            : 'font-bold text-[#1ECB4F]'
        "
      >
        {{ Number(coin.changePercent24Hr).toFixed(2) }}%
      </p>

      <div
        v-if="coin && chartData[coin.id]"
        class="w-[1000px] bg-[#1B2028] rounded-[10px] p-[20px] mt-6 mb-6"
      >
        <Line :data="chartData[coin.id]" :options="chartOptions" />
      </div>

      <div class="flex justify-center gap-4">
        <button class="bg-[#1ECB4F] text-white px-5 py-2 rounded-lg font-bold">
          Buy
        </button>
        <button class="bg-red-500 text-white px-5 py-2 rounded-lg font-bold">
          Sell
        </button>
      </div>
    </div>
  </div>
</template>
