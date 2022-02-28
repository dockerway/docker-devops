<template>
        <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="update"
                 @close="$emit('close')"
    >
         <registry-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-update>
</template>

<script>

    import RegistryProvider from "../../../../providers/RegistryProvider";
    
    import {CrudUpdate, ClientError} from '@dracul/common-frontend'
    
    import RegistryForm from "../RegistryForm";
  
    

    export default {
        name: "RegistryUpdate",
        
        components: { RegistryForm, CrudUpdate },
        
        props:{
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },

        data() {
            return {
                title: 'registry.registry.editing',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                id: this.item.id,
                form: {
                    name: this.item.name,
                    url: this.item.url,
                    auth: this.item.auth,
                    username: this.item.username,
                    password: this.item.password
                }
            }
        },
        methods: {
            update() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    RegistryProvider.updateRegistry(this.id, this.form).then(r => {
                            if (r) {
                                this.$emit('itemUpdated',r.data.updateRegistry)
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

