<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <registry-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-create>
</template>

<script>

    import RegistryProvider from "../../../../providers/RegistryProvider";
    
    import {CrudCreate, ClientError} from '@dracul/common-frontend'
    
    import RegistryForm from "../RegistryForm";
    
    


    export default {
        name: "RegistryCreate",
         
        components: { RegistryForm, CrudCreate },
        
        props:{
          open: {type: Boolean, default: true}
        },
        
        data() {
            return {
                title: 'registry.registry.creating',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    name: '',
                    url: '',
                    auth: false,
                    username: '',
                    password: ''
                }
            }
        },
        
        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    RegistryProvider.createRegistry(this.form).then(r => {
                            if (r) {
                                this.$emit('itemCreated',r.data.createRegistry)
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

