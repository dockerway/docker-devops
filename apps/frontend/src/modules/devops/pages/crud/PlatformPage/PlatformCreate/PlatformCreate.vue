<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <platform-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-create>
</template>

<script>

    import PlatformProvider from "../../../../providers/PlatformProvider";
    
    import {CrudCreate, ClientError} from '@dracul/common-frontend'
    
    import PlatformForm from "../PlatformForm";
    
    


    export default {
        name: "PlatformCreate",
         
        components: { PlatformForm, CrudCreate },
        
        props:{
          open: {type: Boolean, default: true}
        },
        
        data() {
            return {
                title: 'devops.platform.creating',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    name: ''
                }
            }
        },
        
        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    PlatformProvider.createPlatform(this.form).then(r => {
                            if (r) {
                                this.$emit('itemCreated',r.data.createPlatform)
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

