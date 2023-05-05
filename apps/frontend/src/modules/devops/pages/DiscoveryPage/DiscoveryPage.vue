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
            <v-btn x-large class="red" dark @click="startDiscovery" :loading="loading">
              START
            </v-btn>
          </v-card-actions>
        </v-card>


      </v-col>


      <v-col cols="12" v-if="discovery && discovery.servicesDiscovered">
        <v-card>
          <v-card-actions>
            <v-btn @click="selectAll" class="teal white--text">select all</v-btn>
          </v-card-actions>
          <v-card-text>
            <v-data-table :items="discovery.servicesDiscovered" :headers="discoveredHeaders" show-select
              v-model="selectedServicesDiscovered" item-key="keyName">

              <template v-slot:item.namespace="{ item }">

                <span v-if="item.namespace">{{ item.namespace }}</span>

                <platform-combobox v-else :item-value="'name'" v-model="item.namespace"></platform-combobox>


              </template>


            </v-data-table>
          </v-card-text>

          <v-card-actions>
            <v-btn x-large class="blue" dark @click="createDiscovery" :loading="loading">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-col>

      <v-col cols="12" v-if="created">
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>
                Platforms created
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
                Stacks created
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
                Services created
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
                EnvironmentService created
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

    </v-row>

  </v-container>
</template>

<script>
import DiscoveryProvider from "@/modules/devops/providers/DiscoveryProvider";
import EnvironmentCombobox from "@/modules/devops/components/EnvironmentCombobox/EnvironmentCombobox";
import PlatformCombobox from "@/modules/devops/components/PlatformCombobox/PlatformCombobox";

export default {
  name: "DiscoveryPage",
  components: { PlatformCombobox, EnvironmentCombobox },
  data() {
    return {
      loading: false,
      environment: null,
      discovery: [],
      selectedServicesDiscovered: [],
      created: null
    }
  },
  computed: {
    discoveredHeaders() {
      return [
        { text: 'keyName', value: 'keyName' },
        { text: this.$t('devops.service.labels.name'), value: 'name' },
        { text: this.$t('devops.service.labels.image'), value: 'imageName' },
        { text: this.$t('devops.service.labels.platform'), value: 'namespace' },
        { text: this.$t('devops.service.labels.stack'), value: 'stack' },
      ]
    },
    getSelectedWithPlatform() {
      return this.selectedServicesDiscovered.filter(i => i.namespace)
    }
  },
  methods: {
    selectAll() {
      if (this.discovery && this.discovery.servicesDiscovered) {
        this.selectedServicesDiscovered = this.discovery.servicesDiscovered
      }

    },
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
      try {
        this.loading = true
        this.discovery = (await DiscoveryProvider.startDiscovery(this.environment)).data.startDiscovery
      } catch (error) {
        console.log(`An error happened when we started the discovery: ${error}`)
      } finally {
        this.loading = false
      }
    }
  }

}
</script>

<style scoped></style>
