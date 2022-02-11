<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <environment-service-show-data :item="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import EnvironmentServiceShowData from "./EnvironmentServiceShowData";
    import {CrudShow} from '@dracul/common-frontend'
 
    export default {
        name: "EnvironmentServiceShow",
        components: {CrudShow, EnvironmentServiceShowData},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: 'devops.environmentService.showing',
            }
        },
    }
</script>

