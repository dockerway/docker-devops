<template>
<v-row>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="wifi"
        name="name"
        v-model="form.Target"
        :label="$t('devops.serviceTemplate.networks.target')"
        :placeholder="$t('devops.serviceTemplate.networks.target')"
        color="secondary"
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="4">
    <v-text-field
        prepend-icon="link"
        name="value"
        v-model="form.Aliases"
        :label="$t('devops.serviceTemplate.networks.aliases')"
        :placeholder="$t('devops.serviceTemplate.networks.aliases')"
        color="secondary"
    ></v-text-field>
  </v-col>

</v-row>
</template>

<script>
export default {
  name: "EnvironmentServiceNetworkForm",
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
