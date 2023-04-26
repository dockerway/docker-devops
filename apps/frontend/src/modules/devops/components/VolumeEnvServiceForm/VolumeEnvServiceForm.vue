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
        :rules="rules"
    ></v-text-field>
  </v-col>

</v-row>
</template>

<script>
export default {
  name: "VolumeEnvServiceForm",
  data() {
    return {
      rules: [ v => this.regexPaths.test(v) || 'Debe comenzar con /storage, /logs o /localdata y finalizar sin /' ]
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
}
</script>

<style scoped>

</style>
