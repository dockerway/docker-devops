<template>
<v-row>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="description"
        name="name"
        v-model="form.hostVolume"
        :label="$t('devops.environmentService.labels.hostVolume')"
        :placeholder="$t('devops.environmentService.labels.hostVolume')"
        color="secondary"
        :rules="rules"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="task"
        name="value"
        v-model="form.containerVolume"
        :label="$t('devops.environmentService.labels.containerVolume')"
        :placeholder="$t('devops.environmentService.labels.containerVolume')"
        color="secondary"
        :rules="linuxDirectoryRules"
    ></v-text-field>
  </v-col>

</v-row>
</template>

<script>
export default {
  name: "VolumeEnvServiceForm",
  data() {
    return {
      rules: [ v => this.regexPaths.test(v) || 'Debe comenzar con /storage, /logs o /localdata y finalizar sin /' ],
      linuxDirectoryRules: [path => this.isAValidLinuxDirectory(path)]
    }
  },
  props: {
    value: {type: Object, required: true},
  },
  computed: {
    form: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    regexPaths() {
      return new RegExp(this.$store.getters.getSettingValue("regexPaths"), 'i')
    }
  },
  watch: {
    form: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  methods: {
    isAValidLinuxDirectory(path) {
      try {
        /* eslint-disable no-useless-escape */
        const linuxDirectoryRegex = new RegExp(/^\/(?:[a-zA-Z0-9_-]+\/)*(?![\/])[a-zA-Z0-9_-]+$/)
        
        return linuxDirectoryRegex.test(path) ? true : 'Debe ser un nombre de directorio Linux valido que NO finalice con un "/"'
      } catch (error) {
        console.error('An error happened when we tried to check if a path was a valid linux directory name')
        throw error
      }
    }
  },
}
</script>

<style scoped>

</style>
