<script setup>
import { ref } from "vue";

const step = ref(1);
const form = ref({
  email: "",
  fullName: "",
  username: "",
  password: "",
  confirmPassword: "",
});

const errors = ref({
  passwordMismatch: false,
});

const isEmailValid = ref(false);

const validateEmail = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isEmailValid.value = emailPattern.test(form.value.email);
};

const proceedToNextStep = () => {
  if (isEmailValid.value) {
    step.value = 2;
  }
};

const register = () => {
  errors.value.passwordMismatch = form.value.password !== form.value.confirmPassword;

  if (!errors.value.passwordMismatch) {
    console.log("Registering with:", form.value);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-darkBlue p-4">
    <div class="bg-lightBlue p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-textWhite text-2xl font-bold text-center mb-6">
        Create Your Account
      </h2>

      <form v-if="step === 1" @submit.prevent="proceedToNextStep" class="space-y-4">
        <div>
          <label class="text-textWhite block mb-1">Email</label>
          <input
            v-model="form.email"
            @input="validateEmail"
            type="email"
            class="w-full px-4 py-3 bg-darkBlue text-textWhite rounded-lg border border-lightGray focus:outline-none focus:ring-2 focus:ring-logoBlue"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="!isEmailValid"
          class="w-full py-3 rounded-lg font-bold transition"
          :class="isEmailValid ? 'bg-logoBlue text-textWhite hover:bg-opacity-90' : 'bg-gray-500 text-gray-300 cursor-not-allowed'"
        >
          Continue
        </button>
      </form>

      <form v-if="step === 2" @submit.prevent="register" class="space-y-4">
        <div>
          <label class="text-textWhite block mb-1">Full Name</label>
          <input
            v-model="form.fullName"
            type="text"
            class="w-full px-4 py-3 bg-darkBlue text-textWhite rounded-lg border border-lightGray focus:outline-none focus:ring-2 focus:ring-logoBlue"
            required
          />
        </div>

        <div>
          <label class="text-textWhite block mb-1">Username</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full px-4 py-3 bg-darkBlue text-textWhite rounded-lg border border-lightGray focus:outline-none focus:ring-2 focus:ring-logoBlue"
            required
          />
        </div>

        <div>
          <label class="text-textWhite block mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-4 py-3 bg-darkBlue text-textWhite rounded-lg border border-lightGray focus:outline-none focus:ring-2 focus:ring-logoBlue"
            required
          />
        </div>

        <div>
          <label class="text-textWhite block mb-1">Confirm Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="w-full px-4 py-3 bg-darkBlue text-textWhite rounded-lg border border-lightGray focus:outline-none focus:ring-2 focus:ring-logoBlue"
            required
          />
          <p v-if="errors.passwordMismatch" class="text-red-500 text-sm mt-1">
            Passwords do not match
          </p>
        </div>

        <button
          type="submit"
          class="w-full bg-logoBlue text-textWhite py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  </div>
</template>
