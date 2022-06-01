<template>
  <v-form ref="form" autocomplete="off">

    <v-row>

      <v-col cols="12" sm="4">
        <platform-combobox v-model="form.platform" :input-errors="inputErrors"/>
      </v-col>


      <v-col cols="12" sm="4">
        <v-text-field
            prepend-icon="fingerprint"
            name="name"
            v-model="form.name"
            :label="$t('devops.service.labels.name')"
            :placeholder="$t('devops.service.labels.name')"
            :error="hasInputErrors('name')"
            :error-messages="getInputErrors('name')"
            color="secondary"
            :rules="required"
        ></v-text-field>
      </v-col>


      <v-col cols="12" sm="4">
        <v-text-field

            prepend-icon="label"
            name="description"
            v-model="form.description"
            :label="$t('devops.service.labels.description')"
            :placeholder="$t('devops.service.labels.description')"
            :error="hasInputErrors('description')"
            :error-messages="getInputErrors('description')"
            color="secondary"

        ></v-text-field>
      </v-col>


      <v-col cols="12" sm="6">
        <v-text-field

            prepend-icon="album"
            name="image"
            v-model="form.image"
            :label="$t('devops.service.labels.image')"
            :placeholder="$t('devops.service.labels.image')"
            :error="hasInputErrors('image')"
            :error-messages="getInputErrors('image')"
            color="secondary"

        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field

            prepend-icon="source"
            name="repository"
            v-model="form.repository"
            :label="$t('devops.service.labels.repository')"
            :placeholder="$t('devops.service.labels.repository')"
            :error="hasInputErrors('repository')"
            :error-messages="getInputErrors('repository')"
            color="secondary"

        ></v-text-field>
      </v-col>

    </v-row>

    <v-card outlined>
      <v-toolbar flat>
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
              <v-col cols="12" sm="6">
                <form-list
                    v-model="form.ports"
                    :new-item="''"
                >
                  <template v-slot:default="{item,index}">
                    <v-text-field
                        icon="connecting_airports"
                        name="ports"
                        type="number"
                        v-model.number="form.ports[index]"
                        :label="$t('devops.service.labels.port')"
                        :placeholder="$t('devops.service.labels.port')"
                        :error="hasInputErrors('ports')"
                        :error-messages="getInputErrors('ports')"
                        color="secondary"
                        :rules="required"
                    >
                      <template v-slot:prepend-inner>
                        <v-chip small>{{ index + 1 }}</v-chip>
                      </template>

                    </v-text-field>
                  </template>
                </form-list>
              </v-col>
            </v-row>
          </v-tab-item>


          <!--VOLUMES-->
          <v-tab-item>
            <v-row>
              <v-col cols="12" sm="6">
                <form-list
                    v-model="form.volumes"
                    :new-item="''"
                >
                  <template v-slot:default="{item,index}">
                    <v-text-field
                        icon="storage"
                        name="volumes"
                        v-model="form.volumes[index]"
                        :label="$t('devops.service.labels.volume')"
                        :placeholder="$t('devops.service.labels.volume')"
                        :error="hasInputErrors('volumes')"
                        :error-messages="getInputErrors('volumes')"
                        color="secondary"
                        :rules="required"
                    >
                      <template v-slot:prepend-inner>
                        <v-chip small>{{ index + 1 }}</v-chip>
                      </template>

                    </v-text-field>
                  </template>
                </form-list>

              </v-col>

            </v-row>

          </v-tab-item>

          <!--FILES-->
          <v-tab-item>
            <v-row>
              <v-col cols="12" sm="12">
                <form-list
                    v-model="form.files"
                    :new-item="{fileName:'',fileContent:'',containerPath:''}"
                >
                  <template v-slot:default="{item,index}">
                    <file-service-form v-model="form.files[index]"></file-service-form>
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
              <v-col cols="12" sm="12" md="12">
                <form-list
                    v-model="form.envs"
                    :new-item="{name:'',defaultValue:''}"
                >
                  <template v-slot:default="{item,index}">
                    <variable-service-form v-model="form.envs[index]"></variable-service-form>
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
                    :new-item="{name:'',operation:'',defaultValue:''}"
                >
                  <template v-slot:default="{item,index}">
                    <variable-service-form :tabsType="'constraints'" v-model="form.constraints[index]"></variable-service-form>
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
                    :new-item="{name:'Spread', defaultValue:''}"
                >
                  <template v-slot:default="{item,index}">
                    <variable-preferences-service-form :tabsType="'preferences'" v-model="form.preferences[index]"></variable-preferences-service-form>
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

import PlatformCombobox from "../../../../components/PlatformCombobox";
import FormList from "@/modules/devops/components/FormList/FormList";
import VariableServiceForm from "@/modules/devops/components/VariableServiceForm/VariableServiceForm";
import VariablePreferencesServiceForm from "@/modules/devops/components/VariablePreferencesServiceForm/VariablePreferencesServiceForm";
import LimitServiceForm from "@/modules/devops/components/LimitServiceForm/LimitServiceForm";
import FileServiceForm from "@/modules/devops/components/FileServiceForm/FileServiceForm"

export default {
  name: "ServiceForm",
  mixins: [InputErrorsByProps, RequiredRule],
  components: {
    VariableServiceForm,
    LimitServiceForm,
    FileServiceForm,
    FormList,
    PlatformCombobox,
    VariablePreferencesServiceForm,
  },
  props: {
    value: {
      type: Object,
      required: true
    },
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
    }
  },
  data() {
    return {
      tab: 0,
      items: [
        this.$t('devops.service.labels.port'), 
        this.$t('devops.service.labels.volume'), 
        this.$t('devops.service.labels.file'),
        'Envs',
        this.$t('devops.service.labels.constraints'),
        this.$t('devops.service.labels.limits'),
        this.$t('devops.service.labels.preferences')
      ]
    }
  }
}
</script>

<style scoped>

</style>

