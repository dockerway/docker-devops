<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <stack-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-create>
</template>

<script>

    import StackProvider from "../../../../providers/StackProvider";
    
    import {CrudCreate, ClientError} from '@dracul/common-frontend'
    
    import StackForm from "../StackForm";
    
    


    export default {
        name: "StackCreate",
         
        components: { StackForm, CrudCreate },
        
        props:{
          open: {type: Boolean, default: true}
        },
        
        data() {
            return {
                title: 'devops.stack.creating',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    name: '',
                    platform: null,
                    environments: []
                }
            }
        },
        
        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    StackProvider.createStack(this.form).then(r => {
                            if (r) {
                                this.$emit('itemCreated',r.data.createStack)
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

