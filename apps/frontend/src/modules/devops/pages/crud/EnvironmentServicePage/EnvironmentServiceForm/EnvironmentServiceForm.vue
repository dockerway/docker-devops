<template>
  <v-form ref="form" autocomplete="off" @submit.prevent="save">
    <v-row>

      <v-col cols="12" sm="4">
        <environment-combobox v-model="form.environment" :input-errors="inputErrors"/>
      </v-col>


      <v-col cols="12" sm="4">
        <service-combobox v-model="form.service" :input-errors="inputErrors"/>
      </v-col>


      <v-col cols="12" sm="4">
        <v-text-field

            prepend-icon="table_rows"
            name="stack"
            v-model="form.stack"
            :label="$t('devops.environmentService.labels.stack')"
            :placeholder="$t('devops.environmentService.labels.stack')"
            :error="hasInputErrors('stack')"
            :error-messages="getInputErrors('stack')"
            color="secondary"
            :rules="required"
        ></v-text-field>
      </v-col>

    </v-row>

    <v-card outlined>

      <v-card-actions class="py-1 my-0">
        <v-spacer></v-spacer>
        <v-btn x-small @click="getFromService">GET FROM SERVICE</v-btn>
        <v-btn x-small @click="getFromEnvironment">GET FROM ENVIRONMENT</v-btn>
      </v-card-actions>
      <v-toolbar flat dense>
        <v-tabs
            v-model="tab"
            align-with-title
        >
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab
              v-for="item in items"
              :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-toolbar>


      <v-card-text class="overflow-y-auto" :style="{height:'300px'}">

        <v-tabs-items :value="tab">
          <!--PORTS-->
          <v-tab-item>
            <v-row>
              <v-col cols="12">
                <form-list
                    v-model="form.ports"
                    :new-item="{hostPort:'',containerPort:''}"
                >
                  <template v-slot:default="{item,index}">
                    <port-env-service-form v-model="form.ports[index]"></port-env-service-form>
                  </template>
                </form-list>
              </v-col>
            </v-row>
          </v-tab-item>


          <!--VOLUMES-->
          <v-tab-item>
            <v-row>
              <v-col cols="12">
                <form-list
                    v-model="form.volumes"
                    :new-item="{hostVolume:'',containerVolume:''}"
                >
                  <template v-slot:default="{item,index}">
                    <volume-env-service-form v-model="form.volumes[index]"></volume-env-service-form>
                  </template>
                </form-list>

              </v-col>

            </v-row>

          </v-tab-item>

          <!--VARIABLES-->
          <v-tab-item
              key="Variables"
          >
            <v-row>
              <v-col cols="12">
                <form-list
                    v-model="form.variables"
                    :new-item="{name:'',value:''}"
                >
                  <template v-slot:default="{item,index}">
                    <variable-env-service-form v-model="form.variables[index]"></variable-env-service-form>
                  </template>
                </form-list>

              </v-col>
            </v-row>
          </v-tab-item>


        </v-tabs-items>
      </v-card-text>
    </v-card>

  </v-form>
</template>

<script>

import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'

import EnvironmentCombobox from "../../../../components/EnvironmentCombobox";
import ServiceCombobox from "../../../../components/ServiceCombobox";
import VariableEnvServiceForm from "@/modules/devops/components/VariableEnvServiceForm";
import FormList from "@/modules/devops/components/FormList/FormList";
import PortEnvServiceForm from "@/modules/devops/components/PortEnvServiceForm";
import VolumeEnvServiceForm from "@/modules/devops/components/VolumeEnvServiceForm";
import ServiceProvider from "@/modules/devops/providers/ServiceProvider";
import DockerProvider from "@/modules/devops/providers/DockerProvider";


export default {
  name: "EnvironmentServiceForm",
  mixins: [InputErrorsByProps, RequiredRule],
  components: {
    VolumeEnvServiceForm,
    PortEnvServiceForm,
    FormList,
    VariableEnvServiceForm,
    EnvironmentCombobox,
    ServiceCombobox
  },
  props: {
    value: {type: Object, required: true},
    id: {type: String}
  },
  computed: {
    form: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    form: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    async getFromEnvironment() {
      let service = await this.findDockerService()
      this.form.variables = service.envs.map(v => ({name: v.name, value: v.value}))
      this.form.ports = service.ports.map(p => ({hostPort: p.hostPort, containerPort: p.containerPort}))
      this.form.volumes = service.volumes.map(v => ({hostVolume: v.hostVolume, containerVolume: v.containerVolume}))

    },
    async getFromService() {
      let service = await this.findService()
      this.form.variables = service.variables.map(v => ({name: v.name, value: v.defaultValue}))
      this.form.ports = service.ports.map(p => ({hostPort: p, containerPort: ''}))
      this.form.volumes = service.volumes.map(v => ({hostVolume: v, containerVolume: ''}))
    },
    findService() {
      return new Promise((resolve, reject) => {
        ServiceProvider.findService(this.form.service)
            .then(r => {
              resolve(r.data.findService)
            })
            .catch(err => reject(err))
      })
    },
    findDockerService() {
      return new Promise((resolve, reject) => {
        DockerProvider.findDockerService(this.id)
            .then(r => {
              resolve(r.data.findDockerService)
            })
            .catch(err => reject(err))
      })
    }
  },
  data() {
    return {
      tab: 0,
      items: ['Puertos', 'Volumenes', 'Variables']
    }
  }
}
</script>

<style scoped>

</style>

