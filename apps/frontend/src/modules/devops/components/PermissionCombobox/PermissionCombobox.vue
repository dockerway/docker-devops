<template>

        <v-select
                prepend-icon="lock"
                :items="items"
                v-model="item"
                :label="$t('devops.environment.labels.permission')"
                :loading="loading"
                :error="hasInputErrors('permission')"
                :error-messages="getInputErrors('permission')"
                color="secondary"
                item-color="secondary"

                :clearable="clearable"
                :multiple="multiple"
                :chips="chips"
                :solo="solo"
        ></v-select>

</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'



    export default {
        name: "PermissionCombobox",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {type: [String, Array]},
            clearable: {type:Boolean, default: false},
            multiple: {type:Boolean, default: false},
            solo: {type:Boolean, default: false},
            chips: {type:Boolean, default: false}
        },
        data() {
            return {
                items: ['ENV_DEV_VIEW','ENV_DEV_EDIT','ENV_QA_VIEW','ENV_QA_EDIT','ENV_PROD_VIEW','ENV_PROD_EDIT'],
                loading: false
            }
        },
        computed: {
           item: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
            }
        },
        methods: {
            validate(){
              return this.$refs.form.validate()
            }
        }
    }
</script>

<style scoped>

</style>

