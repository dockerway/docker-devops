<template>
  <v-container>
    <h3>Restaurar sistema</h3>
    <p>Esta función elimina los registros de Platform, Service, Stack and EnvironmentService</p>

    <v-btn
        @click="confirm=true"
        :loading="loading"
        :disabled="systemRestored"
    >
      Restaurar
    </v-btn>

    <v-alert v-if="systemRestored" type="success">
      Sistema restaurado
    </v-alert>

    <v-alert v-if="error" type="error">
      {{error}}
    </v-alert>

    <confirm-dialog
        v-model="confirm"
        @confirmed="onConfirm"
        description="¿Esta realmente seguro de destruir todos los registros?"
    >
    </confirm-dialog>

  </v-container>
</template>

<script>
import {ConfirmDialog} from "@dracul/common-frontend"
import RestoreSystemProvider from "../../providers/RestoreSystemProvider";

export default {
  name: "RestoreSystemPage",
  components: {ConfirmDialog},
  data() {
    return {
      confirm: false,
      systemRestored: false,
      loading: false,
      error: null
    }
  },
  methods: {
    onConfirm() {
      this.loading = true
      RestoreSystemProvider.restoreSystem()
          .then(() => {
            this.systemRestored = true
          })
          .catch(e => {
            this.error = e.message
          })
          .finally(() => {
            this.loading = false
          })
    }
  }
}
</script>

<style scoped>

</style>
