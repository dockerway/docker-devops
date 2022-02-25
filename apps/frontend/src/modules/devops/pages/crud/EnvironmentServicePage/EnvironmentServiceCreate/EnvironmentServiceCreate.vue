<template>
  <crud-create :open="open"
               :loading="loading"
               :title="title"
               :errorMessage="errorMessage"
               @create="create"
               @close="$emit('close')"
  >
    <environment-service-form ref="form" v-model="form" :input-errors="inputErrors"/>
  </crud-create>
</template>

<script>

import EnvironmentServiceProvider from "../../../../providers/EnvironmentServiceProvider";

import {CrudCreate, ClientError} from '@dracul/common-frontend'

import EnvironmentServiceForm from "../EnvironmentServiceForm";


export default {
  name: "EnvironmentServiceCreate",

  components: {EnvironmentServiceForm, CrudCreate},

  props: {
    open: {type: Boolean, default: true}
  },

  data() {
    return {
      title: 'devops.environmentService.creating',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      form: {
        environment: null,
        service: null,
        stack: '',
        volumes: [],
        ports: [],
        variables: []
      }
    }
  },

  methods: {
    create() {
      if (this.$refs.form.validate()) {
        this.loading = true
        EnvironmentServiceProvider.createEnvironmentService(this.form).then(r => {
              if (r) {
                this.$emit('itemCreated', r.data.createEnvironmentService)
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

