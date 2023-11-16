<template>
    <v-card>
      <v-card-text class="pa-4">
        <v-row>
          <!-- Input -->
          <v-col cols="12" xs="12" sm="6" md="4">
            <v-row class="pa-6">
              <v-text-field 
                prependIcon="badge"
                :label="this.$t('devops.service.labels.name')"
                clearable
                v-model="serviceName"
              />
            </v-row>
          </v-col>

          <v-col cols="12" xs="12" sm="6" md="4">
            <v-row class="pa-6">
              <v-text-field 
                prependIcon="wifi"
                :label="this.$t('devops.service.labels.stack')"
                clearable
                v-model="serviceStack"
              />
            </v-row>
          </v-col>

          <v-col cols="12" xs="12" sm="6" md="4" class="pa-6">
            <EnvironmentCombobox isRequired v-model="environment"/>
          </v-col>
        </v-row>

        <v-alert
        v-if="noEnvironmentWasSelected"
        color="red"
        type="error"
        >{{ this.$t('devops.discovery.error') }}</v-alert>

        <!-- Actions -->
        <v-row>
          <v-col cols="12" class="text-right" >
            <v-btn small text @click="cleanFilters" id="no-background-hover">
              {{ $t('devops.discovery.filters.reset') }}
            </v-btn>
            <v-btn
                large
                color="red" 
                :loading="filterLoading" 
                @click="setFilters"
            >
              {{ $t("devops.discovery.filters.apply") }}
            </v-btn>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>
  </template>
  
  <script>  
    import EnvironmentCombobox from "@/modules/devops/components/EnvironmentCombobox/EnvironmentCombobox";

  export default {
    name: 'DiscoveredServiceFilters',
    props: {
      filterLoading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        serviceName: '',
        serviceStack: '',
        environment: null,
        noEnvironmentWasSelected: false
      }
    },
    components: {EnvironmentCombobox},
    computed: {
      filters() {
        const filters = {
            serviceName: this.serviceName ,
            serviceStack: this.serviceStack,
            environment: this.environment,
        }

        return filters
    }
  },
    methods: {
      setFilters() {
        if(this.environment){
            this.noEnvironmentWasSelected = false
            this.$emit('updateFilters', this.filters)
        }else{
            this.noEnvironmentWasSelected = true
        }
      },

      cleanFilters() {
        this.serviceName = ''
        this.serviceStack = ''

        this.$emit('updateFilters', this.filters)
      }
  }
}
  </script>

<style lang="scss" scoped>
#no-background-hover::before {
   background-color: transparent !important; 
}
</style>