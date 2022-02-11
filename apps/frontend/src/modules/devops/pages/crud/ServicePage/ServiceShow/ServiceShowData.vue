<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.name" :label="$t('devops.service.labels.name')" icon="fingerprint"/>
                 <show-field :value="item.volumes" :label="$t('devops.service.labels.volumes')" icon="storage"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.description" :label="$t('devops.service.labels.description')" icon=""/>
                 <show-field :value="item.ports" :label="$t('devops.service.labels.ports')" icon="connecting_airports"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.platform.name" :label="$t('devops.service.labels.platform')" icon="space_dashboard"/>
            </v-list>
        </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@dracul/common-frontend'
     
    
    export default {
        name: 'ServiceShowData',
        components: {ShowField},
        
        props: {
            item: {type: Object, required: true}
        }
    }
</script>

