<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>

                    <v-col cols="12" sm="6">
                        <v-text-field

                                prepend-icon="title"
                                name="name"
                                v-model="form.name"
                                :label="$t('registry.registry.labels.name')"
                                :placeholder="$t('registry.registry.labels.name')"
                                :error="hasInputErrors('name')"
                                :error-messages="getInputErrors('name')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>


                    <v-col cols="12" sm="6">
                        <v-text-field

                                prepend-icon="link"
                                name="url"
                                v-model="form.url"
                                :label="$t('registry.registry.labels.url')"
                                :placeholder="$t('registry.registry.labels.url')"
                                :error="hasInputErrors('url')"
                                :error-messages="getInputErrors('url')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>


                    <v-col cols="12" sm="4">
                        <v-checkbox
                                prepend-icon="login"
                                name="auth"
                                v-model="form.auth"
                                :label="$t('registry.registry.labels.auth')"
                                :error="hasInputErrors('auth')"
                                :error-messages="getInputErrors('auth')"
                                color="secondary"

                        ></v-checkbox>
                    </v-col>


                    <v-col v-if="form.auth" cols="12" sm="4">
                        <v-text-field

                                prepend-icon="person"
                                name="username"
                                v-model="form.username"
                                :label="$t('registry.registry.labels.username')"
                                :placeholder="$t('registry.registry.labels.username')"
                                :error="hasInputErrors('username')"
                                :error-messages="getInputErrors('username')"
                                color="secondary"

                        ></v-text-field>
                    </v-col>


                    <v-col v-if="form.auth" cols="12" sm="4">
                        <v-text-field

                                prepend-icon="lock"
                                name="password"
                                v-model="form.password"
                                :label="$t('registry.registry.labels.password')"
                                :placeholder="$t('registry.registry.labels.password')"
                                :error="hasInputErrors('password')"
                                :error-messages="getInputErrors('password')"
                                color="secondary"

                        ></v-text-field>
                    </v-col>

        </v-row>
    </v-form>
</template>

<script>

    import {InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'







    export default {
        name: "RegistryForm",
        mixins: [InputErrorsByProps, RequiredRule    ],

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

