<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>
           
                    <v-col cols="12" sm="6">
                        <v-text-field
                                
                                prepend-icon="title"
                                name="name"
                                v-model="form.name"
                                :label="$t('devops.platform.labels.name')"
                                :placeholder="$t('devops.platform.labels.name')"
                                :error="hasInputErrors('name')"
                                :error-messages="getInputErrors('name')"
                                color="secondary"
                                :rules="required"
                        ></v-text-field>
                    </v-col>
    
        </v-row>
    </v-form>
</template>

<script>

    import {InputErrorsByProps, RequiredRule } from '@dracul/common-frontend'
    
    
    
    

    

    export default {
        name: "PlatformForm",
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

