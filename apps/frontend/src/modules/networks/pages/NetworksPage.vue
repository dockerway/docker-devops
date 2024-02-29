
<template>
  <v-container>
    <v-card class="my-3" >
        <v-card-title>
            {{$t('networks.title')}}
        </v-card-title>

        <v-card-subtitle>
            {{ $t('networks.subtitle') }}
        </v-card-subtitle>

        <v-divider/>
        
        <NetworksFilter @updateFilters="getDockerNetworks"/>

    </v-card>

    <v-card>
      <v-card-text>
        <v-data-table
            dense
            :items="networks"
            :headers="headers"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50,100] }"
          >

          <template v-for="header in headers.filter((header) => header.hasOwnProperty('formatter'))" v-slot:[`item.${header.value}`]="{ header, value }">
            {{ header.formatter(value) }}
          </template>

            <template v-slot:item.leader="{ item }">
              <v-icon :color="item.leader ? 'green' : 'grey'">
              {{item.leader ? 'done' : 'dangerous'}}
              </v-icon>
            </template>

          </v-data-table>
      </v-card-text>
    </v-card>


  </v-container>
</template>

<script>
import NetworksFilter from './NetworksFilter.vue'
import NetworksProvider from "../providers/NetworksProvider";
import { Dayjs } from "@dracul/dayjs-frontend"

export default {
  name: "NetworksPage",
  components: {NetworksFilter},
  data() {
    return {
      networks: [],
      itemsPerPage: 25,
      environment: ''
    }
  },
  computed: {
    headers() {
      return [
        {text: this.$t('networks.name'), value: 'Name'},
        {text: this.$t('networks.id'), value: 'Id'},
        {text: this.$t('networks.dateOfCreation'), value: 'Created', formatter: this.formatDate},
        {text: this.$t('networks.driver'), value: 'Driver'},
        {text: this.$t('networks.attachable'), value: 'Attachable'},
        {text: this.$t('networks.ipamdriver'), value: 'IPAM.Driver'},
        {text: this.$t('networks.ipv4ipamsubnet'), value: 'IPAM.Config[0].Subnet'},
        {text: this.$t('networks.ipv4ipamgateway'), value: 'IPAM.Config[0].Gateway'}
      ]
    },
  },
  methods: {
    async getDockerNetworks(environment) {
      const networksFromEnvironment = (await NetworksProvider.getDockerNetworks(environment)).data.getDockerNetworks
      this.networks = networksFromEnvironment
    },

    formatDate(date){
      const formattedDate = Dayjs(date).format("YYYY-MM-DD HH:mm:ss")
      return formattedDate
    }
  }
}
</script>

<style scoped>

</style>
