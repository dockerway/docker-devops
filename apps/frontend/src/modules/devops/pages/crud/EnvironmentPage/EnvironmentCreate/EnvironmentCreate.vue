<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <environment-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-create>
</template>

<script>

    import EnvironmentProvider from "../../../../providers/EnvironmentProvider";
    
    import {CrudCreate, ClientError} from '@dracul/common-frontend'
    
    import EnvironmentForm from "../EnvironmentForm";
    
    


    export default {
        name: "EnvironmentCreate",
         
        components: { EnvironmentForm, CrudCreate },
        
        props:{
          open: {type: Boolean, default: true}
        },
        
        data() {
            return {
                title: 'devops.environment.creating',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    name: '',
                    permission: [],
                    dockerApiUrl: '',
                    dockerApiToken: ''
                }
            }
        },
        
        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    EnvironmentProvider.createEnvironment(this.form).then(r => {
                            if (r) {
                                this.$emit('itemCreated',r.data.createEnvironment)
                                this.$emit('close')
                            }
                        }
                    ).catch(error => {
                         let clientError = new ClientError(error)
                         this.inputErrors = clientError.inputErrors
                         this.errorMessage = clientError.i18nMessage
                    }).finally(() => this.loading = false)
                }

            }

        },
    }
</script>

<style scoped>

</style>

