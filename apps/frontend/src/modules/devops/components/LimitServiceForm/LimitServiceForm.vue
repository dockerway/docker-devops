<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6">
        <v-subheader>{{this.$t('devops.service.limitsMessages.memoryReservation')}}</v-subheader>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
            name="memoryReservation"
            type="number"
            v-model.number="limits.memoryReservation"
            :label="$t('devops.service.labels.memoryReservation')"
            :placeholder="$t('devops.service.labels.memoryReservation')"
            color="secondary"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row  justify="center" align="center">
      <v-col cols="12" sm="6">
        <v-subheader>{{this.$t('devops.service.limitsMessages.memoryLimit')}}</v-subheader>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
            name="memoryLimit"
            type="number"
            v-model.number="limits.memoryLimit"
            :label="$t('devops.service.labels.memoryLimit')"
            :placeholder="$t('devops.service.labels.memoryLimit')"
            color="secondary"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row  justify="center" align="center">
      <v-col cols="12" sm="6">
        <v-subheader>{{this.$t('devops.service.limitsMessages.CPUReservation')}}</v-subheader>
      </v-col>
      <v-col cols="12" sm="4">
        <v-slider
          name="CPUReservation"
          v-model.number="limits.CPUReservation"
          color="orange"
          :label="$t('devops.service.labels.CPUReservation')"
          :placeholder="$t('devops.service.labels.CPUReservation')"
          min="0"
          max="8"
          thumb-label="always"
        ></v-slider>
      </v-col>
    </v-row>
    <v-row  justify="center" align="center">
      <v-col cols="12" sm="6">
        <v-subheader>{{this.$t('devops.service.limitsMessages.CPULimit')}}</v-subheader>
      </v-col>
      <v-col cols="12" sm="4">
        <v-slider
          name="CPULimit"
          v-model.number="limits.CPULimit"
          color="orange"
          :label="$t('devops.service.labels.CPULimit')"
          :placeholder="$t('devops.service.labels.CPULimit')"
          min="0"
          max="8"
          thumb-label="always"
        ></v-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "LimitServiceForm",
  props: {
    limits: Object,
  },
  mounted(){
    !this.limits.memoryReservation ? this.limits.memoryReservation = 0 : this.limits.memoryReservation
    !this.limits.memoryLimit ? this.limits.memoryLimit = 0 : this.limits.memoryLimit
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