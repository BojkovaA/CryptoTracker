<script setup>
import CardsComponent from './CardsComponent.vue';
import ChartComponent from './ChartComponent.vue';
import LiveMarketComponent from './LiveMarketComponent.vue';
import MyPortfolio from './MyPortfolio.vue';
import PopularCoinsChart from './PopularCoinsChart.vue';

</script>

<template>
    <div className="mt-[50px]">
        <CardsComponent/>
    </div>
    <div class="flex flex-col lg:flex-row gap-[20px] justify-center mt-[100px]">
        <MyPortfolio/>
        <PopularCoinsChart/>
    </div>
    <LiveMarketComponent class="mt-[50px]"/>
    <h1>HomePage</h1>
</template>