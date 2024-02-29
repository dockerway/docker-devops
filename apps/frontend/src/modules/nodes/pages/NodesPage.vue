
<template>
  <v-container>
    <v-card class="my-3" >
        <v-card-title>
            {{$t('nodes.title')}}
        </v-card-title>

        <v-card-subtitle>
            {{ $t('nodes.subtitle') }}
        </v-card-subtitle>

        <v-divider/>
        
        <NodesFilter @updateFilters="getNodesFromEnvironment"/>

    </v-card>


    <v-card>
      <v-card-text>
        <v-data-table
            dense
            :items="nodes"
            :headers="headers"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50,100] }"
        >

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
import NodesFilter from './NodesFilter.vue'
import NodesProvider from "../providers/NodesProvider";

export default {
  name: "NodesPage",
  components: {NodesFilter},
  data() {
    return {
      nodes: [],
      itemsPerPage: 25,
      environment: ''
    }
  },
  computed: {
    headers() {
      return [
        {text: this.$t('nodes.id'), value: 'id'},
        {text: this.$t('nodes.hostname'), value: 'hostname'},
        {text: this.$t('nodes.ip'), value: 'ip'},
        {text: this.$t('nodes.role'), value: 'role'},
        {text: this.$t('nodes.state'), value: 'state'},
        {text: this.$t('nodes.engine'), value: 'engine'},
        {text: this.$t('nodes.leader'), value: 'leader'},
        {text: this.$t('nodes.reachability'), value: 'reachability'},
      ]
    },
  },
  methods: {
    async getNodesFromEnvironment(environment) {
      this.nodes = (await NodesProvider.getDockerNodes(environment)).data.getDockerNodes
    }
  }
}
</script>

<style scoped>

</style>
