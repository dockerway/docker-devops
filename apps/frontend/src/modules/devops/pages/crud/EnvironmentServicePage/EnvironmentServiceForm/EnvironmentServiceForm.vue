<template>
  <v-form ref="form" autocomplete="off" @submit.prevent="save">
    <v-row>

      <v-col cols="12" sm="4">
        <environment-combobox v-model="form.environment" :input-errors="inputErrors"/>
      </v-col>

      <v-col cols="12" sm="4">
        <stack-combobox v-model="form.stack" :input-errors="inputErrors" ></stack-combobox>
      </v-col>

      <v-col cols="12" sm="4">
        <service-combobox v-model="form.service" :input-errors="inputErrors"/>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field

            prepend-icon="image"
            name="image"
            v-model="form.image"
            :label="$t('devops.environmentService.labels.image')"
            :placeholder="$t('devops.environmentService.labels.image')"
            :error="hasInputErrors('image')"
            :error-messages="getInputErrors('image')"
            color="secondary"
            :rules="required"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="3">
        <v-text-field

            prepend-icon="double_arrow"
            name="replicas"
            v-model="form.replicas"
            :label="$t('devops.environmentService.labels.replicas')"
            :placeholder="$t('devops.environmentService.labels.replicas')"
            :error="hasInputErrors('replicas')"
            :error-messages="getInputErrors('replicas')"
            color="secondary"
            :rules="required"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="3">
        <v-text-field
            prepend-icon="title"
            name="name"
            v-model="form.name"
            :label="$t('devops.environmentService.labels.name')"
            :placeholder="$t('devops.environmentService.labels.name')"
            :error="hasInputErrors('name')"
            :error-messages="getInputErrors('name')"
            color="secondary"
            :rules="required"
        ></v-text-field>
      </v-col>

    </v-row>

    <v-card outlined>

      <v-card-actions v-if="id" class="py-1 my-0">
        <v-spacer></v-spacer>
        <v-btn x-small color="blue" @click="getFromService">GET FROM SERVICE</v-btn>
        <v-btn x-small color="green" @click="getFromEnvironment">GET FROM ENVIRONMENT</v-btn>
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
              key="Envs"
          >
            <v-row>
              <v-col cols="12">
                <form-list
                    v-model="form.envs"
                    :new-item="{name:'',value:''}"
                >
                  <template v-slot:default="{item,index}">
                    <variable-env-service-form v-model="form.envs[index]"></variable-env-service-form>
                  </template>
                </form-list>

              </v-col>
            </v-row>
          </v-tab-item>

          <!--LABELS-->
          <v-tab-item
              key="Labels"
          >
            <v-row>
              <v-col cols="12">
                <form-list
                    v-model="form.labels"
                    :new-item="{name:'',value:''}"
                >
                  <template v-slot:default="{item,index}">
                    <label-env-service-form v-model="form.labels[index]"></label-env-service-form>
                  </template>
                </form-list>

              </v-col>
            </v-row>
          </v-tab-item>

          <!--CONSTRAINTS-->
          <v-tab-item
              key="Constraints"
          >
            <v-row>
              <v-col cols="12">
                <form-list
                    v-model="form.constraints"
                    :new-item="{name:'',operation:'',value:''}"
                >
                  <template v-slot:default="{item,index}">
                    <label-env-service-form :tabsType="'constraints'" v-model="form.constraints[index]"></label-env-service-form>
                  </template>
                </form-list>

              </v-col>
            </v-row>
          </v-tab-item>

          <!--LIMITS-->
          <v-tab-item
              key="Limits"
          >
            <v-row>
              <v-col cols="12">
                  <template>
                    <limit-service-form :limits="form.limits"></limit-service-form>
                  </template>
              </v-col>
            </v-row>
          </v-tab-item>

          <!--PREFERENCES-->
          <v-tab-item
              key="Preferences"
          >
            <v-row>
              <v-col cols="12">
                <!--VER-->
                <form-list
                    v-model="form.preferences"
                    :new-item="{name:'', value:''}"
                >
                  <template v-slot:default="{item,index}">
                    <variable-preferences-env-service-form :tabsType="'preferences'" v-model="form.preferences[index]"></variable-preferences-env-service-form>
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
import StackCombobox from "@/modules/devops/components/StackCombobox/StackCombobox";
import LabelEnvServiceForm from "@/modules/devops/components/LabelEnvServiceForm/LabelEnvServiceForm";
import LimitServiceForm from "@/modules/devops/components/LimitServiceForm/LimitServiceForm";
import VariablePreferencesEnvServiceForm from "@/modules/devops/components/VariablePreferencesEnvServiceForm"

export default {
  name: "EnvironmentServiceForm",
  mixins: [InputErrorsByProps, RequiredRule],
  components: {
    LabelEnvServiceForm,
    LimitServiceForm,
    StackCombobox,
    VolumeEnvServiceForm,
    PortEnvServiceForm,
    FormList,
    VariableEnvServiceForm,
    EnvironmentCombobox,
    ServiceCombobox,
    VariablePreferencesEnvServiceForm
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
      this.form.envs = service.envs ? service.envs.map(v => ({name: v.name, value: v.value})) : []
      this.form.ports = service.ports ? service.ports.map(p => ({hostPort: p.hostPort, containerPort: p.containerPort})) : []
      this.form.volumes = service.volumes ? service.volumes.map(v => ({hostVolume: v.hostVolume, containerVolume: v.containerVolume})) : []
      this.form.constraints = service.constraints ? service.constraints.map(v => ({name: v.name, operation: v.operation, value: v.value})) : []
      this.form.limits = service.limits ? service.limits.map(v => ({ memoryReservation:v.memoryReservation, memoryLimit:v.memoryLimit, CPUReservation:v.CPUReservation, CPULimit:v.CPULimit})) : {}
      this.form.preferences = service.preferences ? service.preferences.map(p => ({name: p.name, value: p.value})) : []
    },
    async getFromService() {
      let service = await this.findService()
      this.form.envs = service.envs ? service.envs.map(v => ({name: v.name, value: v.defaultValue})) : []
      this.form.ports = service.ports ? service.ports.map(p => ({hostPort: p, containerPort: ''})) : []
      this.form.volumes = service.volumes ? service.volumes.map(v => ({hostVolume: v, containerVolume: ''})) : []
      this.form.constraints = service.constraints ? service.constraints.map(v => ({name: v.name, operation: v.operation, value: v.defaultValue})) : []
      this.form.limits = service.limits ? service.limits.map(v => ({ memoryReservation:v.memoryReservation, memoryLimit:v.memoryLimit, CPUReservation:v.CPUReservation, CPULimit:v.CPULimit})) : {}
      this.form.preferences = service.preferences ? service.preferences.map(p => ({name: p.name, value: p.defaultValue})) : []
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
    },


  },
  data() {
    return {
      tab: 0,
      items: ['Puertos', 'Volumenes', 'Envs', 'Labels', 'Constraints', 'Limits', 'Preferences']
    }
  }
}
</script>

<style scoped>

</style>

