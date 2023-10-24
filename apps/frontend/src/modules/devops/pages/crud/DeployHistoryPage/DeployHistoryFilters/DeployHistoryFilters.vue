<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" xs="12" sm="6" md="4">
                <v-row class="pa-6">
                    <v-text-field prependIcon="mdi-server-outline" :label="this.$t('devops.service.labels.environment')"
                        clearable v-model="networkName" />
                </v-row>
            </v-col>


            <v-col cols="12" xs="12" sm="6" md="4" class="pa-6">
                <v-autocomplete :items="[{ text: 'Si', value: true }, { text: 'No', value: false }]"
                    :label="this.$t('devops.service.labels.stack')" prependIcon="mdi-cloud-outline" clearable
                    v-model="attachable" />
            </v-col>

            <v-col cols="12" xs="12" sm="6" md="4" class="pa-6">
                <v-autocomplete prependIcon="search" :label="this.$t('devops.service.labels.name')"
                    :items="['overlay', 'bridge', 'host']" clearable v-model="networkDriver" />
            </v-col>
        </v-row>


        <v-row>
            <v-col cols="12" xs="12" sm="6" md="4" class="pa-6">
                <date-input :allowed-dates="sinceDates" :label="this.$t('deployHistory.filters.since')"
                    v-model="sinceDate" />
            </v-col>

            <v-col cols="12" xs="12" sm="6" md="4" class="pa-6">
                <date-input :label="this.$t('deployHistory.filters.until')" :allowed-dates="untilDates"
                    v-model="untilDate" />
            </v-col>

            <!-- Input -->
            <v-col cols="12" xs="12" sm="6" md="4">
                <v-row class="pa-6">
                    <user-autocomplete v-model="users" :label="$t('audit.filterByUser')" solo clearable chips
                        class="elevation-0" />
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { DateInput, Dayjs } from "@dracul/dayjs-frontend"
import { UserAutocomplete } from '@dracul/user-frontend'
import { mapGetters } from 'vuex'

export default {
    name: 'DeployHistoryFilters',
    props: {
        filterLoading: {
            type: Boolean,
            default: false
        }
    },
    components: { DateInput, UserAutocomplete },
    data() {
        return {
            networkName: '',
            attachable: '',

            networkDriver: '',
            ipv4ipamsubnet: '',
            users: '',

            sinceDate: Dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
            untilDate: Dayjs().add(1, 'day').format('YYYY-MM-DD'),
        }
    },
    computed: {
        ...mapGetters([
            'me'
        ]),
        filters() {
            const filters = {
                sinceDate: this.sinceDate,
                untilDate: this.untilDate,

                networkName: this.networkName,
                attachable: this.attachable,

                networkDriver: this.networkDriver,
                ipv4ipamsubnet: this.ipv4ipamsubnet,
                users: this.users,
            }

            if (this.sinceDate) filters.sinceDate = this.sinceDate
            if (this.untilDate) filters.untilDate = this.untilDate

            return filters
        },
    },
    methods: {
        setFilters() {
            this.$emit('updateFilters', this.filters)
        },

        cleanFilters() {
            this.untilDate = ''
            this.sinceDate = ''

            this.networkName = ''
            this.ipv4ipamsubnet = ''

            this.attachable = null
            this.networkDriver = ''

            this.$emit('updateFilters', this.filters)
        },
        untilDates(val) {
            return (this.sinceDate) ? Dayjs().add(1, 'day').isAfter(val) && Dayjs(this.sinceDate).isBefore(val) : Dayjs().add(1, 'day').isAfter(val)
        },

        sinceDates(val) {
            const sinceDateMinusOneDay = Dayjs(this.sinceDate).subtract(1, 'day')
            return Dayjs(val).isAfter(sinceDateMinusOneDay)
        }
    }
}
</script>