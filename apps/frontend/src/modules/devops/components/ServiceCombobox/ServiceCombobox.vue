<template>
  <v-autocomplete
      prepend-icon="design_services"
      :items="items"
      :item-text="'name'"
      :item-value="'id'"
      v-model="item"
      :label="$t('devops.service.labels.serviceTemplate')"
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

import { InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'


import ServiceProvider from "../../providers/ServiceProvider"

export default {
  name: "ServiceCombobox",
  mixins: [InputErrorsByProps, RequiredRule],
  props: {
    value: { type: [String, Array] },
    multiple: { type: Boolean, default: false },
    solo: { type: Boolean, default: false },
    chips: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: true },
    clearable: { type: Boolean, default: false },
    returnObject: { type: Boolean, default: false },
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

        if (this.returnObject) {
          this.$emit('input', val)
        } else {
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
    async fetch() {
      try {
        this.loading = true
        this.items = (await ServiceProvider.fetchService()).data.fetchService
        this.sortItemsByName()
      } catch (error) {
        console.error(`An error happened when we tried to fetch Services`)
      } finally {
        this.loading = false
      }
    },

    sortItemsByName() {
      this.items.sort((itemA, itemB) => {
        const nameA = itemA.name.toLowerCase()
        const nameB = itemB.name.toLowerCase()

        if (nameA < nameB) {
          return -1
        } else if (nameA > nameB) {
          return 1
        } else {
          return 0
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
