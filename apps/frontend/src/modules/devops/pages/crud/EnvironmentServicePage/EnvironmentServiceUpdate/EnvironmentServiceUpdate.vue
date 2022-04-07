<template>
  <crud-update :open="open"
               :loading="loading"
               :title="title"
               :errorMessage="errorMessage"
               @update="update"
               @close="$emit('close')" fullscreen
  >
    <environment-service-form ref="form" v-model="form" :id="id" :input-errors="inputErrors"/>
  </crud-update>
</template>

<script>

import EnvironmentServiceProvider from "../../../../providers/EnvironmentServiceProvider";

import {CrudUpdate, ClientError} from '@dracul/common-frontend'

import EnvironmentServiceForm from "../EnvironmentServiceForm";


export default {
  name: "EnvironmentServiceUpdate",

  components: {EnvironmentServiceForm, CrudUpdate},

  props: {
    open: {type: Boolean, default: true},
    item: {type: Object, required: true}
  },

  data() {
    return {
      title: 'devops.environmentService.editing',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      id: this.item.id,
      form: {
        environment: this.item.environment ? this.item.environment.id : null,
        service: this.item.service ? this.item.service.id : null,
        stack: this.item.stack ? this.item.stack.id : null,
        image: this.item.image,
        name: this.item.name,
        replicas: this.item.replicas,
        volumes: this.item.volumes ? this.item.volumes : [],
        ports: this.item.ports ? this.item.ports : [],
        envs: this.item.envs ? this.item.envs : [],
        labels: this.item.labels ? this.item.labels : [],
        constraints: this.item.constraints ?  this.item.constraints : [],
        limits: this.item.limits ?  this.item.limits : {}
      }
    }
  },
  methods: {
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true
        EnvironmentServiceProvider.updateEnvironmentService(this.id, this.form).then(r => {
              if (r) {
                this.$emit('itemUpdated', r.data.updateEnvironmentService)
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

