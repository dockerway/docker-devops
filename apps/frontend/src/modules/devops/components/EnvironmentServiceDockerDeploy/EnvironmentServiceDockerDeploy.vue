<template>
  <v-dialog v-model="value" fullscreen width="1350">
    <v-card class="d-flex flex-column">
      <toolbar-dialog
        fullscreen

        :title="$t('devops.service.deploySectionTitle')"
        @close="$emit('close')"
        v-model="value"
        class="flex-grow-0"
      ></toolbar-dialog>

      <v-card-text class="pa-0">
        <environment-service-show-data 
          v-if="envService"
          :item="envService"
        ></environment-service-show-data>
        <v-alert type="success" dense v-if="created">
          {{ $t('devops.service.deployed') }} {{ envServiceDeployed.id }}
        </v-alert>
      </v-card-text>

      <v-spacer></v-spacer>
      <v-card-actions>
        <v-row
          v-if="created && !updated"
          class="ma-0 pa-0"
          align="center"
          justify="space-between"
        >
          <v-col cols="12" md="6" align-self="center">
            <image-tag-combobox show-name :name="getBaseImage" v-model="targetImage"></image-tag-combobox>
          </v-col>

          <v-btn
            :block="$vuetify.breakpoint.smAndDown"
            :disabled="buttonDisabledValue"
            :loading="loading" class="teal white--text"
            @click="updateDockerService">{{ $t('devops.service.update') }}
          </v-btn>
        </v-row>
        <v-row 
          v-else-if="!created" 
          class="ma-0 pa-0"
          align="center"
          justify="space-between"
        >
          <v-col cols="12" md="6" align-self="center">
            <image-tag-combobox 
              show-name :name="getBaseImage" 
              v-model="targetImage"
            ></image-tag-combobox>
          </v-col>
          <v-btn 
              :block="$vuetify.breakpoint.smAndDown"
              class="teal white--text"
  
              :disabled="buttonDisabledValue" 
              :loading="loading"
  
              @click="createDockerService"
            >
              {{$t('devops.service.deploy')}}
            </v-btn>
        </v-row>
      </v-card-actions>

      <v-card-text v-if="differenceMessage">
        <v-alert v-model="differenceAlert" type="warning" dismissible dense text>
          {{ differenceMessage }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ToolbarDialog } from '@dracul/common-frontend'
import DockerProvider from "@/modules/devops/providers/DockerProvider";
import EnvironmentServiceShowData
  from "@/modules/devops/pages/crud/EnvironmentServicePage/EnvironmentServiceShow/EnvironmentServiceShowData";
import ImageTagCombobox from "@/modules/registry/components/ImageTagCombobox/ImageTagCombobox";
import ServiceTemplateComparer from "../../../../helpers/ServiceTemplateComparer"
import ServiceProvider from "../../providers/ServiceProvider";
import EnvironmentServiceProvider from "../../providers/EnvironmentServiceProvider";

export default {
  name: "EnvironmentServiceDockerDeploy",
  components: { ImageTagCombobox, EnvironmentServiceShowData, ToolbarDialog },
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
      console.log(`AAAAAAAAAAAAAAAAAAAAAAA`)
    this.findDockerService()
  },
  mounted() {
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
        if (serviceTemplateComparer.serviceIsDifferent) {
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
