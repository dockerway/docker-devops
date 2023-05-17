<template>
  <simple-dialog v-model="value" @close="$emit('close')" fullscreen title="Docker Deploy">

    <v-card-text class="overflow-y-auto" style="height: 420px">

      <environment-service-show-data v-if="envService" :item="envService"></environment-service-show-data>

    </v-card-text>

    <v-card-text class="pa-0">
      <v-alert type="error" v-for="(error, index) in errors" :key="index">
        {{ error }}
      </v-alert>
    </v-card-text>

    <v-card-text v-if="created" class="pa-0">
      <v-alert type="success" dense>
        Service deployed with id: {{ envServiceDeployed.id }}
      </v-alert>

    </v-card-text>

    <v-card-actions v-if="created && !updated" class="justify-center">
      <image-tag-combobox show-name :name="getBaseImage" v-model="targetImage"></image-tag-combobox>
      <v-spacer></v-spacer>
      <v-btn :loading="loading" class="teal white--text" @click="updateDockerService">UPDATE</v-btn>
    </v-card-actions>


    <v-card-actions v-else-if="!created" class="justify-center">
      <image-tag-combobox show-name :name="getBaseImage" v-model="targetImage"></image-tag-combobox>
      <v-spacer></v-spacer>
      <v-btn :loading="loading" class="teal white--text" @click="createDockerService">DEPLOY</v-btn>
    </v-card-actions>


  </simple-dialog>
</template>

<script>
import { SimpleDialog } from "@dracul/common-frontend"
import DockerProvider from "@/modules/devops/providers/DockerProvider";
import EnvironmentServiceShowData
  from "@/modules/devops/pages/crud/EnvironmentServicePage/EnvironmentServiceShow/EnvironmentServiceShowData";
import ImageTagCombobox from "@/modules/registry/components/ImageTagCombobox/ImageTagCombobox";

export default {
  name: "EnvironmentServiceDockerDeploy",
  components: { ImageTagCombobox, EnvironmentServiceShowData, SimpleDialog },
  props: {
    envService: { type: Object },
    value: { type: Boolean }
  },
  data() {
    return {
      loading: false,
      created: false,
      updated: false,
      envServiceDeployed: null,
      errors: [],
      targetImage: this.envService?.service?.image
    }
  },
  computed: {
    getBaseImage() {
      return this.envService.service.image
    },
    getTargetImage() {

      function stripVersionFromURL(url) {
        const regex = /:(.*?)(?=[/?]|$)/;
        const match = url.match(regex);

        if (match) {
          const strippedURL = url.replace(regex, '')
          return strippedURL
        } else {
          return url
        }
      }

      return this.targetImage ? stripVersionFromURL(this.envService.service.image) + ":" + this.targetImage : null
    }
  },
  created() {
    this.findDockerService()
  },
  methods: {
    findDockerService() {
      console.log("finding DockerService:", this.envService.id)
      return new Promise((resolve) => {
        this.loading = true
        DockerProvider.findDockerService(this.envService.id)
          .then(r => {
            let dockerService = r.data.findDockerService
            if (dockerService && dockerService.id) {
              this.created = true
              this.envServiceDeployed = r.data.findDockerService
            }
            resolve(r.data.findDockerService)
          })
          .catch(err => console.error(err))
          .finally(() => this.loading = false)
      })
    },
    async createDockerService() {
      console.log("CREATE DOCKER SERVICE")
      this.errors = []
      this.loading = true

      try {
        const createDockerServiceResponse = await DockerProvider.createDockerService(this.envService.id, this.getTargetImage)
        this.created = true
        this.envServiceDeployed = createDockerServiceResponse.data.createDockerService
        return this.envServiceDeployed
      } catch (error) {
        this.errors = error.graphQLErrors.map(i => (!i.message.includes('404') ? i.message : null))
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateDockerService() {
      console.log("UPDATE DOCKER SERVICE")
      this.errors = []
      this.loading = true

      try {
        const updatedDockerServiceResponse = await DockerProvider.updateDockerService(this.envService.id, this.getTargetImage)

        this.updated = true
        this.envServiceDeployed = updatedDockerServiceResponse.data.updateDockerService
        //Update Image to the view
        this.envService.image = updatedDockerServiceResponse.data.updateDockerService.image.fullname

        console.log(`updatedDockerService.data.updateDockerService: '${JSON.stringify(this.envServiceDeployed)}'`)
        return this.envServiceDeployed
      } catch (error) {
        this.errors = error.graphQLErrors.map(i => (!i.message.includes('404') ? i.message : null))
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped></style>
