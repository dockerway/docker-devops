<template>
    <crud-show :title="title" :open="open"  @close="$emit('close')">

        <v-card-text>
            <stack-show-data :item="item" />
        </v-card-text>

  </crud-show>
</template>

<script>
    import StackShowData from "./StackShowData";
    import {CrudShow} from '@dracul/common-frontend'
 
    export default {
        name: "StackShow",
        components: {CrudShow, StackShowData},
        props: {
            open: {type: Boolean, default: true},
            item: {type: Object, required: true}
        },
        data() {
            return {
                title: 'devops.stack.showing',
            }
        },
    }
</script>

