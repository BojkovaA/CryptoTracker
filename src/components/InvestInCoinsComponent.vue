<script setup>
import { useRoute } from 'vue-router'
import { useCoinsStore } from '../store/coinsStore'
import { onMounted, ref, watch } from 'vue'
import { Line } from "vue-chartjs"
import ChartService from "../service/chartService"
import { Chart, registerables } from "chart.js"
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, collection, getDocs, updateDoc, query, where, } from "firebase/firestore";

Chart.register(...registerables)

const route = useRoute()
const coinName = route.params.coinName
const coin = useCoinsStore().coinDataTop50.find((coin) => coin.name === coinName)

const chartData = ref({})
const selectedCoinData = ref("1MTH")

const chartOptions = {
  responsive: true,
  interaction: { mode: "index", intersect: true },
  plugins: {
    tooltip: {
      enabled: true,
      mode: "index",
      intersect: true,
      callbacks: {
        label: function (context) {
          return `Price: $${context.parsed.y.toFixed(2)}`
        },
      },
    },
  },
  scales: {
    x: { display: true },
    y: { display: true },
  },
}

const fetchChartData = async () => {
  try {
    const response = await ChartService.getChart(coin.id, selectedCoinData.value)
    const chartArray = response.data?.data

    if (chartArray && chartArray.length > 0) {
      const prices = chartArray.map((entry) => ({
        rawDate: new Date(entry.date),
        date: new Date(entry.date).toLocaleTimeString(),
        price: parseFloat(entry.priceUsd),
      }))

      prices.sort((a, b) => a.rawDate - b.rawDate)
      const horizontalThreshold = prices[0].price
      const labels = prices.map((entry) => entry.date)

      const aboveThreshold = prices.map(p => p.price > horizontalThreshold ? p.price : null)
      const belowThreshold = prices.map(p => p.price <= horizontalThreshold ? p.price : null)

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
      }
    } else {
      console.error(`There is no chartArray data for ${coin.id}`)
    }
  } catch (error) {
    console.error("Error fetching chart data for " + coin.id, error)
  }
}

onMounted(() => {
  if (coin && coin.id) {
    fetchChartData()
  } else {
    console.warn("Coin not found")
  }
})

const showBuyModal = ref(false)
const showSellModal = ref(false)
const buyMode = ref("amount")
const inputValue = ref("")
const calculatedValue = ref(0)
const currentBalance = ref(0)
const successMessage = ref("")
const countdown = ref(10)
const countdownActive = ref(false) 
const showCountdownModal = ref(false)

const startCountdown = () => {
  countdown.value = 10
  countdownActive.value = true
  showCountdownModal.value = true

  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(interval)
      closeCountdownModal()
    }
  }, 1000)
}

// Function to close the countdown modal manually
const closeCountdownModal = () => {
  countdownActive.value = false
  showCountdownModal.value = 
  successMessage.value = ""
}


const openBuyModal = async () => {
  showBuyModal.value = true
  inputValue.value = ""
  calculatedValue.value = 0
  buyMode.value = "amount"
  successMessage.value = ""
  await fetchBalance()
}

const openSellModal = async () => {
  showSellModal.value = true
  inputValue.value = ""
  calculatedValue.value = 0
  successMessage.value = ""
  await fetchBalance()
}

const fetchBalance = async () => {
  const user = auth.currentUser
  if (!user) return

  const coinRef = collection(db, 'users', user.uid, 'cryptoCoins')
  const q = query(coinRef, where("coinId", "==", coin.id))
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    const existingDoc = snapshot.docs[0]
    const data = existingDoc.data()
    currentBalance.value = data.amountOwned
  }
}

const closeModal = () => {
  showBuyModal.value = false
  showSellModal.value = false
}

watch([inputValue, buyMode], () => {
  const input = parseFloat(inputValue.value)
  const price = parseFloat(coin.priceUsd)
  if (!isNaN(input)) {
    calculatedValue.value =
      buyMode.value === "amount" ? input * price : input / price
  } else {
    calculatedValue.value = 0
  }
})

const confirmBuy = async () => {
  const user = auth.currentUser
  const price = parseFloat(coin.priceUsd)
  const input = parseFloat(inputValue.value)

  if (!user || isNaN(input) || input <= 0) {
    alert("Enter a valid value")
    return
  }

  const amountToBuy = buyMode.value === "amount" ? input : input / price
  const valueUsd = amountToBuy * price

  const coinRef = collection(db, 'users', user.uid, 'cryptoCoins')
  const q = query(coinRef, where("coinId", "==", coin.id))
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    const existingDoc = snapshot.docs[0]
    const data = existingDoc.data()

    const updatedAmount = data.amountOwned + amountToBuy
    const updatedValue = updatedAmount * price

    await updateDoc(doc(db, 'users', user.uid, 'cryptoCoins', existingDoc.id), {
      amountOwned: updatedAmount,
      valueUsd: updatedValue
    })
  } else {
    const newDoc = doc(coinRef)
    await setDoc(newDoc, {
      coinId: coin.id,
      coinName: coin.name,
      symbol: coin.symbol,
      amountOwned: amountToBuy,
      valueUsd: valueUsd
    })
  }

  successMessage.value = `You successfully bought ${amountToBuy.toFixed(8)} ${coin.symbol} for $${valueUsd.toFixed(2)}`
  
  startCountdown()
}

const confirmSell = async () => {
  const user = auth.currentUser
  const price = parseFloat(coin.priceUsd)
  const input = parseFloat(inputValue.value)

  if (!user || isNaN(input) || input <= 0) {
    alert("Enter a valid value")
    return
  }

  const coinRef = collection(db, 'users', user.uid, 'cryptoCoins')
  const q = query(coinRef, where("coinId", "==", coin.id))
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    const existingDoc = snapshot.docs[0]
    const data = existingDoc.data()

    const updatedAmount = data.amountOwned - input
    const updatedValue = updatedAmount * price

    if (updatedAmount < 0) {
      alert("You don't have enough balance to sell")
      return
    }

    await updateDoc(doc(db, 'users', user.uid, 'cryptoCoins', existingDoc.id), {
      amountOwned: updatedAmount,
      valueUsd: updatedValue
    })

    successMessage.value = `You successfully sold ${input.toFixed(8)} ${coin.symbol} for $${(input * price).toFixed(2)}`

    startCountdown()

  } else {
    alert("You don't own this coin")
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-white font-bold text-3xl mb-4">Invest in {{ coinName }}</h1>
      <h1 class="text-white">{{ coin.symbol }}</h1>
      <h2 class="text-white">${{ Number(coin.priceUsd).toFixed(2) }}</h2>
      <p
        :class="coin.changePercent24Hr < 0 ? 'font-bold text-red-500' : 'font-bold text-[#1ECB4F]'"
      >
        {{ Number(coin.changePercent24Hr).toFixed(2) }}%
      </p>

      <div
        v-if="coin && chartData[coin.id]"
        class="w-[1000px] bg-[#1B2028] rounded-[10px] p-[20px] mt-6 mb-6"
      >
        <Line :data="chartData[coin.id]" :options="chartOptions" />
      </div>

      <div class="flex justify-center gap-4 mb-4">
        <button @click="openBuyModal" class="bg-[#1ECB4F] text-white px-5 py-2 rounded-lg font-bold">
          Buy
        </button>
        <button @click="openSellModal" class="bg-red-500 text-white px-5 py-2 rounded-lg font-bold">
          Sell
        </button>
      </div>

      <!-- Buy Modal -->
      <div v-if="showBuyModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="bg-[#1B2028] rounded-2xl p-6 w-[400px] text-white relative">
          <div class="flex justify-between items-start mb-4">
            <div class="flex flex-col items-start">
              <h2 class="text-xl font-bold">Buy {{ coin.symbol }}</h2>
              <h3 class="text-sm text-gray-300 mt-1">Current Price: ${{ Number(coin.priceUsd).toFixed(2) }}</h3>
              <p class="mt-2">Current Balance: {{ currentBalance }} {{ coin.symbol }}</p>
            </div>
            <button @click="closeModal" class="text-xl">&times;</button>
          </div>

          <div class="flex justify-center gap-4 mb-4">
            <button
              @click="buyMode = 'amount'"
              :class="buyMode === 'amount' ? 'bg-[#1ECB4F]' : 'bg-gray-700'"
              class="px-4 py-2 rounded-full font-bold w-1/2"
            >
              By Amount
            </button>
            <button
              @click="buyMode = 'usd'"
              :class="buyMode === 'usd' ? 'bg-[#1ECB4F]' : 'bg-gray-700'"
              class="px-4 py-2 rounded-full font-bold w-1/2"
            >
              By USD
            </button>
          </div>

          <div class="mb-4">
            <input
              v-model="inputValue"
              type="number"
              placeholder="Enter value"
              class="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
          </div>

          <div class="mb-6 text-center">
            <p v-if="buyMode === 'amount'">
              You will pay: ${{ calculatedValue.toFixed(2) }}
            </p>
            <p v-else>
              You will receive: {{ calculatedValue.toFixed(6) }} {{ coin.symbol }}
            </p>
          </div>

          <button
            @click="confirmBuy"
            class="w-full bg-[#1ECB4F] hover:bg-green-600 text-white font-bold py-2 rounded-lg"
          >
            Confirm Purchase
          </button>
        </div>
      </div>

      <!-- Sell Modal -->
      <div v-if="showSellModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="bg-[#1B2028] rounded-2xl p-6 w-[400px] text-white relative">
          <div class="flex justify-between items-start mb-4">
            <div class="flex flex-col items-start">
              <h2 class="text-xl font-bold">Sell {{ coin.symbol }}</h2>
              <h3 class="text-sm text-gray-300 mt-1">Current Price: ${{ Number(coin.priceUsd).toFixed(2) }}</h3>
              <p class="mt-2">Current Balance: {{ currentBalance }} {{ coin.symbol }}</p>
            </div>
            <button @click="closeModal" class="text-xl">&times;</button>
          </div>

          <div class="mb-4">
            <input
              v-model="inputValue"
              type="number"
              placeholder="Enter value"
              class="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
          </div>
          
          <button
            @click="inputValue = currentBalance"
            class="w-full bg-gray-700 text-white font-bold py-2 rounded-lg"
          >
            ALL
          </button>

          <div class="mb-6 text-center">
            <p>
              You will receive: ${{ (inputValue * coin.priceUsd).toFixed(2) }}
            </p>
          </div>

          <button
            @click="confirmSell"
            class="w-full bg-red-500 text-white font-bold py-2 rounded-lg"
          >
            Confirm Sell
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showCountdownModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="bg-[#1B2028] rounded-2xl p-6 w-[400px] text-white text-center relative">
      <h2 class="text-xl font-bold mb-4">Transaction Successful!</h2>
      
      <p class="text-lg mb-2">{{ successMessage }}</p> <!-- 🔥 Add this line -->

      <p class="text-sm text-gray-400">This popup will close in {{ countdown }} seconds.</p>

      <button @click="closeCountdownModal" class="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg">
        Close Now
      </button>
    </div>
  </div>

</template>
