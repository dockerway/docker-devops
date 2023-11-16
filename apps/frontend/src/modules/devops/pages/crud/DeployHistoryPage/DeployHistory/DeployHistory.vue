<template>
    <v-container fluid>
        <v-data-table class="mt-3 pa-2" :headers="headers" :items="items" :search="search" :single-expand="false"
            :server-items-length="totalItems" :loading="loading" :page.sync="pageNumber" :items-per-page.sync="itemsPerPage"
            :sort-by.sync="orderBy" :sort-desc.sync="orderDesc" :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }"
            @update:page="fetch" @update:sort-by="fetch" @update:sort-desc="fetch" @update:items-per-page="fetch">


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

            <template v-slot:item.Rollback="{ item }">
                <v-btn color="purple" class="white--text" x-small @click="openDeploy(item)"
                    :disabled="!$store.getters.hasPermission(`${item.environment.type}_DEPLOY`)">
                    Deploy
                </v-btn>
            </template>

            <template v-slot:item.Detalles="{ item }">
                <show-button
                    v-if="$store.getters.hasPermission('ENVIRONMENTSERVICE_SHOW') && $store.getters.hasPermission(`${item.environment.type}_VIEW`)"
                    @click="$emit('show', item)" />
            </template>
        </v-data-table>

        <EnvironmentServiceDockerDeploy v-if="deploy" v-model="deploy" :env-service="envServiceToDeploy"
            @close="closeDeploy" />
    </v-container>
</template>
  
<script>
import EnvironmentServiceProvider from "../../../../providers/EnvironmentServiceProvider";
import DockerProvider from "../../../../providers/DockerProvider";

import { ShowButton } from "@dracul/common-frontend"
import EnvironmentServiceDockerDeploy from "@/modules/devops/components/EnvironmentServiceDockerDeploy/EnvironmentServiceDockerDeploy";


export default {
    name: "EnvironmentServiceList",
    components: {
        EnvironmentServiceDockerDeploy,
        ShowButton
    },

    data() {
        return {
            items: [],
            totalItems: null,
            loading: false,
            orderBy: null,
            orderDesc: false,
            itemsPerPage: 10,
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
                { text: this.$t('devops.service.labels.environment'), value: 'environment', align: 'start' },
                { text: this.$t('devops.service.labels.stack'), value: 'stack', align: 'start' },
                { text: this.$t('devops.service.labels.name'), value: 'name', align: 'start' },
                { text: this.$t('deployHistory.deployDate'), value: 'name', align: 'start' },
                { text: this.$t('deployHistory.user'), value: 'name', align: 'start' },
                { text: this.$t('deployHistory.deployedImage'), value: 'image', align: 'start' },
                { text: this.$t('deployHistory.deployedVersion'), value: 'image', align: 'start' },
                //Actions
                { text: 'Rollback', value: 'Rollback', sortable: false, align: 'start' },
                { text: 'Detalles', value: 'Detalles', sortable: false, align: 'start' },
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
            console.log(`this.deploy: '${this.deploy}'`)
        },
        async closeDeploy() {
            this.serviceToCreate = null
            this.deploy = false
            console.log(`this.deploy: '${this.deploy}'`)

            await this.fetch()
        },
        async performSearch() {
            this.pageNumber = 1
            await this.fetch()
        },
        async fetch() {
            this.loading = true

            try {
                const { items, totalItems } = (await EnvironmentServiceProvider.paginateEnvironmentService(
                    this.pageNumber,
                    this.itemsPerPage,
                    this.search,
                    this.filters,
                    this.getOrderBy,
                    this.getOrderDesc
                )).data.paginateEnvironmentService

                for (let index = 0; index < items.length; index++) {
                    const dockerService = (await DockerProvider.findDockerService(items[index].id)).data.findDockerService

                    if (dockerService && dockerService.id) {
                        items[index].status = this.$t('devops.service.active')
                    } else {
                        items[index].status = this.$t('devops.service.inactive')
                    }
                }

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