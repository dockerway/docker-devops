<template>
  <v-container fluid>

    <v-card>
      <v-toolbar tile elevation="1">
        <h4>Sauron</h4>
        <v-spacer></v-spacer>

        <platform-combobox
            v-model="platform" hide-details clearable
            width="250px" @input="setPlatformStacks"
        ></platform-combobox>
        <stack-combobox
            v-model="stacks" hide-details clearable multiple
            chips ref="stackCombo" return-object
        ></stack-combobox>
      </v-toolbar>
      <v-card-text>
        <v-simple-table dense v-if="platform && stacks && stacks.length > 0" >
          <thead>
          <tr>
            <th></th>
            <template v-for="environment in environments">
              <th v-for="stack in getEnvStacks(environment)" :key="environment.id+stack.id" class="text-center">
                {{ environment.name }}<br>{{ stack.name }}
              </th>

            </template>
          </tr>
          </thead>

          <tbody>

          <tr v-for="service in getServices" :key="service.id">
            <td>{{ service.name }}</td>

            <template v-for="environment in environments">
              <td v-for="stack in getEnvStacks(environment)" :key="environment.id+stack.id" class="text-center">
                {{ getTag(environment,stack, service) }}
              </td>
            </template>

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
import StackCombobox from "@/modules/devops/components/StackCombobox/StackCombobox";

export default {
  name: "SauronPage",
  components: {StackCombobox, PlatformCombobox},
  data() {
    return {
      envServices: [],
      environments: [],
      services: [],
      platform: null,
      stacks: []
    }
  },
  created() {
    this.fetchEnvironments()
    this.fetchService()
    this.fetchEnvironmentService()
  },
  computed: {
    getEnvStacks(){
      return environment => this.stacks.filter(s => s.environments.some( e => e.id === environment.id))
    },
    getTag() {
      return (environment, stack, service) => {
        let environmentService = this.envServices.find(
            item => (
                item.environment.id === environment.id &&
                item.stack.id === stack.id &&
                item.service.id === service.id
            )
        )
        return environmentService ? environmentService.tag : '---'
      }
    },
    getServices() {
      return this.platform ? this.services.filter(s => this.platform.includes(s.platform.id)) : this.services
    },
    getEnvServices() {
      return this.platform ? this.envServices.filter(es => this.getServices.some( s=> s.id === es.service.id)) : this.envServices
    }
  },
  methods: {
    setPlatformStacks(val) {
      this.$refs.stackCombo.setPlatformStacks(val)
      this.$nextTick(() =>  this.findAllTags())
    },
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
        this.envServices = r.data.fetchEnvironmentService

      }).catch(err => {
        console.error(err)
      }).finally(() => this.loading = false)
    },
    async findAllTags() {
      for (let item of this.getEnvServices) {
        //console.log("findAllTags", item.name, item.stack)
        await this.findServiceTag(item)
      }
    },
    findServiceTag(item) {
      return new Promise((resolve) => {
        console.log("findServiceTag", item.name, item.stack)
        DockerProvider.findDockerServiceTag(item.id)
            .then(r => {
              this.$set(item, 'tag', r.data.findDockerServiceTag)
              resolve()
            })
            .catch(e => {
              console.error("findServiceTag error:", e.graphQLErrors)
              let m = (e.graphQLErrors && e.graphQLErrors.length > 0) ? e.graphQLErrors.reduce((a,v) => a+v.message.replace("Unexpected error value:",""),'') : 'ERROR'
              console.log("mensaje error",m)
              this.$set(item, 'tag', m)
              resolve()
            })
      })

    }
  }
}
</script>

<style scoped>

</style>
