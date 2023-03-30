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
import { SimpleDialog } from "@dracul/common-frontend"
import DockerProvider from "@/modules/devops/providers/DockerProvider";
import EnvironmentServiceShowData
  from "@/modules/devops/pages/crud/EnvironmentServicePage/EnvironmentServiceShow/EnvironmentServiceShowData";
import ImageTagCombobox from "@/modules/registry/components/ImageTagCombobox/ImageTagCombobox";

export default {
  name: "EnvironmentServiceDockerCreate",
  components: { ImageTagCombobox, EnvironmentServiceShowData, SimpleDialog },
  props: {
    serviceId: { type: String },
    value: { type: Boolean }
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
    getTargetImage() {
      return this.targetImage ? this.envService.service.image + ":" + this.targetImage : null
    }
  },
  async created() {
    await this.findEnvironmentService()
    await this.findDockerService()
  },
  methods: {
    async findEnvironmentService() {
      this.loading = true
      try {
        const environmentService = (await EnvironmentServiceProvider.findEnvironmentService(this.serviceId)).data.findEnvironmentService
        this.envService = environmentService

      } catch (error) {
        console.log(`An error happened when we tried to find the environment service '${this.serviceId}': '${error}'`)
        throw error

      } finally {
        this.loading = false
      }
    },
    async findDockerService() {
      this.loading = true

      try {
        const dockerService = (await DockerProvider.findDockerService(this.serviceId)).data.findDockerService

        if (dockerService && dockerService.id) {
          this.created = true
          this.envServiceCreated = dockerService
        }

        return dockerService

      } catch (error) {
        console.log(`An error happened when we tried to find the service '${this.serviceId}': '${error}'`)
        throw error
      } finally {
        this.loading = false
      }
    },
    async createDockerService() {
      console.log("CREATE DOCKER SERVICE")
      this.errors = []
      this.loading = true

      try {
        const serviceCreated = (await DockerProvider.createDockerService(this.serviceId)).data.createDockerService

        this.created = true
        this.envServiceCreated = serviceCreated

        return serviceCreated
      } catch (error) {
        this.errors = error.graphQLErrors?.map(i => i.message)
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
        const updatedDockerService = await DockerProvider.updateDockerService(this.serviceId, this.getTargetImage)

        this.updated = true
        this.envServiceCreated = updatedDockerService.data.updateDockerService
        this.envService.image = updatedDockerService.data.updateDockerService.image.fullname

        console.log(`updatedDockerService.data.updateDockerService: '${JSON.stringify(updatedDockerService.data.updateDockerService)}'`)
        return updatedDockerService.data.updateDockerService
      } catch (error) {
        this.errors = error.graphQLErrors?.map(i => i.message)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped></style>
