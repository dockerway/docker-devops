<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <platform-show-data :item="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import PlatformShowData from "./PlatformShowData";
    import {CrudShow} from '@dracul/common-frontend'
 
    export default {
        name: "PlatformShow",
        components: {CrudShow, PlatformShowData},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: 'devops.platform.showing',
            }
        },
    }
</script>

