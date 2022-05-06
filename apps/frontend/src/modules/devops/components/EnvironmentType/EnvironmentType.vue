<template>
    <v-select
        prepend-icon="lock"
        :items="items"
        v-model="item"
        :label="$t('devops.environment.labels.type')"
        :loading="loading"
        :error="hasInputErrors('type')"
        :error-messages="getInputErrors('type')"
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
        name: "EnvironmentType",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {type: String},
            clearable: {type:Boolean, default: false},
            multiple: {type:Boolean, default: false},
            solo: {type:Boolean, default: false},
            chips: {type:Boolean, default: false}
        },
        data() {
            return {
                items: ['DEV', 'QA', 'PRE', 'PROD'],
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
            },
        }
    }
</script>

<style scoped>

</style>