<template>
  <v-form ref="form" autocomplete="off">

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


    <v-tabs-items v-model="tab">
      <v-tab-item
          key="Principal"
      >
        <v-row>

          <v-col cols="12" sm="6">
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


          <v-col cols="12" sm="6">
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
            <platform-combobox v-model="form.platform" :input-errors="inputErrors"/>
          </v-col>


          <v-col cols="12" sm="6">
            <list-combobox

                icon="storage"
                name="volumes"
                v-model="form.volumes"
                :label="$t('devops.service.labels.volumes')"
                :error="hasInputErrors('volumes')"
                :error-messages="getInputErrors('volumes')"
            ></list-combobox>
          </v-col>


          <v-col cols="12" sm="6">
            <list-combobox

                icon="connecting_airports"
                name="ports"
                v-model="form.ports"
                :label="$t('devops.service.labels.ports')"
                :error="hasInputErrors('ports')"
                :error-messages="getInputErrors('ports')"
            ></list-combobox>
          </v-col>


        </v-row>
      </v-tab-item>

      <v-tab-item
          key="Variables"
      >
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <form-list
                v-model="form.variables"
                :new-item="{name:'',defaultValue:''}"
            >
              <template v-slot:default="{item,index}">
                <variable-service-form v-model="form.variables[index]"></variable-service-form>
              </template>
            </form-list>

          </v-col>
        </v-row>


      </v-tab-item>

    </v-tabs-items>


  </v-form>
</template>

<script>

import {InputErrorsByProps, RequiredRule, ListCombobox} from '@dracul/common-frontend'

import PlatformCombobox from "../../../../components/PlatformCombobox";
import FormList from "@/modules/devops/components/FormList/FormList";
import VariableServiceForm from "@/modules/devops/components/VariableServiceForm/VariableServiceForm";


export default {
  name: "ServiceForm",
  mixins: [InputErrorsByProps, RequiredRule],
  components: {
    VariableServiceForm,
    FormList,
    PlatformCombobox,
    ListCombobox
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
      items: ['Principal', 'Variables', 'Volumenes']
    }
  }
}
</script>

<style scoped>

</style>

