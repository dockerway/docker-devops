<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <environment-show-data :item="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import EnvironmentShowData from "./EnvironmentShowData";
    import {CrudShow} from '@dracul/common-frontend'
 
    export default {
        name: "EnvironmentShow",
        components: {CrudShow, EnvironmentShowData},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: 'devops.environment.showing',
            }
        },
    }
</script>

