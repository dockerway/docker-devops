<template>
  <v-autocomplete
      prepend-icon="design_services"
      :items="items"
      :item-text="'name'"
      :item-value="'id'"
      v-model="item"
      :label="$t('devops.environmentService.labels.serviceTemplate')"
      :loading="loading"
      :error="hasInputErrors('service')"
      :error-messages="getInputErrors('service')"
      color="secondary"
      item-color="secondary"
      :rules="isRequired ? required : []"
      :multiple="multiple"
      :chips="chips"
      :solo="solo"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      return-object
  ></v-autocomplete>

</template>

<script>

import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'


import ServiceProvider from "../../providers/ServiceProvider"

export default {
  name: "ServiceCombobox",
  mixins: [InputErrorsByProps, RequiredRule],
  props: {
    value: {type: [String, Array]},
    multiple: {type: Boolean, default: false},
    solo: {type: Boolean, default: false},
    chips: {type: Boolean, default: false},
    readonly: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    isRequired: {type: Boolean, default: true},
    clearable: {type: Boolean, default: false},
    returnObject: {type: Boolean, default: false},
  },
  data() {
    return {
      items: [],
      loading: false
    }
  },
  computed: {
    item: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('image', val.image)

        if(this.returnObject){
          this.$emit('input', val)
        }else{
          this.$emit('input', val.id)
        }

      }
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    fetch() {
      this.loading = true
      ServiceProvider.fetchService().then(r => {
        this.items = r.data.fetchService
      }).catch(err => console.error(err))
          .finally(() => this.loading = false)
    }

  }
}
</script>

<style scoped>

</style>
