<template>
  <simple-dialog v-model="value" @close="$emit('close')" fullscreen :title="$t('devops.service.deploySectionTitle')">

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
        {{$t('devops.service.deployed')}} {{ envServiceDeployed.id }}
      </v-alert>

    </v-card-text>

    <v-card-actions v-if="created && !updated" class="justify-center">
      <image-tag-combobox show-name :name="getBaseImage" v-model="targetImage"></image-tag-combobox>
      <v-spacer></v-spacer>
      <v-btn :disabled="buttonDisabledValue" :loading="loading" class="teal white--text"
        @click="updateDockerService">{{$t('devops.service.update')}}</v-btn>
    </v-card-actions>


    <v-card-actions v-else-if="!created" class="justify-center">
      <image-tag-combobox show-name :name="getBaseImage" v-model="targetImage"></image-tag-combobox>
      <v-spacer></v-spacer>
      <v-btn :disabled="buttonDisabledValue" :loading="loading" class="teal white--text"
        @click="createDockerService">DEPLOY</v-btn>
    </v-card-actions>

    <v-alert
      v-model="differenceAlert"
      v-if="differenceMessage"
      type="warning"
      dismissible
      dense
      text
      >
      {{differenceMessage}}
    </v-alert>

  </simple-dialog>
</template>

<script>
import { SimpleDialog } from "@dracul/common-frontend"
import DockerProvider from "@/modules/devops/providers/DockerProvider";
import EnvironmentServiceShowData
  from "@/modules/devops/pages/crud/EnvironmentServicePage/EnvironmentServiceShow/EnvironmentServiceShowData";
import ImageTagCombobox from "@/modules/registry/components/ImageTagCombobox/ImageTagCombobox";
import ServiceTemplateComparer from "../../../../helpers/ServiceTemplateComparer"
import ServiceProvider from "../../providers/ServiceProvider";
import EnvironmentServiceProvider from "../../providers/EnvironmentServiceProvider";

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
      targetImage: this.envService?.service?.image,
      buttonDisabledValue: true,
      differenceAlert: false,
      differenceMessage: '',
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
  mounted(){
    this.getDifferencesBetweenServiceAndTemplate()
  },
  methods: {
    async findDockerService() {
      try {
        this.loading = true

        const dockerService = (await DockerProvider.findDockerService(this.envService.id)).data.findDockerService

        if (dockerService && dockerService.id) {
          this.created = true
          this.envServiceDeployed = dockerService
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
      this.errors = []
      this.loading = true

      try {
        const updatedDockerServiceResponse = await DockerProvider.updateDockerService(this.envService.id, this.getTargetImage)

        this.updated = true
        this.envServiceDeployed = updatedDockerServiceResponse.data.updateDockerService
        //Update Image to the view
        this.envService.image = updatedDockerServiceResponse.data.updateDockerService.image.fullname

        return this.envServiceDeployed
      } catch (error) {
        this.errors = error.graphQLErrors.map(i => (!i.message.includes('404') ? i.message : null))
        throw error
      } finally {
        this.loading = false
      }
    },
    async getDifferencesBetweenServiceAndTemplate() {
      try {
      const serviceTemplate = (await ServiceProvider.findService(this.envService.service.id)).data.findService
      const service = (await EnvironmentServiceProvider.findEnvironmentService(this.envService.id)).data.findEnvironmentService     

      const serviceTemplateComparer = new ServiceTemplateComparer(serviceTemplate, service)
      if (serviceTemplateComparer.serviceIsDifferent){
        this.differenceAlert = true
        this.differenceMessage = serviceTemplateComparer.differencesText
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
