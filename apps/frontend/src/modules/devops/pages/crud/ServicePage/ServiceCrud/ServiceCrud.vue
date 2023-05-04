<template>
<crud-layout :title="title" :subtitle="subtitle">

        <template v-slot:list>
            <service-list 
                       ref="list"
                       @update="update"
                       @delete="remove"
                       @show="show"
            
            />
        </template>
        
         <add-button v-if="$store.getters.hasPermission('SERVICE_TEMPLATE_CREATE')" @click="create"></add-button>
      
        <service-create v-if="creating" 
                        :open="creating"
                        v-on:itemCreated="onItemCreated" 
                        v-on:close="creating=false" 
        />
        
        <service-update v-if="updating" 
                        :open="updating"
                        :item="itemToEdit" 
                        v-on:itemUpdated="onItemUpdated" 
                        v-on:close="updating=false" 
        />
          
        <service-show v-if="showing" 
                           :open="showing" 
                           :item="itemToShow"  
                           v-on:close="showing=false" 
         />

        <service-delete v-if="deleting" 
                         :open="deleting"
                         :item="itemToDelete"  
                         v-on:itemDeleted="onItemDeleted" 
                         v-on:close="deleting=false" 
        />

        <snackbar v-model="flash"/>

</crud-layout>
</template>

<script>
    
    import ServiceCreate from "../ServiceCreate";
    import ServiceUpdate from "../ServiceUpdate";
    import ServiceDelete from "../ServiceDelete";
    import ServiceShow from "../ServiceShow";
    import ServiceList from "../ServiceList";
    
     import {CrudLayout, AddButton, Snackbar} from "@dracul/common-frontend"
     
    export default {
        name: "ServiceCrud",
        components: {
            CrudLayout, AddButton, Snackbar,
            ServiceCreate, 
            ServiceUpdate, 
            ServiceDelete, 
            ServiceShow,
            ServiceList
        },
        data() {
            return {
                title: 'devops.serviceTemplate.title',
                subtitle: 'devops.serviceTemplate.subtitle',
                flash: null,
                creating: false,
                updating: false,
                deleting: false,
                showing: false,
                itemToEdit: null,
                itemToDelete: null,
                itemToShow: null,
            }
        },
        methods: {
            //On
            onItemCreated() {
                this.$refs.list.fetch()
                this.flash= "common.created"
            },
            onItemUpdated() {
                this.$refs.list.fetch()
                this.flash= "common.updated"
            },
            onItemDeleted() {
                this.$refs.list.fetch()
                this.flash= "common.deleted"
            },
            //Open
            create() {
                this.creating = true
            },
            update(item) {
                this.updating = true
                this.itemToEdit = item
            },
            show(item) {
                this.showing = true
                this.itemToShow = item
            },
            remove(item) {
                this.deleting = true
                this.itemToDelete = item
            }
        }
        
    }
</script>


