<template>
      <crud-delete :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @delete="remove"
                 @close="$emit('close')"
    >

        <v-card-text>
          <environment-show-data :item="item" />
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
    import EnvironmentProvider from "../../../../providers/EnvironmentProvider";
    
    //Show Data
    import EnvironmentShowData from "../EnvironmentShow/EnvironmentShowData";
    
    //Common
    import {CrudDelete, ClientError} from '@dracul/common-frontend'
    
    export default {
        name: "EnvironmentDelete",
        
        components: {EnvironmentShowData, CrudDelete},
        
        props: {
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },
        
        data() {
            return {
                modal: false,
                title: 'devops.environment.deleting',
                areYouSure: this.$t('common.areYouSureDeleteRecord'),
                errorMessage: '',
                loading: false,
            }
        },
        methods: {
            remove() {
                this.loading = true
                EnvironmentProvider.deleteEnvironment(this.item.id).then(result => {
                            if (result.data.deleteEnvironment.success) {
                                this.$emit('itemDeleted',result.data.deleteEnvironment)
                                this.$emit('close')
                            }else{
                                this.errorMessage = 'Error on Delete'
                            }
                        }
                    ).catch(error =>{
                        let clientError = new ClientError(error)
                        this.errorMessage = clientError.showMessage
                }).finally(() => this.loading = false)
            },
        },
    }
</script>


