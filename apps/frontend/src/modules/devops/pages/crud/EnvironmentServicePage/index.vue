<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <environment-service-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import EnvironmentServiceCrud from "./EnvironmentServiceCrud";
    export default {
        name: "EnvironmentService",
        components: {EnvironmentServiceCrud}
    }
</script>

<style scoped>

</style>

