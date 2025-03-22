<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { Button } from 'primevue'
import { getAuth, signOut } from 'firebase/auth'

// import TheWelcome from '../components/TheWelcome.vue'
const authStore = useAuthStore()
const { profile } = storeToRefs(authStore)

const logout = async () => {
  const auth = await getAuth()
  await signOut(auth)
  router.replace('/login')
}
</script>

<template>
  <h1 class="text-5xl font-bold mb-5">
    Hi Welcome <span class="green">{{ profile.username }}</span>
  </h1>
  <div class="grid grid-cols-3 mb-5">
    <div class="col-span-1">
      <div class="grid gap-2 grid-cols-2">
        <div class="font-bold">Username</div>
        <div>: {{ profile.username }}</div>
      </div>
      <div class="grid gap-2 grid-cols-2">
        <div class="font-bold">Email</div>
        <div>: {{ profile.email }}</div>
      </div>
      <div class="grid gap-2 grid-cols-2">
        <div class="font-bold">Role</div>
        <div>: {{ profile.role }}</div>
      </div>
    </div>
  </div>
  <Button label="Logout" severity="danger" @click="logout" />

  <!-- <div class="flex place-items-center min-h-screen">
    <main>
      <TheWelcome />
    </main>
  </div> -->
</template>
