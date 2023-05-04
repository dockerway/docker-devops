<template>
    <crud-delete :open="open"
        :loading="loading"
        :title="title"
        :errorMessage="errorMessage"
        @delete="remove"
        @close="$emit('close')"
    >

        <v-card-text>
          <service-show-data :item="item" />
        </v-card-text>

        <v-card-text>
            <v-row justify="center">
                <span class="title">{{areYouSure}}</span>
            </v-row>
        </v-card-text>

    </crud-delete>
</template>

<script>
    //Provider  
    import EnvironmentServiceProvider from "../../../../providers/EnvironmentServiceProvider";
    import ServiceProvider from "../../../../providers/ServiceProvider";
    
    //Show Data
    import ServiceShowData from "../ServiceShow/ServiceShowData";
    
    //Common
    import {CrudDelete, ClientError} from '@dracul/common-frontend'
    
    export default {
        name: "ServiceDelete",
        
        components: {ServiceShowData, CrudDelete},
        
        props: {
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },
        
        data() {
            return {
                modal: false,
                title: 'devops.serviceTemplate.deleting',
                areYouSure: this.$t('common.areYouSureDeleteRecord'),
                errorMessage: '',
                loading: false,
            }
        },
        methods: {
            async remove() {
                try {
                    this.loading = true
                    await EnvironmentServiceProvider.deleteEnvironmentServicesByService(this.item.id)
                    const deleteServiceTemplateResponse = (await ServiceProvider.deleteServiceTemplate(this.item.id)).data.deleteServiceTemplate

                    if (deleteServiceTemplateResponse.success) {
                        this.$emit('itemDeleted', deleteServiceTemplateResponse)
                        this.$emit('close')
                    }else{
                        this.errorMessage = 'Error on Delete'
                    }
                } catch (error) {
                    const clientError = new ClientError(error)
                    this.errorMessage = clientError.showMessage
                }finally{
                    this.loading = false
                }
            },
        },
    }
</script>


