<template>
  <div class="card flex justify-center">
    <Toast />
    <Form
      v-slot="$form"
      :initialValues
      :resolver
      @submit="register"
      class="flex flex-col gap-4 w-full sm:w-96"
    >
      <h2 v-if="label" class="font-bold text-2xl">
        {{ label }}
      </h2>
      <div class="flex flex-col gap-1">
        <InputText
          name="username"
          type="text"
          v-model="initialValues.username"
          placeholder="Username"
          fluid
        />
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
          {{ $form.username.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText
          name="email"
          type="text"
          v-model="initialValues.email"
          placeholder="Email"
          fluid
        />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
          {{ $form.email.error?.message }}
        </Message>
      </div>
      <slot name="footer" :loading> </slot>
      <!-- <Button type="submit" severity="secondary" label="Submit" /> -->
    </Form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { InputText, useToast, Toast, Message } from 'primevue'
import { Form } from '@primevue/forms'
import api from '@/utils/axiosInstance'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  item: {
    type: Object,
    default: () => {},
  },
})
const toast = useToast()
const loading = ref(false)

const initialValues = reactive({
  username: '',
  password: '123456',
  email: '',
  id: '',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolver: any = ({
  values,
}: {
  values: { username: string; email: string; password: string }
}) => {
  const errors: {
    username?: { message: string }[]
    email?: { message: string }[]
    password?: { message: string }[]
  } = {}

  if (!values.username) {
    errors.username = [{ message: 'Username is required.' }]
  }

  if (!values.email) {
    errors.email = [{ message: 'Email is required.' }]
  }

  if (!values.password) {
    errors.password = [{ message: 'Password is required.' }]
  }

  return {
    values,
    errors,
  }
}

watch(
  () => props.item,
  (current) => {
    if (!current) return
    initialValues.email = current.email
    initialValues.username = current.username
    initialValues.id = current.id
  },
  { deep: true, immediate: true },
)

const update = async () => {
  try {
    await api.put(`/api/updateUser/${initialValues.id}`, {
      username: initialValues.username,
      email: initialValues.email,
    })

    toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 })

    emit('success')
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      const firebaseError = error as { code?: string }
      switch (firebaseError.code) {
        case 'auth/invalid-email':
          toast.add({
            severity: 'error',
            summary: 'Email yang dimasukkan tidak valid. Periksa kembali formatnya.',
            life: 3000,
          })
          break
        case 'auth/email-already-in-use':
          toast.add({
            severity: 'error',
            summary: 'Email ini sudah digunakan. Gunakan email lain.',
            life: 3000,
          })
          break
        case 'auth/weak-password':
          toast.add({
            severity: 'error',
            summary: 'Password terlalu lemah. Gunakan minimal 6 karakter.',
            life: 3000,
          })
          break
        default:
          toast.add({
            severity: 'error',
            summary: 'Terjadi kesalahan saat registrasi. Coba lagi nanti.',
            life: 3000,
          })
      }
      console.error('Error:', error.message)
    } else {
      console.error('Unknown error:', error)
    }
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{ (e: 'success'): void }>()
const register = async ({ valid }: { valid: boolean }) => {
  if (valid) {
    loading.value = true

    if (initialValues.id) return update()

    try {
      await api.post('/api/createUser', {
        username: initialValues.username,
        email: initialValues.email,
        password: initialValues.password,
      })

      toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 })

      emit('success')
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        const firebaseError = error as { code?: string }
        switch (firebaseError.code) {
          case 'auth/invalid-email':
            toast.add({
              severity: 'error',
              summary: 'Email yang dimasukkan tidak valid. Periksa kembali formatnya.',
              life: 3000,
            })
            break
          case 'auth/email-already-in-use':
            toast.add({
              severity: 'error',
              summary: 'Email ini sudah digunakan. Gunakan email lain.',
              life: 3000,
            })
            break
          case 'auth/weak-password':
            toast.add({
              severity: 'error',
              summary: 'Password terlalu lemah. Gunakan minimal 6 karakter.',
              life: 3000,
            })
            break
          default:
            toast.add({
              severity: 'error',
              summary: 'Terjadi kesalahan saat registrasi. Coba lagi nanti.',
              life: 3000,
            })
        }
        console.error('Error:', error.message)
      } else {
        console.error('Unknown error:', error)
      }
    } finally {
      loading.value = false
    }
  }
}
</script>

<style scoped></style>
