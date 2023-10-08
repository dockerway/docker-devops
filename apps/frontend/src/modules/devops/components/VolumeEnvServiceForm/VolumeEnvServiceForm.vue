<template>
<v-row>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="description"
        name="name"
        v-model="form.hostVolume"
        :label="$t('devops.service.labels.hostVolume')"
        :placeholder="$t('devops.service.labels.hostVolume')"
        color="secondary"
        :rules="rules"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="task"
        name="value"
        v-model="form.containerVolume"
        :label="$t('devops.service.labels.containerVolume')"
        :placeholder="$t('devops.service.labels.containerVolume')"
        color="secondary"
        :rules="volumesRules"
    ></v-text-field>
  </v-col>

</v-row>
</template>

<script>
export default {
  name: "VolumeEnvServiceForm",
  data() {
    return {
      rules: [ v => this.regexPaths.test(v) || 'Expresion regular requerida: '+ this.regexPaths.toString() ],
      volumesRules: [path => this.isAValidVolume(path)]
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
        const linuxDirectoryRegex = new RegExp(this.$store.getters.getSettingValue("regexPaths"), 'i')
        return linuxDirectoryRegex.test(path)
      } catch (error) {
        console.error(`An error happened when we tried to check if a path was a valid linux directory name: '${error.message}'`)
        throw error
      }
    },
    isAValidFilename(path){
      try {
        const filenameRegex = new RegExp(this.$store.getters.getSettingValue("regexFileAbsolutePath"), 'i')
        return filenameRegex.test(path)
      } catch (error) {
        console.error(`An error happened when we tried to check if a filename was valid: '${error.message}'`)
        throw error
      }
    },
    isAValidVolume(path){
      const userInputIsAValidFileAbsolutePath = this.isAValidFilename(path)
      const userInputIsAValidDirectoryAbsolutePath = this.isAValidLinuxDirectory(path)

      const isNotAValidContainerVolume = (!userInputIsAValidFileAbsolutePath && !userInputIsAValidDirectoryAbsolutePath)
      if (isNotAValidContainerVolume) return 'Debe ser una ruta absoluta hacia un fichero o directorio linux que NO finalice con un "/"'
    }
  },
}
</script>

<style scoped>

</style>
