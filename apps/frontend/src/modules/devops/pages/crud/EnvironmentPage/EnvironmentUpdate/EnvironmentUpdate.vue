<template>
        <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="update"
                 @close="$emit('close')"
    >
         <environment-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-update>
</template>

<script>

    import EnvironmentProvider from "../../../../providers/EnvironmentProvider";
    
    import {CrudUpdate, ClientError} from '@dracul/common-frontend'
    
    import EnvironmentForm from "../EnvironmentForm";
  
    

    export default {
        name: "EnvironmentUpdate",
        
        components: { EnvironmentForm, CrudUpdate },
        
        props:{
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },

        data() {
            return {
                title: 'devops.environment.editing',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                id: this.item.id,
                form: {
                    name: this.item.name,
                    dockerApiUrl: this.item.dockerApiUrl,
                    dockerApiToken: this.item.dockerApiToken,
                    type: this.item.type
                }
            }
        },
        methods: {
            update() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    EnvironmentProvider.updateEnvironment(this.id, this.form).then(r => {
                            if (r) {
                                this.$emit('itemUpdated',r.data.updateEnvironment)
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

