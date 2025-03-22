<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebase'
import loading from '@/assets/images/loading.svg'
import { Menubar, Avatar } from 'primevue'
import logo from '@/assets/images/logo.png'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth'
import type IUser from './types/user'

const isAuthenticated = ref(false)
const router = useRouter()
const isLoading = ref(true)
const { profile } = storeToRefs(useAuthStore())
const currentPath = computed(() => router.currentRoute.value.path)
const isActive = (route: string) => currentPath.value === route

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/',
    command: () => {
      router.push('/')
    },
  },
  {
    label: 'Profile',
    icon: 'pi pi-user',
    route: '/profile',
    command: () => {
      router.push('/profile')
    },
  },
])

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    isAuthenticated.value = !!user
    isLoading.value = false
    if (user) {
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        profile.value = userSnap.data() as IUser
        console.log('load data user')
      } else {
        console.log('No user data found in Firestore')
      }
    }
  })
})
</script>

<template>
  <div v-if="isLoading" class="loading-screen flex place-items-center min-h-screen justify-center">
    <img :src="loading" alt="Loading..." width="100" />
  </div>
  <template v-else>
    <div v-if="isAuthenticated" class="card fixed inset-x-0 top-0">
      <Menubar :model="items">
        <template #start>
          <img :src="logo" alt="logo" width="100" />
        </template>
        <template #item="{ item, props, hasSubmenu }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a
              :class="{ active: isActive(item.route) }"
              v-ripple
              :href="href"
              v-bind="props.action"
              @click="navigate"
            >
              <span :class="item.icon" />
              <span>{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
            <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
          </a>
        </template>
        <template #end>
          <div class="flex items-center gap-2">
            <Avatar icon="pi pi-user" shape="circle" />
          </div>
        </template>
      </Menubar>
    </div>
    <div class="float-left">
      <header v-if="!isAuthenticated">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

        <div class="wrapper">
          <HelloWorld msg="Welcome the Movies!" />

          <nav>
            <RouterLink to="/login">Login</RouterLink>
            <RouterLink to="/register">Register</RouterLink>
          </nav>
        </div>
      </header>
    </div>

    <RouterView />
  </template>
</template>

<style scoped>
.p-menubar-item-link {
  &.active {
    color: hsla(160, 100%, 37%, 1);
  }
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
