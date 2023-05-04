<template>
<v-row>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="description"
        name="name"
        v-model="form.name"
        :label="$t('devops.serviceTemplate.labels.strategy')"
        :placeholder="$t('devops.serviceTemplate.labels.strategy')"
        color="secondary"
        readonly
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="task"
        name="value"
        v-model="form.value"
        :label="$t('devops.environmentService.labels.variable.value')"
        :placeholder="$t('devops.environmentService.labels.variable.value')"
        color="secondary"
    ></v-text-field>
  </v-col>

</v-row>
</template>

<script>
export default {
  name: "VariablePreferencesEnvServiceForm",
  props: {
    tabsType: String,
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
