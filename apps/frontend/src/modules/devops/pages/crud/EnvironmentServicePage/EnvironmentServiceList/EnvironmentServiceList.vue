<template>
  <v-row row wrap>
    <v-col cols="12">
      <v-row justify="space-between">
        <v-col cols="12" sm="6" md="8">
          <v-row>
            <v-col cols="12" md="4">
              <environment-combobox v-model="filters[0].value" @input="getPaginatedServices" clearable />
            </v-col>

            <v-col cols="12" md="5">
              <stack-combobox v-model="filters[1].value" @input="getPaginatedServices" clearable />
            </v-col>

            <v-col cols="12" md="4">

            </v-col>
          </v-row>

        </v-col>
        <v-col cols="12" sm="6" md="4">
          <search-input @search="performSearch" v-model="search" />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">

      <v-data-table class="mt-3" :loading="loading" :single-expand="false" :search="search" :headers="headers"
        :items="services" :sort-by.sync="orderBy" :sort-desc.sync="orderDesc" :page.sync="pageNumber"
        :server-items-length="totalItems" :items-per-page.sync="itemsPerPage"
        :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }" @update:page="getPaginatedServices"
        @update:sort-by="getPaginatedServices" @update:sort-desc="getPaginatedServices"
        @update:items-per-page="getPaginatedServices">


        <template v-slot:item.environment="{ item }">
          {{ item.environment ? item.environment.name : '' }}
        </template>

        <template v-slot:item.service="{ item }">
          {{ item.service ? item.service.name : '' }}
        </template>

        <template v-slot:item.stack="{ item }">
          {{ item.stack ? item.stack.name : '' }}
        </template>

        <template v-slot:item.version="{ item }">
          {{ item.version ? item.version : '' }}
        </template>


        <template slot="no-data">
          <div class="text-xs-center" v-t="'common.noData'"></div>
        </template>

        <template slot="loading">
          <div class="text-xs-center" v-t="'common.loading'"></div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusChipColor(item)" outlined label small>
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.deploy="{ item }">
          <v-btn color="purple" class="white--text" outlined x-small @click="openDeploy(item)"
            :disabled="!$store.getters.hasPermission(`${item.environment.type}_DEPLOY`)">
            {{ $t('devops.service.deploy') }}
          </v-btn>
        </template>

        <template v-slot:item.delete="{ item }">
          <v-btn color="red" class="white--text" outlined x-small @click="$emit('deleteService', item)"
            :disabled="!$store.getters.hasPermission(`${item.environment.type}_DELETE`) || (item.status !== $t('devops.service.active'))">
            {{ $t('devops.service.delete.action') }}
          </v-btn>
        </template>

        <template v-slot:item.action="{ item }">
          <show-button
            v-if="$store.getters.hasPermission('ENVIRONMENTSERVICE_SHOW') && $store.getters.hasPermission(`${item.environment.type}_VIEW`)"
            @click="$emit('show', item)" />

          <edit-button
            v-if="$store.getters.hasPermission('ENVIRONMENTSERVICE_UPDATE') && $store.getters.hasPermission(`${item.environment.type}_EDIT`)"
            @click="$emit('update', item)" />

          <delete-button
            v-if="$store.getters.hasPermission('ENVIRONMENTSERVICE_DELETE') && $store.getters.hasPermission(`${item.environment.type}_EDIT`)"
            @click="$emit('delete', item)" />
        </template>

      </v-data-table>
    </v-col>

    <environment-service-docker-deploy v-if="deploy" v-model="deploy" :env-service="envServiceToDeploy"
      @close="closeDeploy" />

  </v-row>
</template>

<script>
// import EnvironmentServiceProvider from "../../../../providers/EnvironmentServiceProvider";

import { DeleteButton, EditButton, ShowButton, SearchInput } from "@dracul/common-frontend"
import StackCombobox from "@/modules/devops/components/StackCombobox/StackCombobox";
import EnvironmentCombobox from "@/modules/devops/components/EnvironmentCombobox/EnvironmentCombobox";
import { EnvironmentServiceDockerDeploy }
  from "../../../../components/EnvironmentServiceDockerDeploy";
import ServicesList from "./ServicesList";


export default {
  name: "EnvironmentServiceList",
  components: {
    EnvironmentServiceDockerDeploy,
    EnvironmentCombobox,
    StackCombobox,
    DeleteButton, EditButton, ShowButton, SearchInput
  },

  data() {
    return {
      services: [],
      totalItems: null,
      loading: false,
      orderBy: null,
      orderDesc: false,
      itemsPerPage: 5,
      pageNumber: 1,
      search: '',
      filters: [
        {
          field: 'environment',
          operator: 'eq', //(eq|contain|regex|gt|lt|lte|gte)
          value: null
        },
        {
          field: 'stack',
          operator: 'eq', //(eq|contain|regex|gt|lt|lte|gte)
          value: null
        }
      ],
      deploy: false,
      envServiceToDeploy: null
    }
  },
  computed: {
    headers() {
      return [
        //Entity Headers
        { text: this.$t('devops.service.labels.environment'), value: 'environment' },
        { text: this.$t('devops.service.labels.stack'), value: 'stack' },
        { text: this.$t('devops.service.labels.serviceTemplate'), value: 'service' },
        { text: this.$t('devops.service.labels.name'), value: 'name' },
        { text: this.$t('devops.service.labels.image'), value: 'image' },
        //{text: this.$t('devops.service.labels.replicas'), value: 'replicas'},
        { text: this.$t('devops.service.status'), value: 'status', sortable: false },
        //Actions
        { text: this.$t('devops.service.deploy'), value: 'deploy', sortable: false },
        { text: this.$t('devops.service.delete.action'), value: 'delete', sortable: false },
        { text: this.$t('common.actions'), value: 'action', sortable: false },
      ]
    },
    getOrderBy() {
      return (Array.isArray(this.orderBy)) ? this.orderBy[0] : this.orderBy
    },
    getOrderDesc() {
      return (Array.isArray(this.orderDesc)) ? this.orderDesc[0] : this.orderDesc
    },
  },
  async created() {
    await this.getPaginatedServices()
    await ServicesList.setInitialServicesStatus(this.services, this.$t('devops.service.unknown'))
  },
  methods: {
    openDeploy(envService) {
      this.envServiceToDeploy = envService
      this.deploy = true
    },
    async closeDeploy() {
      this.serviceToCreate = null
      this.deploy = false

      await this.getPaginatedServices()
    },
    async performSearch() {
      this.pageNumber = 1
      await this.getPaginatedServices()
    },
    getStatusChipColor(service) {
      let serviceStatusChipColor = null

      if (service.status == this.$t('devops.service.active')) {
        serviceStatusChipColor = 'green'
      } else if (service.status == this.$t('devops.service.unknown')) {
        serviceStatusChipColor = 'orange'
      }

      return serviceStatusChipColor
    },

    async fetchServiceStatus(service) {
      try {
        console.log(`serviceID: ${service.id}`)
        const status = await ServicesList.getServiceStatus(
          service.id,
          this.$t('devops.service.active'),
          this.$t('devops.service.inactive')
        )
        console.log(`status: ${status}`)
        service.status = status; // Assuming status is fetched and set properly
        return service;
      } catch (error) {
        console.error(`An error occurred while fetching status for service ${service.id}: ${error}`);
        return service; // Return service even if status couldn't be fetched
      }
    },

    async getPaginatedServices() {
      this.loading = true
      try {
        const { items, totalItems } = await ServicesList.getPaginatedServices(
          this.pageNumber,
          this.itemsPerPage,
          this.search,
          this.filters,
          this.getOrderBy,
          this.getOrderDesc
        )

        this.services = items
        await ServicesList.setInitialServicesStatus(this.services, this.$t('devops.service.unknown'))
        for (let i = 0; i < items.length; i++) {
          this.$set(items, i, await this.fetchServiceStatus(items[i]));
        }
        this.totalItems = totalItems
      } catch (error) {
        console.error(`An error happened when we tried to getPaginatedServices the environment services: '${error}'`)
      } finally {
        this.loading = false
      }
    },




  }
}
</script>


