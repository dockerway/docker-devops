<template>
  <crud-update 
    :open="open"
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
import ServiceProvider from "../../../../providers/ServiceProvider";
import { CrudUpdate, ClientError } from '@dracul/common-frontend';
import EnvironmentServiceForm from "../EnvironmentServiceForm";
import ServiceTemplateComparer from "../../../../../../helpers/ServiceTemplateComparer";
// import ObjectComparer from "../../../../../../helpers/objectComparer.js"


export default {
  name: "EnvironmentServiceUpdate",

  components: { EnvironmentServiceForm, CrudUpdate },

  props: {
    open: { type: Boolean, default: true },
    item: { type: Object, required: true }
  },

  data() {
    return {
      title: 'devops.service.editing',
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
        files: this.item.files ? this.item.files : [],
        ports: this.item.ports ? this.item.ports : [],
        envs: this.item.envs ? this.item.envs : [],
        labels: this.item.labels ? this.item.labels : [],
        constraints: this.item.constraints ? this.item.constraints : [],
        limits: this.item.limits ? this.item.limits : {},
        preferences: this.item.preferences ? this.item.preferences : [],
        command: this.item.command
      }
    }
  },
  methods: {
    async update() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true

          console.log(`this.form: ${JSON.stringify(this.form, null, 2)}`)
          console.log(`this.form: ${this.form}`)

          const updatedItem = (await EnvironmentServiceProvider.updateEnvironmentService(this.id, this.form)).data.updateEnvironmentService
          this.$emit('itemUpdated', updatedItem)
          this.$emit('close')
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

  async mounted () {
    const serviceTemplate = (await ServiceProvider.findService(this.item.service.id)).data.findService
    const service = (await EnvironmentServiceProvider.findEnvironmentService(this.id)).data.findEnvironmentService
    console.log(`serviceTemplate: '${JSON.stringify(serviceTemplate, null, 2)}' | service: '${JSON.stringify(service, null, 2)}'`)
    
    const serviceTemplateComparer = new ServiceTemplateComparer(serviceTemplate, service)
    console.log(`there is any difference between the deployed service and the service template: '${serviceTemplateComparer.serviceIsDifferent}'`)
  },
}
</script>

<style scoped></style>

