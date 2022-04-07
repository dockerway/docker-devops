<template>
  <crud-update :open="open"
               :loading="loading"
               :title="title"
               :errorMessage="errorMessage"
               @update="update"
               @close="$emit('close')" fullscreen

  >
    <service-form ref="form" v-model="form" :input-errors="inputErrors"/>
  </crud-update>
</template>

<script>

import ServiceProvider from "../../../../providers/ServiceProvider";

import {CrudUpdate, ClientError} from '@dracul/common-frontend'

import ServiceForm from "../ServiceForm";


export default {
  name: "ServiceUpdate",

  components: {ServiceForm, CrudUpdate},

  props: {
    open: {type: Boolean, default: true},
    item: {type: Object, required: true}
  },
  data() {
    return {
      title: 'devops.service.editing',
      errorMessage: '',
      inputErrors: {},
      loading: false,
      id: this.item.id,
      form: {
        name: this.item.name,
        description: this.item.description,
        image: this.item.image,
        repository: this.item.repository,
        platform: this.item.platform.id ? this.item.platform.id : null,
        volumes: this.item.volumes,
        ports: this.item.ports,
        envs: this.item.envs ? this.item.envs : [],
        constraints: this.item.constraints ?  this.item.constraints : [],
        limits: this.item.limits ?  this.item.limits : {}
      }
    }
  },
  methods: {
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true
        ServiceProvider.updateService(this.id, this.form).then(r => {
              if (r) {
                this.$emit('itemUpdated', r.data.updateService)
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

