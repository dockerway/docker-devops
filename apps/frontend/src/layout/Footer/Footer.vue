<template>
  <v-footer dark>
    <v-card
        flat
        tile
        class="text-center"
        min-width="100%"
        height="100px"
    >
      <v-card-actions>
        <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
        <div style="position: absolute; top:0%; right: 3%">
          <dark-mode></dark-mode>
        </div>
        <v-card-text>
          {{ new Date().getFullYear() }} <strong>@PerfilIT</strong>
        </v-card-text>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>

<script>
import {DarkMode} from "@dracul/customize-frontend";

export default {
  name: "Footer",
  components: {DarkMode}
}
</script>

<style scoped>

</style>
