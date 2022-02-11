<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <service-show-data :item="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import ServiceShowData from "./ServiceShowData";
    import {CrudShow} from '@dracul/common-frontend'
 
    export default {
        name: "ServiceShow",
        components: {CrudShow, ServiceShowData},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: 'devops.service.showing',
            }
        },
    }
</script>

