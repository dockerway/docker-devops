<template>
  <v-autocomplete v-if="getItems && getItems.length > 0"
    prepend-icon="tag" 

    color="secondary" 
    item-color="secondary"
    
    :label="$t('registry.image.tag')" 
    :hide-details="hideDetails" 

    :disabled="disabled" 
    :readonly="readonly"
    :clearable="clearable"

    :outlined="outlined" 
    :loading="loading" 
    
    :chips="chips" 
    :solo="solo" 
    :multiple="multiple" 
    v-model="item" 
    :items="getItems" 
    :rules="isRequired ? required : []"
  />

  <v-text-field v-else label="Image Tag" v-model="value" :loading="loading" />
</template>

<script>

import { InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'


import ImageProvider from "../../providers/ImageProvider"

export default {
  name: "ImageTagCombobox",
  mixins: [InputErrorsByProps, RequiredRule],
  props: {
    name: { type: String, required: true },
    registry: { type: String, required: false },
    showName: { type: Boolean, default: false },
    value: { type: [String, Array] },
    multiple: { type: Boolean, default: false },
    solo: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    hideDetails: { type: Boolean, default: false },
    chips: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    wishedImage: {type: String},
  },
  data() {
    return {
      data: null,
      loading: false
    }
  },
  computed: {
    getItems() {
      if (this.data && this.data.tags && this.data.tags.length > 0) {

        return this.data.tags
          .map(tag => ({
            text: this.showName ? this.data.name + ":" + tag : tag,
            value: tag
          }))
          .sort((a, b) => b.value.localeCompare(a.value))
      }

      return []
    },
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

    this.setDefaultSelectedItem()

  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    async fetch() {

      if (this.registry) {
        await this.fetchImageTags()
      } else {
        await this.fetchImageTagsByFullname()
      }

    },
    async fetchImageTags() {
      this.loading = true

      try {
        this.data = (await ImageProvider.imageTags(this.registry, this.name)).data.imageTags
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }

    },
    async fetchImageTagsByFullname() {
      this.loading = true

      try {
        if(this.name){
          this.data = (await ImageProvider.imageTagsByFullname(this.name)).data.imageTagsByFullname
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }

    },

    setDefaultSelectedItem() {
      if (this.wishedImage && this.data && this.data.tags && this.data.tags.includes(this.wishedImage)) {
        this.item = this.wishedImage
      }
    }

  }
}
</script>

<style scoped></style>
