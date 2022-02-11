<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <platform-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import PlatformCrud from "./PlatformCrud";
    export default {
        name: "Platform",
        components: {PlatformCrud}
    }
</script>

<style scoped>

</style>

