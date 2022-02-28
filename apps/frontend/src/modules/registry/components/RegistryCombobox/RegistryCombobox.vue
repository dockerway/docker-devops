<template>
        <v-autocomplete
                prepend-icon="devices_fold"
                :items="items"
                :item-text="'name'"
                :item-value="itemValue"
                v-model="item"
                :label="$t('registry.registry.name')"
                :loading="loading"
                :error="hasInputErrors('registry')"
                :error-messages="getInputErrors('registry')"
                color="secondary"
                item-color="secondary"
                :rules="isRequired ? required : []"
                :multiple="multiple"
                :chips="chips"
                :solo="solo"
                :disabled="disabled"
                :readonly="readonly"
                :clearable="clearable"
                :hide-details="hideDetails"
                :style="{width: width, maxWidth: width}"
                :return-object="returnObject"
        ></v-autocomplete>

</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'


    import RegistryProvider from "../../providers/RegistryProvider"

    export default {
        name: "RegistryCombobox",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {type: [String, Array]},
            multiple: {type:Boolean, default: false },
            solo: {type:Boolean, default: false},
            chips: {type:Boolean, default: false},
            readonly: {type:Boolean, default:false},
            disabled: {type:Boolean, default: false},
            isRequired: {type:Boolean, default: false },
            clearable: {type:Boolean, default: false},
            hideDetails: {type: Boolean, default: false},
            returnObject: {type: Boolean, default: false},
            itemValue: {type: String, default: 'id'},
            width: {type: String, default: null},
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
                set(val) {this.$emit('input', val)}
            }
        },
        mounted() {
         this.fetch()
        },
        methods: {
            validate(){
              return this.$refs.form.validate()
            },
            fetch(){
               this.loading= true
                RegistryProvider.fetchRegistry().then(r => {
                    this.items = r.data.fetchRegistry
                }).catch(err => console.error(err))
                .finally(()=> this.loading = false)
            }

        }
    }
</script>

<style scoped>

</style>
