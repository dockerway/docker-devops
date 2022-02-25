<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.environment.name" :label="$t('devops.environmentService.labels.environment')" icon="tune"/>
                 <show-field :value="item.image" :label="$t('devops.environmentService.labels.image')" icon="image"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.service.name" :label="$t('devops.environmentService.labels.service')" icon="design_services"/>
                 <show-field :value="item.replicas.toString()" :label="$t('devops.environmentService.labels.replicas')" icon="double_arrow"/>
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                 <show-field :value="item.stack.name" :label="$t('devops.environmentService.labels.stack')" icon="table_rows"/>
            </v-list>
        </v-col>

      <v-col cols="12">
        <h4>Ports</h4>
        <v-row v-for="(port,index) in item.ports" :key="index">
          <v-col>
            <show-field :value="port.hostPort.toString()" label="HostPort"/>

          </v-col>
          <v-col>
            <show-field :value="port.containerPort.toString()" label="ContainerPort"/>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <h4>Volume</h4>
        <v-row v-for="(volume,index) in item.volumes" :key="index">
          <v-col>
            <show-field :value="volume.hostVolume" label="HostVolume"/>

          </v-col>
          <v-col>
            <show-field :value="volume.containerVolume" label="ContainerVolume"/>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <h4>Envs</h4>
        <v-row v-for="(env,index) in item.envs" :key="index">
          <v-col>
            <show-field :value="env.name" label="Name"/>

          </v-col>
          <v-col>
            <show-field :value="env.value" label="Value"/>
          </v-col>
        </v-row>
      </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@dracul/common-frontend'


    export default {
        name: 'EnvironmentServiceShowData',
        components: {ShowField},

        props: {
            item: {type: Object, required: true}
        }
    }
</script>

