<template>
<v-row>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="description"
        name="name"
        v-model="form.hostPath"
        :label="$t('devops.service.labels.hostPath')"
        :placeholder="$t('devops.service.labels.hostPath')"
        color="secondary"
        :rules="rules"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="task"
        name="value"
        v-model="form.containerPath"
        :label="$t('devops.service.labels.containerPath')"
        :placeholder="$t('devops.service.labels.containerPath')"
        color="secondary"
        :rules="rules"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="description"
        name="name"
        v-model="form.fileName"
        :label="$t('devops.service.labels.fileName')"
        :placeholder="$t('devops.service.labels.fileName')"
        color="secondary"
        :rules="rulesFileName"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="12">
    <v-expansion-panels>
      <v-expansion-panel
      >
        <v-expansion-panel-header>
          {{form.fileName}}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-textarea
            outlined
            auto-grow
            filed
            v-model="form.fileContent"
            name="input-7-4"
            :label="$t('devops.service.labels.fileContent')"
          ></v-textarea>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>

</v-row>
</template>

<script>
export default {
  name: "FileEnvServiceForm",
  data() {
    return {
      rules: [ v => this.regexPathsFiles.test(v) || 'Expresión regular requerida: '+ this.regexPathsFiles.toString() ],
      rulesFileName: [
        v => this.regexFileName.test(v) || 'No debe contenter barras (/)',
        v => this.regexDuplicatedFiles(v) || 'Nombre del archivo ya existente con el mismo path'
      ]
    }
  },
  props: {
    value: {type: Object, required: true},
    files: {type: Array, required: true}
  },
  methods: {
    regexDuplicatedFiles(fileName) {
      let filesDuplicatedLength = this.files.filter(item => item.hostPath === this.form.containerPath && item.fileName === fileName).length
      let filesDuplicated = filesDuplicatedLength >= 2
      return !filesDuplicated
    }
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
    regexPathsFiles() {
      return new RegExp(this.$store.getters.getSettingValue("regexPathsFiles"), 'i')
    },
    regexFileName() {
      return new RegExp(this.$store.getters.getSettingValue("regexFileName"), 'i')
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
}
</script>

<style scoped>

</style>
