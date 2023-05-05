<template>
  <crud-create :open="open" :loading="loading" :title="title" :errorMessage="errorMessage" @create="create"
    @close="$emit('close')">
    <environment-service-form ref="form" v-model="form" :input-errors="inputErrors" />
  </crud-create>
</template>

<script>

import EnvironmentServiceProvider from "../../../../providers/EnvironmentServiceProvider";
import { CrudCreate, ClientError } from '@dracul/common-frontend'
import EnvironmentServiceForm from "../EnvironmentServiceForm";


export default {
  name: "EnvironmentServiceCreate",
  components: { EnvironmentServiceForm, CrudCreate },
  props: {
    open: { type: Boolean, default: true }
  },

  data() {
    return {
      title: 'devops.service.creating',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      form: {
        environment: null,
        service: null,
        stack: '',
        image: '',
        name: '',
        replicas: 1,
        volumes: [],
        files: [],
        ports: [],
        envs: [],
        labels: [],
        constraints: [],
        limits: {
          memoryReservation: 0,
          memoryLimit: 0,
          CPUReservation: 0,
          CPULimit: 0
        },
        preferences: [],
        command: null
      }
    }
  },

  methods: {
    async create() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const newEnvironmentService = await EnvironmentServiceProvider.createEnvironmentService(this.form)

          if (newEnvironmentService) {
            this.$emit('itemCreated', newEnvironmentService.data.createEnvironmentService)
            this.$emit('close')
          }

        } catch (error) {
          const clientError = new ClientError(error)

          this.inputErrors = clientError.inputErrors
          this.errorMessage = clientError.i18nMessage

        } finally {
          this.loading = false
        }
      }

    }
  },
}
</script>

<style scoped></style>

