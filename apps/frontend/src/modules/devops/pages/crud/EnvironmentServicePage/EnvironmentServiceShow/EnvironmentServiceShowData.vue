<template>
  <v-container fluid>

    <v-toolbar flat dense>
      <v-tabs
          v-model="tab"
          align-with-title
      >
        <v-tabs-slider color="yellow"></v-tabs-slider>

        <v-tab
            v-for="item in tabItems"
            :key="item"
        >
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-card-text class="overflow-y-auto" :style="{height:'300px'}">
      <v-tabs-items :value="tab">
        <v-tab-item>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-list>
                <show-field :value="item.environment.name" :label="$t('devops.environmentService.labels.environment')"
                            icon="tune"/>
                <show-field :value="item.replicas ? item.replicas.toString() : ''" :label="$t('devops.environmentService.labels.replicas')"
                            icon="double_arrow"/>
              </v-list>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-list>
                <show-field :value="item.service.name" :label="$t('devops.environmentService.labels.service')"
                            icon="design_services"/>
                <show-field :value="item.stack.name" :label="$t('devops.environmentService.labels.stack')"
                            icon="table_rows"/>

              </v-list>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-list>
                <show-field :value="item.name" :label="$t('devops.environmentService.labels.name')" icon="title"/>
              </v-list>
            </v-col>

            <v-col cols="12">
              <show-field :value="item.image" :label="$t('devops.environmentService.labels.image')" icon="album"/>

            </v-col>
          </v-row>
        </v-tab-item>


        <!--PORTS-->
        <v-tab-item
            key="Ports"
            v-if="item.ports">
          <v-data-table
              :items="item.ports" :items-per-page="5"
              :headers="[
              {text:'hostPort',value:'hostPort'},
              {text:'containerPort',value:'containerPort'},
          ]"
          ></v-data-table>
        </v-tab-item>


        <!--VOLUMES-->
        <v-tab-item
            key="Volumes"
            v-if="item.volumes">
          <v-data-table
              :items="item.volumes" :items-per-page="5"
              :headers="[
              {text:'hostVolume',value:'hostVolume'},
              {text:'containerVolume',value:'containerVolume'},
          ]"
          ></v-data-table>
        </v-tab-item>

        <!--VARIABLES-->
        <v-tab-item
            key="Envs"
            v-if="item.envs"
        >
          <v-data-table
              :items="item.envs" hide-default-footer :items-per-page="1000"
              :headers="[
              {text:'name',value:'name'},
              {text:'value',value:'value'},
          ]"
          ></v-data-table>
        </v-tab-item>

        <!--LABELS-->
        <v-tab-item
            key="Labels"
            v-if="item.labels"
        >
          <v-data-table
              :items="item.labels" :items-per-page="5"
              :headers="[
              {text:'name',value:'name'},
              {text:'value',value:'value'},
          ]"
          ></v-data-table>
        </v-tab-item>

        <!--Constraints-->
        <v-tab-item
            key="Constraints"
            v-if="item.constraints"
        >
          <v-data-table
              :items="item.constraints" :items-per-page="5"
              :headers="[
              {text:'name',value:'name'},
              {text:'operation',value:'operation'},
              {text:'value',value:'value'},
          ]"
          ></v-data-table>
        </v-tab-item>

        <!--Limits-->
        <v-tab-item
            key="Limits"
            v-if="item.limits"
        >
          <v-list>
              <div v-for="(limit,index) in item.limits" :key="index">
                  <show-field :label="fetchLabel(index)" :value="limit ? limit.toString() : '0'"  icon="memory"/>
              </div>
          </v-list>
        </v-tab-item>

        <!--Preferences-->
        <v-tab-item
            key="Preferences"
            v-if="item.preferences"
        >
          <v-data-table
              :items="item.preferences" :items-per-page="5"
              :headers="[
              {text:'name',value:'name'},
              {text:'value',value:'value'},
          ]"
          ></v-data-table>
        </v-tab-item>

      </v-tabs-items>
    </v-card-text>

  </v-container>

</template>
<script>
import {ShowField} from '@dracul/common-frontend'


export default {
  name: 'EnvironmentServiceShowData',
  components: {ShowField},
  props: {
    item: {type: Object, required: true}
  },
  data() {
    return {
      tab: 0,
      tabItems: ['Main', 'Ports', 'Volumes', 'Envs', 'Labels', 'Constraints', 'Limits', 'Preferences']
    }
  },
  methods:{
      fetchLabel(i){
          switch(i){
              case "memoryReservation":
                  return this.$t('devops.service.labels.memoryReservation')
              case "memoryLimit":
                  return this.$t('devops.service.labels.memoryLimit')
              case "CPUReservation":
                  return this.$t('devops.service.labels.CPUReservation')
              case "CPULimit":
                  return this.$t('devops.service.labels.CPULimit')
              default:
                  return this.$t('devops.service.labels.limits')
          }
      }
  }
}
</script>

