<template>
    <crud-delete 
        :open="open"
        :loading="loading"

        :title="title"
        :errorMessage="errorMessage"
        
        @delete="remove"
        @close="$emit('close')"
    >

        <v-card-text>
            <environment-service-show-data :item="item" />
        </v-card-text>

        

        <v-card-text>
            <v-row justify="center">
                <span class="title">{{ areYouSureMessage }}</span>
            </v-row>
        </v-card-text>

    </crud-delete>
</template>

<script>
import EnvironmentServiceShowData from "../EnvironmentServiceShow/EnvironmentServiceShowData";
import EnvironmentServiceProvider from "../../../../providers/EnvironmentServiceProvider";

import { CrudDelete, ClientError } from '@dracul/common-frontend';
import DockerProvider from "../../../../providers/DockerProvider";

export default {
    name: "EnvironmentServiceDelete",
    components: { EnvironmentServiceShowData, CrudDelete },
    props: {
        open: {
            type: Boolean, default: true
        },
        item: {
            type: Object, required: true
        },
        deletingRecord: {
            type: Boolean, required: true,
        },
    },

    data() {
        return {
            modal: false,
            loading: false,
            errorMessage: '',
        }
    },
    computed:{
        areYouSureMessage(){
            return this.deletingRecord ? this.$t('common.areYouSureDeleteRecord') : this.$t('devops.service.delete.areYouSureMessage')
        },
        title(){
            return this.deletingRecord ? 'devops.serviceRecords.delete' : 'devops.service.delete.title'
        },
        serviceName(){
            return  `${this.item.stack.name}_${this.item.name}`
        }
    },
    methods: {
        async remove(){
            if (this.deletingRecord){
                await this.deleteRecord()
            }else{
                await this.deleteService()
            }
        },
        async deleteRecord() {
            this.loading = true

            try {
                const deleteLocalRecordResult = (await EnvironmentServiceProvider.deleteEnvironmentService(this.item.id)).data.deleteEnvironmentService

                if (deleteLocalRecordResult.success) {
                    this.$emit('itemDeleted', deleteLocalRecordResult)
                    this.$emit('close')
                } else {
                    this.errorMessage = 'Error on Delete'
                }

            } catch (error) {
                const clientError = new ClientError(error)
                this.errorMessage = clientError.showMessage
            } finally {
                this.loading = false
            }
        },

        async deleteService() {
            this.loading = true

            try {
                const deleteServiceResult = (await DockerProvider.deleteDockerService(this.item.id, this.item.environment.type, this.serviceName)).data.deleteDockerService

                if (deleteServiceResult) {
                    this.$emit('itemDeleted', deleteServiceResult)
                    this.$emit('close')
                } else {
                    this.errorMessage = 'Error on Delete'
                }

            } catch (error) {
                const clientError = new ClientError(error)
                this.errorMessage = clientError.showMessage
            } finally {
                this.loading = false
            }
        },
    },
}
</script>


