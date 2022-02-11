<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>

                    <v-col cols="12" sm="6">
                        <v-text-field

                                prepend-icon="fingerprint"
                                name="name"
                                v-model="form.name"
                                :label="$t('devops.environment.labels.name')"
                                :placeholder="$t('devops.environment.labels.name')"
                                :error="hasInputErrors('name')"
                                :error-messages="getInputErrors('name')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>


                   <v-col cols="12" sm="6">
                        <permission-combobox v-model="form.permission" :input-errors="inputErrors" multiple />
                   </v-col>


                    <v-col cols="12" sm="6">
                        <v-text-field

                                prepend-icon="http"
                                name="dockerApiUrl"
                                v-model="form.dockerApiUrl"
                                :label="$t('devops.environment.labels.dockerApiUrl')"
                                :placeholder="$t('devops.environment.labels.dockerApiUrl')"
                                :error="hasInputErrors('dockerApiUrl')"
                                :error-messages="getInputErrors('dockerApiUrl')"
                                color="secondary"

                        ></v-text-field>
                    </v-col>


                    <v-col cols="12" sm="6">
                        <v-text-field

                                prepend-icon="token"
                                name="dockerApiToken"
                                v-model="form.dockerApiToken"
                                :label="$t('devops.environment.labels.dockerApiToken')"
                                :placeholder="$t('devops.environment.labels.dockerApiToken')"
                                :error="hasInputErrors('dockerApiToken')"
                                :error-messages="getInputErrors('dockerApiToken')"
                                color="secondary"

                        ></v-text-field>
                    </v-col>

        </v-row>
    </v-form>
</template>

<script>

    import {InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'


    import PermissionCombobox from "../../../../components/PermissionCombobox";




    export default {
        name: "EnvironmentForm",
        mixins: [InputErrorsByProps, RequiredRule    ],
        components: {PermissionCombobox,},
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

