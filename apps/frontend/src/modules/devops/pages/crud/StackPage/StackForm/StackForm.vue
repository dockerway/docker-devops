<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>

                    <v-col cols="12" sm="6">
                        <v-text-field

                                prepend-icon="title"
                                name="name"
                                v-model="form.name"
                                :label="$t('devops.stack.labels.name')"
                                :placeholder="$t('devops.stack.labels.name')"
                                :error="hasInputErrors('name')"
                                :error-messages="getInputErrors('name')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>


                   <v-col cols="12" sm="6">
                        <platform-combobox v-model="form.platform" :input-errors="inputErrors" />
                   </v-col>


                   <v-col cols="12" sm="6">
                        <environment-combobox v-model="form.environments" :input-errors="inputErrors" multiple />
                   </v-col>

        </v-row>
    </v-form>
</template>

<script>

    import {InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'

    import PlatformCombobox from "../../../../components/PlatformCombobox";
import EnvironmentCombobox from "../../../../components/EnvironmentCombobox";





    export default {
        name: "StackForm",
        mixins: [InputErrorsByProps, RequiredRule    ],
        components: {PlatformCombobox,
EnvironmentCombobox,},
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

