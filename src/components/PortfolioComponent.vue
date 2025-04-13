<script setup>
import { ref, onMounted } from 'vue';
import { useCoinsStore } from '../store/coinsStore';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const isLoggedIn = ref(false);  // Tracks whether the user is logged in
const isLoading = ref(true);    // Tracks loading state
const portfolio = ref([]);      // User's portfolio of coins
const selectedCoinAmount = ref(0);  // Amount of coin to buy/sell
const selectedAction = ref('buy');  // Action is either 'buy' or 'sell'

// This function runs when the component is mounted
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // Fetch the portfolio data if it exists, else initialize as empty
      if (userDocSnap.exists()) {
        portfolio.value = userDocSnap.data().portfolio || [];
      }
    } else {
      isLoggedIn.value = false;
    }
    isLoading.value = false;  // Stop loading once auth state is checked
  });
});

const updatePortfolio = async () => {
  if (selectedCoinAmount.value <= 0) return;

  const user = auth.currentUser;
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    let updatedPortfolio = [...portfolio.value];

    // Find the coin in the portfolio or create it if it doesn't exist
    const coinIndex = updatedPortfolio.findIndex(coin => coin.name === selectedCoinAmount.value.name);

    if (selectedAction.value === 'buy') {
      if (coinIndex === -1) {
        updatedPortfolio.push({
          name: selectedCoinAmount.value.name,
          amount: selectedCoinAmount.value,
          price: selectedCoinAmount.value.priceUsd
        });
      } else {
        updatedPortfolio[coinIndex].amount += selectedCoinAmount.value;
      }
    } else if (selectedAction.value === 'sell') {
      if (coinIndex !== -1 && updatedPortfolio[coinIndex].amount > selectedCoinAmount.value) {
        updatedPortfolio[coinIndex].amount -= selectedCoinAmount.value;
        if (updatedPortfolio[coinIndex].amount === 0) {
          updatedPortfolio[coinIndex].price = 0;
        }
      }
    }

    await setDoc(userDocRef, { portfolio: updatedPortfolio }, { merge: true });
    portfolio.value = updatedPortfolio;
  }
};

</script>

<template>
  <div v-if="!isLoading">
    <div v-if="isLoggedIn" class="min-h-screen flex justify-center items-center bg-[#1B2028]">
      <div class="bg-[#2D2F38] p-[20px] rounded-[10px] w-[400px] text-center">
        <h2 class="text-white font-bold text-2xl mb-4">Buy or Sell Crypto</h2>

        <div v-for="coin in $store.coinDataTop50" :key="coin.id" class="text-white mb-4">
          <div class="mb-2">
            <h3>{{ coin.name }} ({{ coin.symbol }})</h3>
            <p>Price: ${{ coin.priceUsd }}</p>
          </div>
          <input type="number" v-model="selectedCoinAmount" placeholder="Amount" class="px-4 py-2 rounded-md w-full" />

          <div class="flex justify-between gap-2 mt-2">
            <button @click="selectedAction = 'buy'" :class="{'bg-green-500': selectedAction === 'buy'}" class="w-[45%] py-2 rounded-md">Buy</button>
            <button @click="selectedAction = 'sell'" :class="{'bg-red-500': selectedAction === 'sell'}" class="w-[45%] py-2 rounded-md">Sell</button>
          </div>

          <button @click="updatePortfolio" class="bg-logoBlue text-white px-4 py-2 rounded-md w-full mt-4">
            {{ selectedAction === 'buy' ? 'Buy Crypto' : 'Sell Crypto' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-white text-center">
      Please log in to view your portfolio.
    </div>
  </div>

  <!-- Loading Spinner while checking auth state -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
