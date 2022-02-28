<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <registry-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import RegistryCrud from "./RegistryCrud";
    export default {
        name: "Registry",
        components: {RegistryCrud}
    }
</script>

<style scoped>

</style>

