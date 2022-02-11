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
      title: 'devops.service.creating',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      form: {
        name: '',
        description: '',
        platform: null,
        volumes: '',
        ports: '',
        variables: []
      }
    }
  },

  methods: {
    create() {
      if (this.$refs.form.validate()) {
        this.loading = true
        ServiceProvider.createService(this.form).then(r => {
              if (r) {
                this.$emit('itemCreated', r.data.createService)
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

