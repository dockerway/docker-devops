<template>
    <v-container fluid>
        <v-card>
            <v-card-title>{{ this.$t("deployHistory.title") }}</v-card-title>
            <v-card-subtitle>{{ this.$t("deployHistory.subtitle") }}</v-card-subtitle>

            <v-card-text>
                <DeployHistoryFilters v-model="filters" />

                <DeployHistory />
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import DeployHistoryFilters from "./DeployHistoryFilters/DeployHistoryFilters.vue";
import DeployHistory from "./DeployHistory/DeployHistory.vue";

export default {
    name: "DeployHistoryPage",
    components: { DeployHistoryFilters, DeployHistory },
    data() {
        return {
            filters: [
                {
                    field: 'action',
                    operator: '$regex',
                    value: null
                },
                {
                    field: 'user',
                    operator: '$eq',
                    value: null
                },
                {
                    field: 'resource',
                    operator: '$regex',
                    value: null
                }
            ]
        }
    },
}
</script>

<style scoped></style>

