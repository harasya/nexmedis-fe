<template>
  <div class="card">
    <Button
      label="Add User"
      class="float-right"
      size="small"
      severity="contrast"
      @click="showDialog = true"
    />
    <DataTable :value="users" tableStyle="min-width: 50rem" class="clear-both">
      <Column v-for="col of fields" :key="col.key" :field="col.key" :header="col.label">
        <template #body="{ data }">
          <!-- {{ data }} {{ col.key }} {{ data[col.key] }} -->
          {{ data[col.key] }}
          <template v-if="col.key === 'action'">
            <div class="space-x-2">
              <Button
                icon="pi pi-pencil"
                severity="info"
                rounded
                variant="outlined"
                aria-label="User"
                size="small"
                @click="onEdit(data.id)"
              />
              <Button
                v-if="profile.email !== data.email"
                icon="pi pi-times"
                severity="danger"
                rounded
                variant="outlined"
                aria-label="Cancel"
                size="small"
                @click="onDelete(data.id)"
              />
            </div>
          </template>
        </template>
      </Column>
    </DataTable>
  </div>

  <Toast />
  <ConfirmDialog></ConfirmDialog>

  <Dialog
    v-model:visible="showDialog"
    pt:mask:class="backdrop-blur-sm"
    header="Add User"
    :style="{ width: '25rem' }"
  >
    <FormRegister @success="onSuccess" :item="edit">
      <template #footer="{ loading }">
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="showDialog = false"
          ></Button>
          <Button type="submit" label="Save" :loading></Button>
        </div>
      </template>
    </FormRegister>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  DataTable,
  Column,
  Button,
  Dialog,
  useConfirm,
  useToast,
  ConfirmDialog,
  Toast,
} from 'primevue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import FormRegister from '@/components/FormRegister.vue'

const authStore = useAuthStore()
const toast = useToast()
const confirm = useConfirm()
const { users, profile } = storeToRefs(authStore)
const showDialog = ref(false)
const edit = ref()
const fields = computed(() => {
  return [
    {
      key: 'username',
      label: 'Username',
    },
    {
      key: 'role',
      label: 'Role',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'createdAt',
      label: 'Created At',
    },
    {
      key: 'action',
      label: 'Action',
    },
  ]
})

onMounted(() => {
  authStore.getAll()
})

const onEdit = (id: string) => {
  showDialog.value = true
  edit.value = users.value.find((item) => item.id === id)
}

const onSuccess = async () => {
  authStore.getAll()
  showDialog.value = false
}

const onDelete = (id: string) => {
  confirm.require({
    message: 'Do you want to delete this record?',
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      await authStore.deleteUser(id)

      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    },
  })
}
</script>

<style scoped></style>
