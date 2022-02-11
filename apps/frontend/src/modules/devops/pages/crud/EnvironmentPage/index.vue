<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <environment-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import EnvironmentCrud from "./EnvironmentCrud";
    export default {
        name: "Environment",
        components: {EnvironmentCrud}
    }
</script>

<style scoped>

</style>

