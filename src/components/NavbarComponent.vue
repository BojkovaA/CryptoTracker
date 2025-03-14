<script setup>
</script>

<template>
    <div className=" h-full lg:h-[100px] flex items-center py-[10px] bg-[#1B2028]" >
            <div className="container mx-auto max-w-7xl flex justify-between items-center flex-col lg:flex-row gap-[10px]">
                <div className="flex items-center gap-[10px]">
                    <img src="/src/static/logo2.png">
                    <router-link to="/" class="font-bold text-lightGray">Crypto Tracker</router-link>
                </div>

                
                <div className="bg-[#454151] rounded-[20px]">
                    <input type="text" placeholder="Search.." 
                    className="bg-transparent outline-none px-[30px] py-[15px] rounded-[20px] placeholder:text-mainYellow text-mainPurple"/>
                    <button className="bg-lightGray px-[30px] py-[15px] rounded-[20px] text-textWhite">Search</button>
                </div>

                   
                <div className="flex items-center gap-[10px]">
                    <div className="flex items-center gap-[5px]">
                        <router-link to="/login" class="bg-lightGray text-textWhite px-[20px] py-[10px] rounded-[20px]">Sign in</router-link>
                    </div>
                    <div className="flex items-center gap-[5px]">
                        <router-link to="/register" class="bg-lightGray text-textWhite px-[20px] py-[10px] rounded-[20px]">Register</router-link>
                    </div>
                </div>
            </div>
        </div>
</template>