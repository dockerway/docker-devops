<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field v-if="item.name" :value="item.name ? item.name.toString() : ''" :label="$t('devops.service.labels.name')" icon="fingerprint"/>
                 <show-field v-if="item.volumes" :value="item.volumes ? item.volumes.toString() : ''" :label="$t('devops.service.labels.volumes')" icon="storage"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field v-if="item.description" :value="item.description ? item.description.toString() : ''" :label="$t('devops.service.labels.description')" icon=""/>
                 <show-field v-if="item.ports" :value="item.ports ? item.ports.toString() : ''" :label="$t('devops.service.labels.ports')" icon="connecting_airports"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4" v-if="item.platform">
            <v-list>
                 <show-field :value="item.platform.name ? item.platform.name.toString() : ''" :label="$t('devops.service.labels.platform')" icon="space_dashboard"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4"  v-if="item.constraints">
            <v-list>
                <div v-for="(constraint, index) in item.constraints" :key="index">
                    <show-field :value="constraint.name + ' ' + constraint.operation + ' ' + constraint.defaultValue" :label="$t('devops.service.labels.constraints')" icon="key"/>
                </div>
            </v-list>
        </v-col>

        <v-col cols="12">
            <v-row>
                <v-col cols="12" sm="6" md="4">
                    <v-list>
                        <div v-for="(limit,index) in item.limits" :key="index">
                            <show-field :label="fetchLabel(index)" :value="limit ? limit.toString() : '0'"  icon="memory"/>
                        </div>
                    </v-list>
                </v-col>
            </v-row>
        </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@dracul/common-frontend'
     
    
    export default {
        name: 'ServiceShowData',
        components: {ShowField},
        props: {
            item: {type: [Object,Array], required: true}
        },
        data(){
            return {
                isLimits: false,
            }
        },
        methods:{
            fetchLabel(i){
                switch(i){
                    case "memoryReservation":
                        return this.$t('devops.service.labels.memoryReservation')
                    case "memoryLimit":
                        return this.$t('devops.service.labels.memoryLimit')
                    case "CPUReservation":
                        return this.$t('devops.service.labels.CPUReservation')
                    case "CPULimit":
                        return this.$t('devops.service.labels.CPULimit')
                    default:
                        return this.$t('devops.service.labels.limits')
                }
            }
        }
    }
</script>

