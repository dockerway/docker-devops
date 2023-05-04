<template>
  <crud-create :open="open"
               :loading="loading"
               :title="title"
               :errorMessage="errorMessage"
               @create="create"
               @close="$emit('close')"
  >
    <service-form ref="form" v-model="form" :input-errors="inputErrors"/>
  </crud-create>
</template>

<script>

import ServiceProvider from "../../../../providers/ServiceProvider";

import {CrudCreate, ClientError} from '@dracul/common-frontend'

import ServiceForm from "../ServiceForm";


export default {
  name: "ServiceCreate",

  components: {ServiceForm, CrudCreate},

  props: {
    open: {type: Boolean, default: true}
  },

  data() {
    return {
      title: 'devops.serviceTemplate.creating',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      form: {
        name: '',
        description: '',
        image: '',
        repository: '',
        platform: null,
        volumes: [],
        files: [],
        ports: [],
        envs: [],
        constraints: [],
        limits: {
          memoryReservation:0,
          memoryLimit:0,
          CPUReservation:0, 
          CPULimit:0
        },
        preferences: []
      }
    }
  },

  methods: {
    create() {
      if (this.$refs.form.validate()) {
        this.loading = true
        ServiceProvider.createServiceTemplate(this.form).then(r => {
              if (r) {
                this.$emit('itemCreated', r.data.createServiceTemplate)
                this.$emit('close')
              }
            }
        ).catch(error => {
          let clientError = new ClientError(error)
          this.inputErrors = clientError.inputErrors
          this.errorMessage = clientError.i18nMessage
        }).finally(() => this.loading = false)
      }

    }

  },
}
</script>

<style scoped>

</style>

