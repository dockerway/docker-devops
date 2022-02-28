<template>
  <v-container>
    <h3>Images</h3>

    <registry-combobox
        v-model="registry"
        width="300px"
        @input="fetch"
    />

    <v-data-table
        :items="images"
        :loading="loading"
        :headers="headers"
        :items-per-page="itemsPerPage"
        :footer-props="{ itemsPerPageOptions: [3, 5, 10, 25, 50] }"
    >

      <template v-slot:item.tags="{item}">
        <image-tag-chips :registry="registry" :name="item.name"></image-tag-chips>
      </template>

      <template v-slot:item.tagscombo="{item}">
        <image-tag-combobox :registry="registry" :name="item.name" hide-details></image-tag-combobox>
      </template>

    </v-data-table>
  </v-container>
</template>

<script>
import ImageProvider from "../../providers/ImageProvider";
import ImageTagChips from "@/modules/registry/components/ImageTagChips/ImageTagChips";
import ImageTagCombobox from "@/modules/registry/components/ImageTagCombobox/ImageTagCombobox";
import RegistryCombobox from "@/modules/registry/components/RegistryCombobox/RegistryCombobox";

export default {
  name: "ImagePage",
  components: {RegistryCombobox, ImageTagCombobox, ImageTagChips},
  data() {
    return {
      loading: false,
      itemsPerPage: 5,
      pageNumber: 1,
      totalItems: null,
      registry: null,
      images: []
    }
  },
  computed: {
    headers() {
      return [
        {text: 'name', value: 'name', width: '180px'},
        {text: 'tags', value: 'tags'},
        {text: 'tagscombo', value: 'tagscombo', width: '150px'},
      ]
    }
  },
  methods: {
    fetch() {
      this.loading = true
      ImageProvider.fetchImage(this.registry)
          .then(r => {
            this.images = r.data.fetchImage
            //   this.totalItems = r.data.fetchProject.length
          })
          .finally(() => this.loading = false)

    }
  }
}
</script>

<style scoped>

</style>
