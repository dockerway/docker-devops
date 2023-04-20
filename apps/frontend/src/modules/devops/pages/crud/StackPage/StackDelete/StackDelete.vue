<template>
      <crud-delete :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @delete="remove"
                 @close="$emit('close')"
    >

        <v-card-text>
          <stack-show-data :item="item" />
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
import StackProvider from "../../../../providers/StackProvider";
    
    //Show Data
    import StackShowData from "../StackShow/StackShowData";
    
    //Common
    import {CrudDelete, ClientError} from '@dracul/common-frontend'
    
    export default {
        name: "StackDelete",
        
        components: {StackShowData, CrudDelete},
        
        props: {
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },
        
        data() {
            return {
                modal: false,
                title: 'devops.stack.deleting',
                areYouSure: this.$t('common.areYouSureDeleteRecord'),
                errorMessage: '',
                loading: false,
            }
        },
        methods: {
            async remove() {
                this.loading = true

                try {
                    await EnvironmentServiceProvider.deleteEnvironmentServicesByStack(this.item.id)
                    const stackDeletionResult = (await StackProvider.deleteStack(this.item.id)).data.deleteStack
                    
                    this.$emit('itemDeleted', stackDeletionResult)
                    this.$emit('close')
                } catch (error) {
                    this.errorMessage = 'Error on Delete'

                    const clientError = new ClientError(error)
                    this.errorMessage = clientError.showMessage

                } finally{
                    this.loading = false
                }
            },
        },
    }
</script>


