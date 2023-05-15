<template>
  <v-form ref="form" autocomplete="off" @submit.prevent="save">
    <v-row>

      <v-col cols="12" sm="4">
        <environment-combobox v-model="form.environment" :input-errors="inputErrors"/>
      </v-col>

      <v-col cols="12" sm="4">
        <stack-combobox v-model="form.stack" :input-errors="inputErrors"></stack-combobox>
      </v-col>

      <v-col cols="12" sm="4">
        <service-combobox v-model="form.service" :input-errors="inputErrors" @image="v => form.image = v"/>
      </v-col>



      <v-col cols="12" sm="6">
        <v-text-field

            prepend-icon="image"
            name="image"
            v-model="form.image"
            :label="$t('devops.serviceTemplate.labels.image')"
            :placeholder="$t('devops.serviceTemplate.labels.image')"
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
            :label="$t('devops.service.labels.replicas')"
            :placeholder="$t('devops.service.labels.replicas')"
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
            :label="$t('devops.serviceTemplate.labels.name')"
            :placeholder="$t('devops.serviceTemplate.labels.name')"
            :error="hasInputErrors('name')"
            :error-messages="getInputErrors('name')"
            color="secondary"
            :rules="required"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="12">
        <v-text-field
            prepend-icon="touch_app"
            name="command"
            v-model="form.command"
            :label="$t('devops.service.labels.command')"
            :placeholder="$t('devops.service.labels.command')"
            :error="hasInputErrors('command')"
            :error-messages="getInputErrors('command')"
            color="secondary"
        ></v-text-field>
      </v-col>

    </v-row>

    <v-card outlined>

      <v-card-actions class="py-1 my-0">
        <v-spacer></v-spacer>
        <v-btn x-small color="blue" @click="getFormValuesFromServiceOrServiceTemplate(false)">Get from template</v-btn>
        <v-btn x-small color="green" @click="getFormValuesFromServiceOrServiceTemplate(true)">Get from service</v-btn>
      </v-card-actions>
      <v-toolbar flat dense>
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-toolbar>


      <v-card-text class="overflow-y-auto" :style="{ height: '300px' }">

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

          <!--FILES-->
          <v-tab-item>
            <v-row>
              <v-col cols="12">
                <form-list
                    v-model="form.files"
                    :new-item="{fileName:'',fileContent:'',hostPath:'',containerPath:''}"
                >
                  <template v-slot:default="{item,index}">
                    <file-env-service-form v-model="form.files[index]" :files="form.files"></file-env-service-form>
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
                    :new-item="{name:'Spread', value:''}"
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

import { InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'

import EnvironmentCombobox from "../../../../components/EnvironmentCombobox";
import ServiceCombobox from "../../../../components/ServiceCombobox";
import VariableEnvServiceForm from "@/modules/devops/components/VariableEnvServiceForm";
import FormList from "@/modules/devops/components/FormList/FormList";
import PortEnvServiceForm from "@/modules/devops/components/PortEnvServiceForm";
import VolumeEnvServiceForm from "@/modules/devops/components/VolumeEnvServiceForm";
import FileEnvServiceForm from "@/modules/devops/components/FileEnvServiceForm";
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
    FileEnvServiceForm,
    PortEnvServiceForm,
    FormList,
    VariableEnvServiceForm,
    EnvironmentCombobox,
    ServiceCombobox,
    VariablePreferencesEnvServiceForm
  },
  props: {
    value: { type: Object, required: true },
    id: { type: String }
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
    async getFormValuesFromServiceOrServiceTemplate(fromService) {
      try {
        let service = null

        console.log(`fromService: '${fromService}'`)

        if (fromService) {
          service = await this.findDockerService()
          console.log(`service from findDockerService`)
        } else {
          service = await this.findService()
          console.log(`service from findService`)
        }

        console.log(`service:'${JSON.stringify(service, null, 2)}'`)

        if (service.envs) {
          service.envs.forEach(env => {
            if (!fromService && env && !this.form.envs.find(e => e.name === env.name)) { //service environment variable is not empty AND it doesnt already exists in the form
              const envObject = {
                name: env.name,
                value: env.defaultValue
              }

              this.form.envs.push(envObject)
            } else if (fromService && env && !this.form.envs.find(e => e.name === env.name)) {
              const envObject = {
                name: env.name,
                value: env.value
              }

              this.form.envs.push(envObject)
            }
          })
        }

        if (service.ports && !(this.form.ports.length === service.ports.length)) { //si, en el service, NO existe la misma cantidad de puertos que existen en el form
          service.ports.forEach(port => {
            if (!fromService && port && !this.form.ports.find(formPort => formPort.containerPort ? formPort.containerPort == port : false)) {
              const portObject = {
                hostPort: '',
                containerPort: port
              }

              this.form.ports.push(portObject)
            } else if (fromService && port && !this.form.ports.find(formPort => formPort.containerPort ? formPort.containerPort == port.containerPort : false)) {
              const portObject = {
                hostPort: port.hostPort,
                containerPort: port.containerPort
              }

              this.form.ports.push(portObject)
            }
          })
        }

        if (service.volumes) {
          service.volumes.forEach(volume => {
            if (!fromService && volume && !this.form.volumes.find(formVolume => formVolume.containerVolume == volume)) { //if volume doesnt already exists in form and info is got from service template
              const volumeObject = {
                hostVolume: '',
                containerVolume: volume
              }

              this.form.volumes.push(volumeObject)
            } else if (fromService && volume && !this.form.volumes.find(formVolume => formVolume.containerVolume == volume.containerVolume)) { //if volume doesnt already exists in form and info is got from deployed service
              const volumeObject = {
                hostVolume: volume.hostVolume,
                containerVolume: volume.containerVolume
              }

              this.form.volumes.push(volumeObject)
            }
          })
        }

        if (service.files) {
          service.files.forEach(file => {
            if (file) {
              const existingFile = this.form.files.find(f => f.containerPath === file.containerPath)
              if (!existingFile) this.form.files.push({ hostPath: file.hostPath, containerPath: file.containerPath, fileName: file.fileName, fileContent: file.fileContent })
            }
          })
        }

        if (service.constraints) {
          service.constraints.forEach(constraint => {
            if (constraint) {
              const existingConstraint = this.form.constraints.find(c => c.name === constraint.name)
              if (!existingConstraint) this.form.constraints.push({ name: constraint.name, operation: constraint.operation, value: constraint.value })
            }
          })
        }

        if (service.limits) {
          for (let index = 0; index < Object.keys(service.limits).length; index++) {
            const currentLimit = service.limits[Object.keys(service.limits)[index]]
            const currentFormLimit = this.form.limits[Object.keys(this.form.limits)[index]]

            if (currentLimit && !currentFormLimit) this.form.limits[Object.keys(this.form.limits)[index]] = currentLimit
          }
        }

        if (service.preferences) {
          service.preferences.forEach(preference => {
            if (preference) {
              switch (fromService) {
                case true: //Info is got from deployed service
                  if (!this.form.preferences.find(formPreference => formPreference.name == preference.name || formPreference.value == preference.value)) {//preference doesnt already exists in form
                    this.form.preferences.push({
                      name: preference.name,
                      value: preference.value
                    })
                  }
                  break;
                case false: //Info is got from service template
                  if (!this.form.preferences.find(formPreference => formPreference.name == preference.name || formPreference.value == preference.defaultValue)) {//preference doesnt already exists in form
                    this.form.preferences.push({
                      name: preference.name,
                      value: preference.defaultValue
                    })
                  }
                  break;
              }
            }
          })
        }
        } catch (error) {
          console.error(`An error happened at findService: '${error}'`)
          throw error
        }

    },
    async findService() {
      try {
        return (await ServiceProvider.findService(this.form.service)).data.findService
      } catch (error) {
        console.error(`An error happened at findService: '${error}'`)
        throw error
      }
    },
    async findDockerService() {
      try {
        return (await DockerProvider.findDockerService(this.id)).data.findDockerService
      } catch (error) {
        console.error(`An error happened at getFormValuesFromServiceOrServiceTemplate: '${error}'`)
        throw error
      }
    },


  },
  data() {
    return {
      tab: 0,
      items: [
        this.$t('devops.serviceTemplate.labels.port'),
        this.$t('devops.serviceTemplate.labels.volume'),
        this.$t('devops.serviceTemplate.labels.file'),
        'Envs',
        'Labels',
        this.$t('devops.serviceTemplate.labels.constraints'),
        this.$t('devops.serviceTemplate.labels.limits'),
        this.$t('devops.serviceTemplate.labels.preferences')
      ]
    }
  }
}
</script>

<style scoped></style>

