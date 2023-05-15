<template>
<v-row>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="description"
        name="name"
        type="number"
        v-model.number="form.hostPort"
        :label="$t('devops.service.labels.hostPort')"
        :placeholder="$t('devops.service.labels.hostPort')"
        color="secondary"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="task"
        name="value"
        type="number"
        v-model.number="form.containerPort"
        :label="$t('devops.service.labels.containerPort')"
        :placeholder="$t('devops.service.labels.containerPort')"
        color="secondary"
    ></v-text-field>
  </v-col>

</v-row>
</template>

<script>
export default {
  name: "PortEnvServiceForm",
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
