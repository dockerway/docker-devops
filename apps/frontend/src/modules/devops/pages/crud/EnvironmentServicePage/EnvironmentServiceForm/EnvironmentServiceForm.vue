<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>

                   <v-col cols="12" sm="6">
                        <environment-combobox v-model="form.environment" :input-errors="inputErrors" />
                   </v-col>


                   <v-col cols="12" sm="6">
                        <service-combobox v-model="form.service" :input-errors="inputErrors" />
                   </v-col>


                    <v-col cols="12" sm="6">
                        <v-text-field

                                prepend-icon="table_rows"
                                name="stack"
                                v-model="form.stack"
                                :label="$t('devops.environmentService.labels.stack')"
                                :placeholder="$t('devops.environmentService.labels.stack')"
                                :error="hasInputErrors('stack')"
                                :error-messages="getInputErrors('stack')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>

        </v-row>
    </v-form>
</template>

<script>

    import {InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'

    import EnvironmentCombobox from "../../../../components/EnvironmentCombobox";
import ServiceCombobox from "../../../../components/ServiceCombobox";





    export default {
        name: "EnvironmentServiceForm",
        mixins: [InputErrorsByProps, RequiredRule    ],
        components: {EnvironmentCombobox,
ServiceCombobox},
        props:{
            value: {
                type: Object,
                required: true
            },
        },
        computed: {
           form: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
            }
        },
         watch: {
            form: {
                handler(newVal) {
                    this.$emit('input', newVal)
                },
                deep: true
            }
        },
        methods: {
            validate(){
              return this.$refs.form.validate()
            }
        },
        data(){
            return {

            }
        }
    }
</script>

<style scoped>

</style>

