<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <service-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ServiceCrud from "./ServiceCrud";
    export default {
        name: "Service",
        components: {ServiceCrud}
    }
</script>

<style scoped>

</style>

