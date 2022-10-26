<template>
  <simple-dialog
      v-model="value" @close="$emit('close')" fullscreen
      title="Docker Deploy"
  >

    <v-card-text class="overflow-y-auto" style="height: 420px">

      <environment-service-show-data v-if="envService" :item="envService"></environment-service-show-data>

    </v-card-text>

    <v-card-text class="pa-0">
      <v-alert type="error" v-for="(error,index) in errors" :key="index">
        {{ error }}
      </v-alert>
    </v-card-text>

    <v-card-text v-if="created" class="pa-0">
      <v-alert type="success" dense>
        Service deployed with id: {{ envServiceCreated.id }}
      </v-alert>

    </v-card-text>

    <v-card-actions v-if="created && !updated" class="justify-center">
      <image-tag-combobox show-name :name="getBaseImage" v-model="targetImage"></image-tag-combobox>
      <v-spacer></v-spacer>
      <v-btn :loading="loading" class="teal white--text" @click="updateDockerService">UPDATE</v-btn>
    </v-card-actions>


    <v-card-actions v-else-if="!created" class="justify-center">
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
import ImageTagCombobox from "@/modules/registry/components/ImageTagCombobox/ImageTagCombobox";

export default {
  name: "EnvironmentServiceDockerCreate",
  components: {ImageTagCombobox, EnvironmentServiceShowData, SimpleDialog},
  props: {
    serviceId: {type: String},
    value: {type: Boolean}
  },
  data() {
    return {
      loading: false,
      envService: null,
      created: false,
      updated: false,
      envServiceCreated: null,
      errors: [],
      targetImage: null
    }
  },
  computed: {
    getBaseImage() {
      return this.envService.service.image
    },
    getTargetImage(){
      return this.targetImage ? this.envService.service.image + ":" +this.targetImage : null
    }
  },
  created() {
    console.log("Created")
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
      console.log("findDockerService", this.serviceId)
      return new Promise((resolve, reject) => {
        this.loading = true
        DockerProvider.findDockerService(this.serviceId)
            .then(r => {
              console.log("findDockerService then", this.serviceId)
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
        this.errors = []
        this.loading = true
        console.log(`createdockerservice`)

        DockerProvider.createDockerService(this.serviceId)
            .then(r => {
              this.created = true
              this.envServiceCreated = r.data.createDockerService
              console.log(r.data.createDockerService)
              resolve(r.data.createDockerService)

            })
            .catch(e => {
              this.errors = e.graphQLErrors.map(i => i.message)
              reject(e)
            })
            .finally(() => this.loading = false)
      })
    },
    async updateDockerService() {
      return new Promise((resolve, reject) => {
        this.errors = []
        this.loading = true
        DockerProvider.updateDockerService(this.serviceId, this.getTargetImage)
            .then(r => {
              this.updated = true
              this.envServiceCreated = r.data.updateDockerService
              this.envService.image = r.data.updateDockerService.image.fullname
              console.log(r.data.updateDockerService)
              resolve(r.data.updateDockerService)

            })
            .catch(e => {
              this.errors = e.graphQLErrors.map(i => i.message)
              reject(e)
            })
            .finally(() => this.loading = false)
      })
    }
  }
}
</script>

<style scoped>

</style>
