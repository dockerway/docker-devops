<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="pa-3">
               <stack-crud />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import StackCrud from "./StackCrud";
    export default {
        name: "Stack",
        components: {StackCrud}
    }
</script>

<style scoped>

</style>

