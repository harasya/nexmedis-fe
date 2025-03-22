import { ref } from 'vue'
import { defineStore } from 'pinia'
import type IUser from '@/types/user'
import api from '@/utils/axiosInstance'
import { getAuth, signOut } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const profile = ref<IUser>({} as IUser)
  const users = ref<IUser[]>([])

  const getAll = () => {
    new Promise(async (resolve, reject) => {
      try {
        const { data } = await api.get('/api/getUsers')
        users.value = data

        resolve(users.value)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  const deleteUser = (id: string) => {
    new Promise<void>(async (resolve, reject) => {
      try {
        const { data } = await api.delete(`/api/deleteUser/${id}`)
        await getAll()
        resolve(data)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  const logout = () => {
    new Promise<void>(async (resolve, reject) => {
      try {
        const auth = await getAuth()
        await signOut(auth)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  return { profile, getAll, users, deleteUser, logout }
})
