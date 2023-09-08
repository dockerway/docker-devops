<template>
  <v-container fluid>

    <v-card>
      <v-card-title>
        {{ this.$t('devops.discovery.title') }}

        <v-spacer />

        <v-btn class="green" :disabled="addServicesButtonIsDisabled" dark @click="createDiscovery"
          :loading="createDiscoveredServicesLoading">
          {{ this.$t('devops.discovery.add') }}
        </v-btn>
      </v-card-title>
      <v-card-subtitle>{{ this.$t('devops.discovery.subtitle') }}</v-card-subtitle>

      <DiscoveredServiceFilters @updateFilters="fetchServicesByFilters" />
      <v-divider />
    </v-card>

    <v-card class="rounded-0">
      <v-card-text>
        <v-data-table dense show-select :items="getTableItems" :headers="headers" :items-per-page.sync="itemsPerPage"
          :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50, 100] }" :loading="loading" v-model="selectedServices"
          item-key="keyName" row-class="customRowClass">
          <template v-slot:item.namespace="{ item }">
            <v-card-text v-if="item.namespace">{{ item.namespace }}</v-card-text>
            <PlatformCombobox v-else :item-value="'name'" v-model="item.namespace" />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-col cols="12" v-if="created">
      <v-row>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>
              {{this.$t("devops.discovery.addMessages.PlatformsCreated")}}
            </v-card-title>
            <v-card-text>
              <h4 class="text-h4">
                {{ created.platformsCreated.length }}
              </h4>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>
              {{this.$t("devops.discovery.addMessages.StacksCreated")}}
            </v-card-title>
            <v-card-text>
              <h4 class="text-h4">
                {{ created.stacksCreated.length }}
              </h4>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>
              {{this.$t("devops.discovery.addMessages.ServicesCreated")}}
            </v-card-title>
            <v-card-text>
              <h4 class="text-h4">
                {{ created.servicesCreated.length }}
              </h4>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>
              {{this.$t("devops.discovery.addMessages.EnvironmentServicecreated")}}
            </v-card-title>
            <v-card-text>
              <h4 class="text-h4">
                {{ created.environmentServicesCreated.length }}
              </h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import DiscoveredServiceFilters from "./DiscoveredServiceFilters.vue";
import DiscoveryProvider from "@/modules/devops/providers/DiscoveryProvider";
import PlatformCombobox from "@/modules/devops/components/PlatformCombobox/PlatformCombobox";

export default {
  name: "DiscoveryPage",
  data() {
    return {
      selectedServices: [],
      filteredServices: [],
      discovery: [],
      filters: {},
      createDiscoveredServicesLoading: false,
      addServicesButtonIsDisabled: true,
      isFiltering: false,
      created: false,
      loading: false,
      itemsPerPage: 25,
    }
  },
  components: { DiscoveredServiceFilters, PlatformCombobox },
  computed: {
    headers() {
      return [
        { text: this.$t('devops.service.labels.name'), value: 'name' },
        { text: this.$t('devops.service.labels.image'), value: 'imageName' },
        { text: this.$t('devops.service.labels.platform'), value: 'namespace' },
        { text: this.$t('devops.service.labels.stack'), value: 'stack' },
      ]
    },
    getSelectedWithPlatform() {
      return this.selectedServices.filter(service => service.namespace)
    },
    servicesDiscovered() {
      return this.discovery.servicesDiscovered
    },

    getTableItems() {
      if (this.isFiltering) {
        return this.filteredServices
      }

      return this.discovery.servicesDiscovered
    },
  },
  watch: {
    selectedServices(newValue) {
      if (newValue.length > 0 && newValue.filter(service => service.namespace).length > 0) {
        this.addServicesButtonIsDisabled = false
      } else {
        this.addServicesButtonIsDisabled = true
      }
    },
    created(newValue) {
      if (newValue) window.scrollTo({ top: (document.body.scrollHeight + 800), behavior: 'smooth' })
    },
  },
  methods: {
    async createDiscovery() {
      if (this.getSelectedWithPlatform.length > 0) {
        try {
          this.loading = true
          const createDiscovery = await DiscoveryProvider.createDiscovery(this.getSelectedWithPlatform)
          this.created = createDiscovery.data.createDiscovery
        } catch (error) {
          console.log(`An error happened when we tried to create the discovery '${error}'`)
        } finally {
          this.loading = false
        }
      }
    },

    async startDiscovery() {
      this.loading = true
      try {
        this.discovery = (await DiscoveryProvider.startDiscovery(this.environment)).data.startDiscovery
      } catch (error) {
        console.error("An error happened while we tried to start the discovery process: ", error)
      } finally {
        this.loading = false
      }
    },

    async fetchServicesByFilters(filters) {
      try {
        this.isFiltering = true
        this.filters = filters
        this.environment = filters.environment

        await this.startDiscovery()
        this.filteredServices = this.discovery.servicesDiscovered.filter((service) => {

          if (filters.serviceStack && !service.stack) return false
          if (filters.serviceName && !service.name) return false
          if (filters.serviceName && !service.name.toLowerCase().includes(filters.serviceName.toLowerCase())) return false
          if (filters.serviceStack && service.stack && !service.stack.toLowerCase().includes(filters.serviceStack.toLowerCase())) return false

          return true
        })
      } catch (error) {
        console.error("An error happened at the fetchServicesByFilters function: ", error)
      }
    }
  }
}
</script>

<style scoped></style>
