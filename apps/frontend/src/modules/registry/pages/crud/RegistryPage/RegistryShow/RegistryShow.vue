<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <registry-show-data :item="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import RegistryShowData from "./RegistryShowData";
    import {CrudShow} from '@dracul/common-frontend'
 
    export default {
        name: "RegistryShow",
        components: {CrudShow, RegistryShowData},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: 'registry.registry.showing',
            }
        },
    }
</script>

