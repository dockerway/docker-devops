<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.name" :label="$t('devops.stack.labels.name')" icon="title"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.platform.name" :label="$t('devops.stack.labels.platform')" icon="space_dashboard"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.environments.map(i => i.name).join(', ')" :label="$t('devops.stack.labels.environments')" icon="tune"/>
            </v-list>
        </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@dracul/common-frontend'
     
    
    export default {
        name: 'StackShowData',
        components: {ShowField},
        
        props: {
            item: {type: Object, required: true}
        }
    }
</script>

