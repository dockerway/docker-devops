<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-col cols="12" >
          <EnvironmentCombobox v-model="environment"
            isRequired
            solo
            icon=""
          />
        <v-alert v-if="noEnvironmentWasSelected" 
          color="red" 
          type="error"
        >
          {{ this.$t('devops.discovery.error') }}
        </v-alert>
    
        </v-col>
      </v-row>

      <v-row>
          <v-col cols="12" class="text-right">
            <v-btn large color="green" :loading="filterLoading" @click="setFilters" class="">
              {{ $t('nodes.search') }}
            </v-btn>
          </v-col>
        </v-row>

    </v-card-text>
  </v-card>
</template>
  
<script>
import EnvironmentCombobox from "@/modules/devops/components/EnvironmentCombobox/EnvironmentCombobox";

export default {
  name: 'NodesFilter',
  props: {
    filterLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      environment: null,
      noEnvironmentWasSelected: false
    }
  },
  components: { EnvironmentCombobox },
  methods: {
    setFilters() {
      if (this.environment) {
        this.noEnvironmentWasSelected = false
        this.$emit('updateFilters', this.environment)
      } else {
        this.noEnvironmentWasSelected = true
      }
    },
  }
}
</script>

<style lang="scss" scoped>
#no-background-hover::before {
  background-color: transparent !important;
}
</style>