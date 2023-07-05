<template>
  <v-autocomplete
      prepend-icon="table_rows"
      :items="items"
      :item-text="'name'"
      :item-value="'id'"
      v-model="item"
      :label="$t('devops.service.labels.stack')"
      :loading="loading"
      :error="hasInputErrors('stack')"
      :error-messages="getInputErrors('stack')"
      color="secondary"
      item-color="secondary"
      :rules="isRequired ? required : []"
      :multiple="multiple"
      :chips="chips" small-chips
      :solo="solo"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :hide-details="hideDetails"
      :style="{width: width, maxWidth: width}"
      :return-object="returnObject"
  ></v-autocomplete>

</template>

<script>

import { InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'


import StackProvider from "../../providers/StackProvider"

export default {
  name: "StackCombobox",
  mixins: [InputErrorsByProps, RequiredRule],
  props: {
    value: { type: [String, Array] },
    multiple: { type: Boolean, default: false },
    solo: { type: Boolean, default: false },
    chips: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    hideDetails: { type: Boolean, default: false },
    width: { type: String, default: null },
    returnObject: { type: Boolean, default: false },
  },
  data() {
    return {
      items: [],
      loading: false,
      platform: null,
    }
  },
  computed: {
    item: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  async mounted() {
    await this.fetch()
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    async fetch() {
      this.loading = true

      try {
        this.items = (await StackProvider.fetchStack()).data.fetchStack
        this.sortItemsByName()
      } catch (error) {
        console.error(`An error happened at the fetch method: '${error.message ? error.message : error}'`)
      }finally{
        this.loading = false
      }
    },
    setPlatformStacks(platform) {
      let stacks = this.items.filter(s => (s.platform && s.platform.id == platform))
      this.item = stacks
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
