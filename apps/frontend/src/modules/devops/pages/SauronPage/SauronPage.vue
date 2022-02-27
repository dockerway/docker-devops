<template>
  <v-container>
    <h4>Sauron</h4>
    <v-divider></v-divider>

    <v-card>
      <v-card-text>
        <v-simple-table>
          <thead>
          <tr>
            <th>Servicio</th>
            <th v-for="environment in environments" :key="environment.id">
              {{ environment.name }}
            </th>
          </tr>
          </thead>

          <tbody>

          <tr v-for="service in services" :key="service.id">
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

export default {
  name: "SauronPage",
  data() {
    return {
      items: [],
      environments: [],
      services: []
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
      console.log("findServiceTag",item)
      DockerProvider.findServiceTag(item.id)
          .then(r => {
            //item.version = r.data.findServiceTag
            this.$set(item, 'tag', r.data.findServiceTag)
          })
    }
  }
}
</script>

<style scoped>

</style>
