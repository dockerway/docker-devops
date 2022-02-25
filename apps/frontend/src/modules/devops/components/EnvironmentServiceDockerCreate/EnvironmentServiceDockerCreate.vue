<template>
  <simple-dialog
      v-model="dialog" @close="$emit('close')"
      title="Docker Deploy"
  >

    <v-card-text class="overflow-y-auto" style="height: 300px">

      <environment-service-show-data v-if="envService" :item="envService"></environment-service-show-data>

    </v-card-text>

    <v-card-text v-if="created">
      <v-alert type="success">
        Service deployed with id: {{ envServiceCreated.id }}
      </v-alert>

    </v-card-text>

    <v-card-actions v-else class="justify-center">
      <v-btn :loading="loading" class="teal white--text" @click="createDockerService">DEPLOY</v-btn>
    </v-card-actions>


  </simple-dialog>


</template>

<script>
import EnvironmentServiceProvider from "@/modules/devops/providers/EnvironmentServiceProvider";
import {SimpleDialog} from "@dracul/common-frontend"
import DockerProvider from "@/modules/devops/providers/DockerProvider";
import EnvironmentServiceShowData
  from "@/modules/devops/pages/crud/EnvironmentServicePage/EnvironmentServiceShow/EnvironmentServiceShowData";

export default {
  name: "EnvironmentServiceDockerCreate",
  components: {EnvironmentServiceShowData, SimpleDialog},
  props: {
    serviceId: {type: String}
  },
  data() {
    return {
      dialog: true,
      loading: false,
      envService: null,
      created: false,
      envServiceCreated: null
    }
  },
  created() {
    this.findEnvironmentService()
    this.findDockerService()
  },
  methods: {
    findEnvironmentService() {
      this.loading = true
      EnvironmentServiceProvider.findEnvironmentService(this.serviceId)
          .then(r => {
            this.envService = r.data.findEnvironmentService
          })
          .finally(() => this.loading = false)
    },
    findDockerService() {
      return new Promise((resolve, reject) => {
        this.loading = true
        DockerProvider.findDockerService(this.serviceId)
            .then(r => {
              let dockerService = r.data.findDockerService
              if (dockerService && dockerService.id) {
                this.created = true
                this.envServiceCreated = r.data.findDockerService
              }
              resolve(r.data.findDockerService)
            })
            .catch(err => reject(err))
            .finally(() => this.loading = false)
      })
    },
    async createDockerService() {

      return new Promise((resolve, reject) => {
        this.loading = true
        DockerProvider.createDockerService(this.serviceId)
            .then(r => {
              this.created = true
              this.envServiceCreated = r.data.createDockerService
              console.log(r.data.createDockerService)
              resolve(r.data.createDockerService)

            })
            .catch(err => reject(err))
            .finally(() => this.loading = false)
      })
    }
  }
}
</script>

<style scoped>

</style>
