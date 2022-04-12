<template>
<v-row>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="description"
        name="name"
        v-model="form.name"
        :label="$t('devops.environmentService.labels.variable.name')"
        :placeholder="$t('devops.environmentService.labels.variable.name')"
        color="secondary"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4" v-show="tabsType == 'constraints'">
    <v-select
      name="operation"
      v-model="form.operation"
      prepend-icon="calculate"
      :items="['==','!=']"
      :label="$t('devops.environmentService.labels.variable.operation')"
      :placeholder="$t('devops.environmentService.labels.variable.operation')"
      color="secondary"
    ></v-select>
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
  name: "LabelEnvServiceForm",
  props: {
    value: {type: Object, required: true},
    tabsType: String
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
