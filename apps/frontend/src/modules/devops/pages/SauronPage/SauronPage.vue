<template>
  <v-container fluid>

    <v-card>
      <v-toolbar tile elevation="1">
        <v-select v-model="mode" label="mode" hide-details :items="['tag', 'state', 'cpu', 'memory']" />

        <v-spacer></v-spacer>

        <platform-combobox v-model="platform" hide-details clearable width="250px"
          @input="setPlatformStacks"></platform-combobox>
        <stack-combobox v-model="stacks" hide-details clearable multiple chips ref="stackCombo"
          return-object></stack-combobox>
      </v-toolbar>
      <v-card-text>
        <v-simple-table dense v-if="platform && stacks && stacks.length > 0">
          <thead>
            <tr>
              <th></th>
              <template v-for="environment in environments">
                <th v-for="stack in getEnvStacks(environment)" :key="environment.id + stack.id" class="text-center">
                  {{ environment.name }}<br>{{ stack.name }}
                </th>

              </template>
            </tr>
          </thead>

          <tbody>

            <tr v-for="service in getServices" :key="service.id">
              <td>{{ service.name }}</td>

              <template v-for="environment in environments">
                <td v-for="stack in getEnvStacks(environment)" :key="environment.id + stack.id" class="text-center">

                  <template v-if="mode === 'tag'">
                    {{ getTag(environment, stack, service) }}
                  </template>

                  <template v-if="mode === 'state'">
                    {{ getState(environment, stack, service) }}
                  </template>

                  <template v-if="mode === 'cpu'">
                    {{ getCpu(environment, stack, service) }}
                  </template>

                  <template v-if="mode === 'memory'">
                    {{ getMemory(environment, stack, service) }}
                  </template>

                  <template v-if="mode === 'stats'">
                    {{ getStats(environment, stack, service) }}
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

const noEnvServiceMessage = 'El servicio no existe'

export default {
  name: "SauronPage",
  components: { StackCombobox, PlatformCombobox },
  data() {
    return {
      envServices: [],
      environments: [],
      services: [],
      platform: null,
      stacks: [],
      mode: 'tag'
    }
  },
  created() {
    this.fetchEnvironments()
    this.fetchService()
    this.fetchEnvironmentService()
  },
  computed: {
    getEnvStacks() {
      return environment => this.stacks.filter(s => s.environments.some(e => e.id === environment.id))
    },
    getEnvironmentService() {
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
        const environmentService = this.getEnvironmentService(environment, stack, service)
        return environmentService ? environmentService.tag : noEnvServiceMessage
      }
    },
    getState() {
      return (environment, stack, service) => {
        const environmentService = this.getEnvironmentService(environment, stack, service)
        return environmentService ? environmentService.state : noEnvServiceMessage
      }
    },
    getCpu() {
      return (environment, stack, service) => {
        const environmentService = this.getEnvironmentService(environment, stack, service)
        return environmentService ? environmentService.cpu : noEnvServiceMessage
      }
    },
    getMemory() {
      return (environment, stack, service) => {
        const environmentService = this.getEnvironmentService(environment, stack, service)
        return environmentService ? environmentService.memory : noEnvServiceMessage
      }
    },
    getStats() {
      return (environment, stack, service) => {
        const environmentService = this.getEnvironmentService(environment, stack, service)
        return environmentService ? environmentService.stats : noEnvServiceMessage
      }
    },
    getServices() {
      return this.platform ? this.services.filter(s => this.platform.includes(s.platform.id)) : this.services
    },
    getEnvServices() {
      return this.platform ? this.envServices.filter(es => this.getServices.some(s => s.id === es.service.id)) : this.envServices
    }
  },
  methods: {
    setPlatformStacks(val) {
      this.$refs.stackCombo.setPlatformStacks(val)
      this.$nextTick(() => this.findAllTags())
      this.$nextTick(() => this.findAllStats())
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
      let timeout = 200

      for (let item of this.getEnvServices) {
        setTimeout(() => this.findServiceTag(item), timeout)
        timeout += 200
      }
    },
    async findAllStats() {
      let timeout = 300
      for (let item of this.getEnvServices) {
        setTimeout(() => this.findServiceStats(item), timeout)
        timeout += 300
      }
    },
    async findServiceTag(item) {
      console.log("Running findServiceTag", item.name, item.stack)

      try {
        const tag = (await DockerProvider.findDockerServiceTag(item.id)).data.findDockerServiceTag
        this.$set(item, 'tag', tag)

      } catch (error) {
        let errorMessage = (error.graphQLErrors && error.graphQLErrors.length > 0) ? error.graphQLErrors.reduce((a, v) => a + v.message.replace("Unexpected error value:", ""), '') : 'ERROR'
        this.$set(item, 'tag', errorMessage)

        console.error(`An error happened at the findServiceTag function: ${errorMessage ? errorMessage : error.graphQLErrors}`)
      }
    },
    findServiceStats(item) {
      return new Promise((resolve) => {
        console.log("findServiceStat", item.name, item.stack)
        DockerProvider.findDockerServiceStats(item.id)
          .then(r => {
            let result = r.data.findDockerServiceStats
            this.setServiceState(item, result)
            this.setServiceCpu(item, result)
            this.setServiceMemory(item, result)
            resolve()
          })
          .catch(e => {
            console.error("findServiceStat error:", e.graphQLErrors)
            let m = (e.graphQLErrors && e.graphQLErrors.length > 0) ? e.graphQLErrors.reduce((a, v) => a + v.message.replace("Unexpected error value:", ""), '') : 'ERROR'
            this.$set(item, 'tasks', m)
            resolve()
          })
      })
    },
    setServiceState(item, stats) {
      if (!stats || stats.length < 1) {
        this.$set(item, 'state', 'No se encontro informacion')
      } else {
        const state = stats.map(i => i?.task?.state).join(" | ")
        this.$set(item, 'state', state)
      }
    },
    setServiceCpu(item, stats) {
      if (!stats || stats.length < 1) {
        this.$set(item, 'cpu', 'No se encontro informacion')
      } else {
        const state = stats.map(i => i?.stats?.cpu).join(" | ")
        this.$set(item, 'cpu', state)
      }
    },
    setServiceMemory(item, stats) {
      if (!stats || stats.length < 1) {
        this.$set(item, 'memory', 'No se encontro informacion')
      } else {
        const state = stats.map(i => i?.stats?.memoryUsage).join(" | ")
        this.$set(item, 'memory', state)
      }
    }
  }
}
</script>

<style scoped></style>
