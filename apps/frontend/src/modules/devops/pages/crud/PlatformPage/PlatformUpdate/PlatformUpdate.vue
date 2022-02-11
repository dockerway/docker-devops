<template>
        <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="update"
                 @close="$emit('close')"
    >
         <platform-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-update>
</template>

<script>

    import PlatformProvider from "../../../../providers/PlatformProvider";
    
    import {CrudUpdate, ClientError} from '@dracul/common-frontend'
    
    import PlatformForm from "../PlatformForm";
  
    

    export default {
        name: "PlatformUpdate",
        
        components: { PlatformForm, CrudUpdate },
        
        props:{
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },

        data() {
            return {
                title: 'devops.platform.editing',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                id: this.item.id,
                form: {
                    name: this.item.name
                }
            }
        },
        methods: {
            update() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    PlatformProvider.updatePlatform(this.id, this.form).then(r => {
                            if (r) {
                                this.$emit('itemUpdated',r.data.updatePlatform)
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

