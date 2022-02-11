<template>
<crud-layout :title="title" :subtitle="subtitle">

        <template v-slot:list>
            <environment-list 
                       ref="list"
                       @update="update"
                       @delete="remove"
                       @show="show"
            
            />
        </template>
        
         <add-button v-if="$store.getters.hasPermission('ENVIRONMENT_CREATE')" @click="create"></add-button>
      
        <environment-create v-if="creating" 
                        :open="creating"
                        v-on:itemCreated="onItemCreated" 
                        v-on:close="creating=false" 
        />
        
        <environment-update v-if="updating" 
                        :open="updating"
                        :item="itemToEdit" 
                        v-on:itemUpdated="onItemUpdated" 
                        v-on:close="updating=false" 
        />
          
        <environment-show v-if="showing" 
                           :open="showing" 
                           :item="itemToShow"  
                           v-on:close="showing=false" 
         />

        <environment-delete v-if="deleting" 
                         :open="deleting"
                         :item="itemToDelete"  
                         v-on:itemDeleted="onItemDeleted" 
                         v-on:close="deleting=false" 
        />

        <snackbar v-model="flash"/>

</crud-layout>
</template>

<script>
    
    import EnvironmentCreate from "../EnvironmentCreate";
    import EnvironmentUpdate from "../EnvironmentUpdate";
    import EnvironmentDelete from "../EnvironmentDelete";
    import EnvironmentShow from "../EnvironmentShow";
    import EnvironmentList from "../EnvironmentList";
    
     import {CrudLayout, AddButton, Snackbar} from "@dracul/common-frontend"
     
    export default {
        name: "EnvironmentCrud",
        components: {
            CrudLayout, AddButton, Snackbar,
            EnvironmentCreate, 
            EnvironmentUpdate, 
            EnvironmentDelete, 
            EnvironmentShow,
            EnvironmentList
        },
        data() {
            return {
                title: 'devops.environment.title',
                subtitle: 'devops.environment.subtitle',
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


