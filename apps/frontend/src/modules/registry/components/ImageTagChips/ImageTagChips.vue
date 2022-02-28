<template>
  <v-chip-group column >
    <v-chip v-for="item in getItems" :key="item.value" small>
      <span>{{item.value}}</span>
    </v-chip>
  </v-chip-group>

</template>

<script>

import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'


import ImageProvider from "../../providers/ImageProvider"

export default {
  name: "ImageTagChips",
  mixins: [InputErrorsByProps, RequiredRule],
  props:{
    name: {type: String, required: true},
    registry: {type: String, required: true},
    showName: {type: Boolean, default: false},
    value: {type: [String, Array]},
    multiple: {type:Boolean, default: false },
    solo: {type:Boolean, default: false},
    chips: {type:Boolean, default: false},
    readonly: {type:Boolean, default:false},
    disabled: {type:Boolean, default: false},
    isRequired: {type:Boolean, default: false },
    clearable: {type:Boolean, default: false},
  },
  data() {
    return {
      data: {
        name: null,
        tags: []
      },
      loading: false
    }
  },
  computed: {
    getItems(){
      if(this.showName){
        return this.data.tags ? this.data.tags.map(tag => ({text:this.data.name+":"+tag, value: tag})).sort((a, b) => b.value.localeCompare(a.value)) : []
      }else{
        return this.data.tags ? this.data.tags.map(tag => ({text:tag, value: tag})).sort((a, b) => b.value.localeCompare(a.value)) : []
      }
    },
    item: {
      get() { return this.value },
      set(val) {this.$emit('input', val)}
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    validate(){
      return this.$refs.form.validate()
    },
    fetch() {
      if (this.registry) {
        this.fetchImageTags()
      } else {
        this.fetchImageTagsByFullname()
      }
    },
    fetchImageTags() {
      this.loading = true
      ImageProvider.imageTags(this.registry, this.name).then(r => {
        this.data = r.data.imageTags
      }).catch(err => console.error(err))
          .finally(() => this.loading = false)
    },
    fetchImageTagsByFullname() {
      this.loading = true
      ImageProvider.imageTagsByFullname(this.name).then(r => {
        this.data = r.data.imageTagsByFullname
      }).catch(err => console.error(err))
          .finally(() => this.loading = false)
    }

  }
}
</script>

<style scoped>

</style>
