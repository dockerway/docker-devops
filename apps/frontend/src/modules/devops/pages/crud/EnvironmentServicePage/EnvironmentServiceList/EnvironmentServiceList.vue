<template>
  <v-row row wrap>

    <v-col cols="12">
      <v-row justify="space-between">
        <v-col cols="12" sm="6" md="8">
          <!-- FILTERS HERE -->
          <v-row>
            <v-col cols="12" md="4">
              <environment-combobox v-model="filters[0].value" @input="fetch" clearable/>
            </v-col>

            <v-col cols="12" md="5">
              <stack-combobox v-model="filters[1].value" @input="fetch" clearable/>
            </v-col>

            <v-col cols="12" md="4">

            </v-col>
          </v-row>

        </v-col>
        <v-col cols="12" sm="6" md="4">
          <search-input @search="performSearch" v-model="search"/>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">

      <v-data-table class="mt-3" :headers="headers" :items="items" :search="search" :single-expand="false"
                    :server-items-length="totalItems" :loading="loading" :page.sync="pageNumber"
                    :items-per-page.sync="itemsPerPage"
                    :sort-by.sync="orderBy" :sort-desc.sync="orderDesc"
                    :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }"
                    @update:page="fetch" @update:sort-by="fetch" @update:sort-desc="fetch"
                    @update:items-per-page="fetch">


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

        <template v-slot:item.deploy="{ item }">
          <v-btn color="purple" class="white--text" x-small @click="openDeploy(item)"
                 :disabled="!$store.getters.hasPermission(`${item.environment.type}_DEPLOY`)">
            Deploy
          </v-btn>
        </template>

        <template v-slot:item.action="{ item }">
          <show-button
              v-if="$store.getters.hasPermission('ENVIRONMENTSERVICE_SHOW') && $store.getters.hasPermission(`${item.environment.type}_VIEW`)"
              @click="$emit('show', item)"/>
          <edit-button
              v-if="$store.getters.hasPermission('ENVIRONMENTSERVICE_UPDATE') && $store.getters.hasPermission(`${item.environment.type}_EDIT`)"
              @click="$emit('update', item)"/>
          <delete-button
              v-if="$store.getters.hasPermission('ENVIRONMENTSERVICE_DELETE') && $store.getters.hasPermission(`${item.environment.type}_EDIT`)"
              @click="$emit('delete', item)"/>
        </template>

      </v-data-table>
    </v-col>

    <environment-service-docker-deploy
        v-if="deploy"
        v-model="deploy"
        :env-service="envServiceToDeploy"
        @close="closeDeploy"
    />

  </v-row>
</template>

<script>
import EnvironmentServiceProvider from "../../../../providers/EnvironmentServiceProvider";

import {DeleteButton, EditButton, ShowButton, SearchInput} from "@dracul/common-frontend"
import StackCombobox from "@/modules/devops/components/StackCombobox/StackCombobox";
import EnvironmentCombobox from "@/modules/devops/components/EnvironmentCombobox/EnvironmentCombobox";
import EnvironmentServiceDockerDeploy
  from "@/modules/devops/components/EnvironmentServiceDockerDeploy/EnvironmentServiceDockerDeploy";


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
      items: [],
      totalItems: null,
      loading: false,
      orderBy: null,
      orderDesc: false,
      itemsPerPage: 25,
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
        {text: this.$t('devops.service.labels.environment'), value: 'environment'},
        {text: this.$t('devops.service.labels.stack'), value: 'stack'},
        {text: this.$t('devops.service.labels.serviceTemplate'), value: 'service'},
        {text: this.$t('devops.service.labels.name'), value: 'name'},
        {text: this.$t('devops.service.labels.image'), value: 'image'},
        //{text: this.$t('devops.service.labels.replicas'), value: 'replicas'},
        //Actions
        {text: 'deploy', value: 'deploy', sortable: false},
        {text: this.$t('common.actions'), value: 'action', sortable: false},
      ]
    },
    getOrderBy() {
      return (Array.isArray(this.orderBy)) ? this.orderBy[0] : this.orderBy
    },
    getOrderDesc() {
      return (Array.isArray(this.orderDesc)) ? this.orderDesc[0] : this.orderDesc
    }
  },
  async created() {
    await this.fetch()
  },
  methods: {
    openDeploy(envService) {
      this.envServiceToDeploy = envService
      this.deploy = true
    },
    async closeDeploy() {
      this.serviceToCreate = null
      this.deploy = false

      await this.fetch()
    },
    async performSearch() {
      this.pageNumber = 1
      await this.fetch()
    },
    async fetch() {
      this.loading = true

      try {
        const {items, totalItems} = (await EnvironmentServiceProvider.paginateEnvironmentService(
            this.pageNumber,
            this.itemsPerPage,
            this.search,
            this.filters,
            this.getOrderBy,
            this.getOrderDesc
        )).data.paginateEnvironmentService

        this.items = items
        this.totalItems = totalItems
      } catch (error) {
        console.error(`An error happened when we tried to fetch the environment services: '${error}'`)
      } finally {
        this.loading = false
      }
    },
  }
}
</script>


