<template>
<v-row>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="description"
        name="name"
        v-model="form.hostPath"
        :label="$t('devops.environmentService.labels.hostPath')"
        :placeholder="$t('devops.environmentService.labels.hostPath')"
        color="secondary"
        :rules="rules"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="task"
        name="value"
        v-model="form.containerPath"
        :label="$t('devops.environmentService.labels.containerPath')"
        :placeholder="$t('devops.environmentService.labels.containerPath')"
        color="secondary"
        :rules="rules"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="description"
        name="name"
        v-model="form.fileName"
        :label="$t('devops.environmentService.labels.fileName')"
        :placeholder="$t('devops.environmentService.labels.fileName')"
        color="secondary"
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
            :label="$t('devops.environmentService.labels.fileContent')"
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
      rules: [ v => this.regexPathsFiles.test(v) || 'Debe comenzar con /storage y finalizar sin /' ]
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
    regexPathsFiles() {
      return new RegExp(this.$store.getters.getSettingValue("regexPathsFiles"), 'i')
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
