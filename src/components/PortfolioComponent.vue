<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
const isLoggedIn = ref(false);

const isLoading = ref(true);
const router = useRouter();

const userCoins = ref([])

const totalCoinsValue = ref(0);


onMounted(() =>{
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true;
      const coinsCollectionRef = collection(db, 'users', user.uid, 'cryptoCoins');
      const coinsSnapshot = await getDocs(coinsCollectionRef)

      userCoins.value = coinsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // console.log("User's coins: ", userCoins.value)

      totalCoinsValue.value = userCoins.value.reduce((acc, coin) => acc + coin.valueUsd, 0);
      // console.log("Total coins value: ", totalCoinsValue);
      }
    else {
      isLoggedIn.value = false;
    }
    isLoading.value = false;
  })
})

const handleInvest = (coinName) => {
  if (isLoggedIn.value) {
    router.push({ path: `/invest/${coinName}` });
  } else {
    router.push("/register");
  }
};

</script>
<template>
  <div>
    <div class="text-white text-center mt-[20px] w-[600px] rounded-[10px] p-[20px] mx-[150px] font-bold text-2xl bg-[#1B2028] ">
    <h1>YOU'R TOTAL BALANCE</h1>
    <p>{{ totalCoinsValue.toFixed(4) }}</p>
   <!-- <div >
    <div class ="text-center w-[200px]">
      {{ totalCoinsValue }}
    </div>
    <div class ="w-[200px]">
      <select>
        <option value="USD" key="USD">USD</option>
      </select>
    </div> 
   </div>-->
  </div>
    <div v-for="coin in userCoins" class="text-white text-center mt-[20px] w-[600px] rounded-[10px] p-[20px] mx-[150px] flex justify-between border border-[#1B2028] bg-white">
      <div class="w-[200px] text-[#1B2028] text-2xl"><p class="cursor-pointer"  @click="handleInvest(coin.coinName)">{{ coin.coinName }}</p></div>
      <div class="w-[200px] text-[#1B2028] text-2xl"><p>${{ coin.valueUsd }}</p></div>
    </div>
  </div>
</template>