<template>
        <v-autocomplete
                prepend-icon="tune"
                :items="items"
                :item-text="'name'"
                :item-value="'id'"
                v-model="item"
                :label="$t('devops.service.labels.environment')"
                :loading="loading"
                :error="hasInputErrors('environment')"
                :error-messages="getInputErrors('environment')"
                color="secondary"
                item-color="secondary"
                :rules="isRequired ? required : []"
                :multiple="multiple"
                :chips="chips"
                :solo="solo"
                :disabled="disabled"
                :readonly="readonly"
                 :clearable="clearable"
        ></v-autocomplete>

</template>

<script>

import { InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'


import EnvironmentProvider from "../../providers/EnvironmentProvider"

export default {
    name: "EnvironmentCombobox",
    mixins: [InputErrorsByProps, RequiredRule],
    props: {
        value: { type: [String, Array] },
        multiple: { type: Boolean, default: false },
        solo: { type: Boolean, default: false },
        chips: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        isRequired: { type: Boolean, default: false },
        clearable: { type: Boolean, default: false },
    },
    data() {
        return {
            items: [],
            loading: false
        }
    },
    computed: {
        item: {
            get() { return this.value },
            set(val) { this.$emit('input', val) }
        }
    },
    async mounted() {
        await this.fetch()
    },
    methods: {
        validate() {
            return this.$refs.form.validate()
        },
        async fetch() {
            this.loading = true
            this.items = (await EnvironmentProvider.fetchEnvironment()).data.fetchEnvironment
            this.sortItemsByName()
            this.loading = false
        },

        sortItemsByName() {
            this.items.sort((itemA, itemB) => {
                const nameA = itemA.name.toLowerCase()
                const nameB = itemB.name.toLowerCase()

                if (nameA < nameB) {
                    return -1
                } else if (nameA > nameB) {
                    return 1
                } else {
                    return 0
                }
            })
        }

    }
}
</script>

<style scoped>

</style>