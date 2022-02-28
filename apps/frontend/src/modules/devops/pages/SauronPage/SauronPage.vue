<template>
  <v-container fluid>

    <v-card>
      <v-toolbar tile elevation="1">
        <h4>Sauron</h4>
        <v-spacer></v-spacer>
        <v-select v-model="mode" label="mode" hide-details :items="['tag','state','stats']" />

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

                <template v-if="mode==='tag'">
                  {{ getTag(environment,stack, service) }}
                </template>

                <template v-if="mode==='state'">
                  {{getState(environment,stack, service)}}
                </template>

                <template v-if="mode==='stats'">
                  {{getStats(environment,stack, service)}}
                </template>




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
      stacks: [],
      mode: 'state'
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
    getEnvironmentService(){
      return (environment, stack, service) => {
        return this.envServices.find(
            item => (
                item.environment.id === environment.id &&
                item.stack.id === stack.id &&
                item.service.id === service.id
            )
        )
      }
    },
    getTag() {
      return (environment, stack, service) => {
        let environmentService = this.getEnvironmentService(environment, stack, service)
        return environmentService ? environmentService.tag : '---'
      }
    },
    getState() {
      return (environment, stack, service) => {
        let environmentService = this.getEnvironmentService(environment, stack, service)
        return environmentService ? environmentService.state.state : 'DOWN'
      }
    },
    getStats() {
      return (environment, stack, service) => {
        let environmentService = this.getEnvironmentService(environment, stack, service)
        if(environmentService && environmentService.state && environmentService.state.stats){
          return "c:"+environmentService.state.stats.cpu+" m:"+environmentService.stats.memoryUsage
        }else{
          return '***'
        }
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
     // this.$nextTick(() =>  this.findAllTags())
      this.$nextTick(() =>  this.findAllStats())
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
        await this.findServiceTag(item)
      }
    },
    async findAllStats() {
      for (let item of this.getEnvServices) {
        await this.findServiceStats(item)
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
    },
    findServiceStats(item) {
      return new Promise((resolve) => {
        console.log("findServiceStat", item.name, item.stack)
        DockerProvider.findDockerServiceStats(item.id)
            .then(r => {
              this.$set(item, 'state', r.data.findDockerServiceStats)
              resolve()
            })
            .catch(e => {
              console.error("findServiceStat error:", e.graphQLErrors)
              let m = (e.graphQLErrors && e.graphQLErrors.length > 0) ? e.graphQLErrors.reduce((a,v) => a+v.message.replace("Unexpected error value:",""),'') : 'ERROR'
              this.$set(item, 'state', m)
              resolve()
            })
      })
    }
  }
}
</script>

<style scoped>

</style>
