<script setup>
import { ref } from "vue";

const step = ref(1); // Step 1: Enter email/username, Step 2: Enter password
const form = ref({
  emailOrUsername: "",
  password: "",
});

const isValidInput = ref(false);

const validateInput = () => {
  isValidInput.value = form.value.emailOrUsername.trim().length > 0;
};

const proceedToPassword = () => {
  if (isValidInput.value) {
    step.value = 2;
  }
};

const login = () => {
  console.log("Logging in with:", form.value);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-darkBlue p-4">
    <div class="bg-lightBlue p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-textWhite text-2xl font-bold text-center mb-6">
        Sign In to Your Account
      </h2>

      <!-- Step 1: Email/Username Input -->
      <form v-if="step === 1" @submit.prevent="proceedToPassword" class="space-y-4">
        <div>
          <label class="text-textWhite block mb-1">Email or Username</label>
          <input
            v-model="form.emailOrUsername"
            @input="validateInput"
            type="text"
            class="w-full px-4 py-3 bg-darkBlue text-textWhite rounded-lg border border-lightGray focus:outline-none focus:ring-2 focus:ring-logoBlue"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="!isValidInput"
          class="w-full py-3 rounded-lg font-bold transition"
          :class="isValidInput ? 'bg-logoBlue text-textWhite hover:bg-opacity-90' : 'bg-gray-500 text-gray-300 cursor-not-allowed'"
        >
          Continue
        </button>
      </form>

      <!-- Step 2: Password Input -->
      <form v-if="step === 2" @submit.prevent="login" class="space-y-4">
        <div>
          <label class="text-textWhite block mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-4 py-3 bg-darkBlue text-textWhite rounded-lg border border-lightGray focus:outline-none focus:ring-2 focus:ring-logoBlue"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-logoBlue text-textWhite py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
        >
          Log In
        </button>
      </form>
    </div>
  </div>
</template>
