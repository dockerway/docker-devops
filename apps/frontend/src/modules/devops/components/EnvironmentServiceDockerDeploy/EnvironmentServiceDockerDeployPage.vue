<template>
  <v-container>
    <v-card-text class="overflow-y-auto" style="height: 420px">

      <environment-service-show-data v-if="environmentService" :item="environmentService" />

    </v-card-text>

    <v-card-text class="pa-0">
      <v-alert v-for="(error, index) in errors" type="error" :key="index">
        {{ error }}
      </v-alert>
    </v-card-text>

    <v-card-text v-if="created" class="pa-0">
      <v-alert type="success" dense>
        {{ $t('devops.service.deployed') }} {{ environmentServiceDeployed.id }}
      </v-alert>

    </v-card-text>

    <v-card-actions v-if="created && !updated && baseImage" class="justify-center">
      <image-tag-combobox show-name :name="baseImage" v-model="targetImage" />

      <v-spacer></v-spacer>

      <v-btn :disabled="buttonDisabledValue" :loading="loading" class="teal white--text" @click="updateDockerService">
        {{ $t('devops.service.update') }}
      </v-btn>
    </v-card-actions>


    <v-card-actions v-else-if="!created && baseImage" class="justify-center">
      <image-tag-combobox show-name :name="baseImage" v-model="targetImage" :wishedImage="imageTag" />

      <v-spacer></v-spacer>

      <v-btn :disabled="buttonDisabledValue" :loading="loading" class="teal white--text" @click="createDockerService">
        {{$t('devops.service.deploy')}}
      </v-btn>
    </v-card-actions>

    <v-alert v-if="differenceMessage" v-model="differenceAlert" type="warning" dismissible dense text>
      {{ differenceMessage }}
    </v-alert>
  </v-container>
</template>

<script>
import DockerProvider from "@/modules/devops/providers/DockerProvider";
import EnvironmentServiceShowData
  from "@/modules/devops/pages/crud/EnvironmentServicePage/EnvironmentServiceShow/EnvironmentServiceShowData";
import ImageTagCombobox from "@/modules/registry/components/ImageTagCombobox/ImageTagCombobox";
import ServiceTemplateComparer from "../../../../helpers/ServiceTemplateComparer"
import ServiceProvider from "../../providers/ServiceProvider";
import EnvironmentServiceProvider from "../../providers/EnvironmentServiceProvider";

export default {
  name: "EnvironmentServiceDockerDeploy",
  components: { ImageTagCombobox, EnvironmentServiceShowData },
  props: {
    value: { type: Boolean }
  },
  data() {
    return {
      loading: false,

      created: false,
      updated: false,

      environmentService: null,
      environmentServiceDeployed: null,
      errors: [],

      targetImage: this.environmentService?.service?.image,
      baseImage: '',

      buttonDisabledValue: true,
      differenceAlert: false,
      differenceMessage: '',
    }
  },
  async beforeMount(){
    await this.getEnvironmentService()
    
    this.getBaseImage()
    await this.findDockerService()

  },
  mounted() {
    // this.getDifferencesBetweenServiceAndTemplate()
  },
  computed: {
    environment() {
      return this.$route.params.environment
    },
    stack() {
      return this.$route.params.stack
    },
    environmentServiceName() {
      return this.$route.params.environmentServiceName
    },
    imageTag() {
      return this.$route.params.imageTag
    },
  },
  methods: {
    async getEnvironmentService() {
      try {
        if (this.environmentServiceName) {
          const environmentServiceFound = (await EnvironmentServiceProvider.findEnvironmentServiceByItsNameAndStack(this.environmentServiceName, this.stack)).data.findEnvironmentServiceByItsNameAndStack
          this.environmentService = environmentServiceFound
        }
      } catch (error) {
        console.error(`An error happened at the getEnvironmentService function: '${error}'`)
      }
    },
    getBaseImage() {
      try {
        console.log(`this.environmentService.service.image: ${this.environmentService.service.image}`)
        this.baseImage =  this.environmentService.service.image
      } catch (error) {
        console.error(`An error happened at the getBaseImage function: '${error}'`)
      }
    },
    getTargetImage() {

      function stripVersionFromURL(url) {
        try {
          const regex = /:(.*?)(?=[/?]|$)/;
          const match = url.match(regex);

          if (match) {
            const strippedURL = url.replace(regex, '')
            return strippedURL
          } else {
            return url
          }
        } catch (error) {
          console.error(`An error happened at the stripVersionFromURL function: '${error}'`)
        }
      }

      try {
        return this.targetImage ? stripVersionFromURL(this.environmentService.service.image) + ":" + this.targetImage : null
      } catch (error) {
        console.error(`An error happened at the getTargetImage function: '${error}'`)
      }
    },
    async findDockerService() {
      try {
        this.loading = true

        const dockerService = (await DockerProvider.findDockerService(this.environmentService.id)).data.findDockerService

        if (dockerService && dockerService.id) {
          this.created = true
          this.environmentServiceDeployed = dockerService
        }

        return dockerService
      } catch (error) {
        console.error(`An error happened at the findDockerService method: '${error.message}'`)
      } finally {
        this.loading = false
      }
    },
    async createDockerService() {
      this.errors = []
      this.loading = true

      try {
        const createDockerServiceResponse = await DockerProvider.createDockerService(this.environmentService.id, this.getTargetImage)

        this.created = true
        this.environmentServiceDeployed = createDockerServiceResponse.data.createDockerService
        return this.environmentServiceDeployed
      } catch (error) {
        this.errors = error.graphQLErrors.map(i => (!i.message.includes('404') ? i.message : null))
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateDockerService() {
      this.errors = []
      this.loading = true

      try {
        const updatedDockerServiceResponse = await DockerProvider.updateDockerService(this.environmentService.id, this.getTargetImage)

        this.updated = true
        this.environmentServiceDeployed = updatedDockerServiceResponse.data.updateDockerService
        //Update Image to the view
        this.environmentService.image = updatedDockerServiceResponse.data.updateDockerService.image.fullname

        return this.environmentServiceDeployed
      } catch (error) {
        this.errors = error.graphQLErrors.map(i => (!i.message.includes('404') ? i.message : null))
        throw error
      } finally {
        this.loading = false
      }
    },
    async getDifferencesBetweenServiceAndTemplate() {
      try {
        if (this.environmentService) {
          const serviceTemplate = (await ServiceProvider.findServiceByItsNameAndStack(this.environmentService.service.name, this.stack)).data.findServiceByItsNameAndStack
          const service = (await EnvironmentServiceProvider.findEnvironmentServiceByItsName(this.environmentServiceName)).data.findEnvironmentServiceByItsName


          const serviceTemplateComparer = new ServiceTemplateComparer(serviceTemplate, service)
          if (serviceTemplateComparer.serviceIsDifferent) {
            this.differenceAlert = true
            this.differenceMessage = serviceTemplateComparer.differencesText
          }
        }

      } catch (error) {
        console.error(`An error happened at the getDifferencesBetweenServiceAndTemplate method: ${error.message ? error.message : error}`)
      }
    },
  },
  watch: {
    targetImage(newValue) {
      if (newValue) {
        this.buttonDisabledValue = false
      } else {
        this.buttonDisabledValue = true
      }
    }
  },
}
</script>

<style scoped></style>
