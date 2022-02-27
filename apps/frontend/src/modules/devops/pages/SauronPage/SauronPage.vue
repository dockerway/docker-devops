<template>
  <v-container fluid>

    <v-card>
      <v-toolbar  tile elevation="1" >
        <h4>Sauron</h4>
        <v-spacer></v-spacer>
        <platform-combobox
            v-model="platform" hide-details clearable
            width="250px"
        ></platform-combobox>
      </v-toolbar>

      <v-card-text>
        <v-simple-table dense>
          <thead>
          <tr>
            <th>Servicio</th>
            <th v-for="environment in environments" :key="environment.id">
              {{ environment.name }}
            </th>
          </tr>
          </thead>

          <tbody>

          <tr v-for="service in getServices" :key="service.id">
            <td>{{service.name}}</td>

            <td v-for="environment in environments" :key="environment.id">
              {{getTag(environment,service)}}
            </td>

          </tr>

          </tbody>
        </v-simple-table>

      </v-card-text>
      <v-card-text>

      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import EnvironmentServiceProvider from "@/modules/devops/providers/EnvironmentServiceProvider";
import DockerProvider from "@/modules/devops/providers/DockerProvider";
import EnvironmentProvider from "@/modules/devops/providers/EnvironmentProvider";
import ServiceProvider from "@/modules/devops/providers/ServiceProvider";
import PlatformCombobox from "@/modules/devops/components/PlatformCombobox/PlatformCombobox";

export default {
  name: "SauronPage",
  components: {PlatformCombobox},
  data() {
    return {
      items: [],
      environments: [],
      services: [],
      platform: null,
    }
  },
  created() {
    this.fetchEnvironments()
    this.fetchService()
    this.fetchEnvironmentService()
  },
  computed: {
    getTag(){
      return (environment,service) => {
        let environmentService = this.items.find(item => (item.environment.id === environment.id && item.service.id === service.id))
        return environmentService ? environmentService.tag : ''
      }
    },
    getServices(){
      return this.platform ? this.services.filter(s => s.platform.id == this.platform) : this.services
    }
  },
  methods: {
    performSearch() {
      this.pageNumber = 1
      this.fetchEnvironmentService()
    },
    fetchEnvironments() {
      EnvironmentProvider.fetchEnvironment().then(r => {
        this.environments = r.data.fetchEnvironment
      }).catch(err => {
        console.error(err)
      }).finally(() => this.loading = false)
    },
    fetchService() {
      ServiceProvider.fetchService().then(r => {
        this.services = r.data.fetchService
      }).catch(err => {
        console.error(err)
      }).finally(() => this.loading = false)
    },
    fetchEnvironmentService() {
      this.loading = true
      EnvironmentServiceProvider.fetchEnvironmentService().then(r => {
        this.items = r.data.fetchEnvironmentService

        for (let item of this.items) {
          this.findServiceTag(item)
        }

      }).catch(err => {
        console.error(err)
      }).finally(() => this.loading = false)
    },
    findServiceTag(item) {
      DockerProvider.findDockerServiceTag(item.id)
          .then(r => {
            this.$set(item, 'tag', r.data.findDockerServiceTag)
          })
    }
  }
}
</script>

<style scoped>

</style>
