<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.name" :label="$t('registry.registry.labels.name')" icon="title"/>
                 <show-field :value="item.username" :label="$t('registry.registry.labels.username')" icon="person"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.url" :label="$t('registry.registry.labels.url')" icon="link"/>
                 <show-field :value="item.password" :label="$t('registry.registry.labels.password')" icon="lock"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.auth" :label="$t('registry.registry.labels.auth')" icon="login"/>
            </v-list>
        </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@dracul/common-frontend'
     
    
    export default {
        name: 'RegistryShowData',
        components: {ShowField},
        
        props: {
            item: {type: Object, required: true}
        }
    }
</script>

