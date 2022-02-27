<template>
  <v-container fluid>
    <h4>Discovery</h4>
    <v-row justify="center">

      <v-col cols="12" class="text-center">
        <v-card>
          <v-card-text>
            <environment-combobox v-model="environment"></environment-combobox>
          </v-card-text>
          <v-card-actions>
            <v-btn
                x-large class="red" dark
                @click="startDiscovery"
                :loading="loading"
            >
              START
            </v-btn>
          </v-card-actions>
        </v-card>


      </v-col>



      <v-col cols="12" v-if="disconvery && disconvery.servicesDiscovered">
        <v-card>
          <v-card-text>
            <v-data-table
                :items="disconvery.servicesDiscovered"
                :headers="discoveredHeaders"
                show-select v-model="selectedServicesDiscovered" item-key="name"
            >

              <template v-slot:item.namespace="{item}">

                <span v-if="item.namespace">{{item.namespace}}</span>

                <platform-combobox v-else :item-value="'name'" v-model="item.namespace"></platform-combobox>


              </template>


            </v-data-table>
          </v-card-text>

          <v-card-actions>
            <v-btn
                x-large class="blue" dark
                @click="createDiscovery"
                :loading="loading"
            >
              Create
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-col>

      <v-col cols="12">
        {{created}}
      </v-col>

    </v-row>

  </v-container>
</template>

<script>
import DiscoveryProvider from "@/modules/devops/providers/DiscoveryProvider";
import EnvironmentCombobox from "@/modules/devops/components/EnvironmentCombobox/EnvironmentCombobox";
import PlatformCombobox from "@/modules/devops/components/PlatformCombobox/PlatformCombobox";

export default {
  name: "DiscoveryPage",
  components: {PlatformCombobox, EnvironmentCombobox},
  data() {
    return {
      loading: false,
      environment: null,
      disconvery: [],
      selectedServicesDiscovered: [],
      created: []
    }
  },
  computed: {
    discoveredHeaders(){
      return [
        {text: this.$t('devops.service.labels.name'), value:'name'},
        {text: this.$t('devops.service.labels.platform'), value:'namespace'},
        {text: this.$t('devops.environmentService.labels.stack'), value:'stack'},
      ]
    },
    getSelectedWithPlatform(){
      return this.selectedServicesDiscovered.filter(i => i.namespace)
    }
  },
  methods: {
    createDiscovery(){
      this.loading = true
      DiscoveryProvider.createDiscovery(this.getSelectedWithPlatform)
          .then(r => {
            this.created = r.data.createDiscovery
          })
          .finally(() => this.loading = false)
    },
    startDiscovery() {
      if(this.environment){
        this.loading = true
        DiscoveryProvider.startDiscovery(this.environment)
            .then(r => {
              this.disconvery = r.data.startDiscovery
            })
            .finally(() => this.loading = false)
      }

    }
  }

}
</script>

<style scoped>

</style>
