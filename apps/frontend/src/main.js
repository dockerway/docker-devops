import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import i18n from './i18n'
import router from "./router"
import { AuditProvider } from '@dracul/audit-frontend'


import apolloClient from './apollo'
import {setGraphQlClientToProviders} from '@dracul/user-frontend'
import {customizationProvider} from '@dracul/customize-frontend'
import {notificationProvider} from '@dracul/notification-frontend'
import {SettingsProvider} from '@dracul/settings-frontend'
setGraphQlClientToProviders(apolloClient)
customizationProvider.setGqlc(apolloClient)
notificationProvider.setGqlc(apolloClient)
notificationProvider.setGqlcWs(apolloClient)
SettingsProvider.setGqlc(apolloClient)
AuditProvider.setGqlc(apolloClient)

Vue.config.productionTip = false

//Customization instances inject
store.commit('setVuetifyInstance', vuetify)

//1. Load from localstore
i18n.locale = store.state.customization.language
//2. Load from backend
store.dispatch('loadCustomizations')
    .then(r => {
      i18n.locale = r.language
    })


function loadSettings() {
    store.dispatch('loadSettings')
        .then(settings => {
            let mq = settings.find(s => s.key === 'MinimumQuantity')
            if (mq && mq.value) {
                store.commit('setMinimunQuantity', parseInt(mq.value))
            }
        })
        .catch(e => {
            console.error("Failed loading settings", e)
            setTimeout(loadSettings, 1000)
        })
}
  
loadSettings()

new Vue({
  vuetify,
  store,
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
