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
                                :rules="required.concat(noWhiteSpacesRule)"
                        />
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
            },
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
            },
            checkIfStackNameHaveSpaces(stackName) {
                /* eslint-disable no-useless-escape */
                const noWhiteSpacesRegex = new RegExp(/^[^\s]*$/)
                
                return (noWhiteSpacesRegex.test(stackName)) ? true : 'El nombre del stack no debe poseer espacios en blanco'
            }
        },
        data(){
            return {
                noWhiteSpacesRule: [stackName => this.checkIfStackNameHaveSpaces(stackName)]
            }
        }
    }
</script>

<style scoped>

</style>

