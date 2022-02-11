<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.name" :label="$t('devops.environment.labels.name')" icon="fingerprint"/>
                 <show-field :value="item.dockerApiToken" :label="$t('devops.environment.labels.dockerApiToken')" icon="token"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.permission" :label="$t('devops.environment.labels.permission')" icon="lock"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.dockerApiUrl" :label="$t('devops.environment.labels.dockerApiUrl')" icon="http"/>
            </v-list>
        </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@dracul/common-frontend'
     
    
    export default {
        name: 'EnvironmentShowData',
        components: {ShowField},
        
        props: {
            item: {type: Object, required: true}
        }
    }
</script>

