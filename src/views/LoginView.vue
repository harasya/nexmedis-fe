<template>
  <div class="card flex justify-center float-right">
    <Toast />
    <Form
      v-slot="$form"
      :initialValues
      :resolver
      @submit="login"
      class="flex flex-col gap-4 w-full sm:w-96"
    >
      <h2 class="font-bold text-2xl">Login</h2>
      <div class="flex flex-col gap-1">
        <InputText
          name="email"
          type="text"
          v-model="initialValues.email"
          placeholder="Email"
          fluid
        />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText
          name="password"
          type="password"
          v-model="initialValues.password"
          placeholder="Password"
          fluid
        />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message
        }}</Message>
      </div>
      <Button type="submit" severity="secondary" label="Submit" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Button, InputText, useToast, Toast, Message } from 'primevue'
import { Form } from '@primevue/forms'
import router from '@/router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const toast = useToast()

const initialValues = reactive({
  password: '',
  email: '',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolver: any = ({
  values,
}: {
  values: { username: string; email: string; password: string }
}) => {
  const errors: {
    email?: { message: string }[]
    password?: { message: string }[]
  } = {}

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

const login = async ({ valid }: { valid: boolean }) => {
  if (valid) {
    try {
      const auth = await getAuth()
      await signInWithEmailAndPassword(auth, initialValues.email, initialValues.password)

      toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 })
      router.replace('/')
    } catch (error: unknown) {
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
    }
  }
}
</script>

<style scoped></style>
