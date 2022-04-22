<template>
<v-row>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="description"
        name="name"
        v-model="form.name"
        :label="$t('devops.service.labels.strategy')"
        :placeholder="$t('devops.service.labels.strategy')"
        color="secondary"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="task"
        name="defaultValue"
        v-model="form.defaultValue"
        :label="$t('devops.service.labels.variable.defaultValue')"
        :placeholder="$t('devops.service.labels.variable.defaultValue')"
        color="secondary"
    ></v-text-field>
  </v-col>

</v-row>
</template>

<script>
export default {
  name: "VariablePreferencesServiceForm",
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
