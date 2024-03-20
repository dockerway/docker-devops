import Vue from "vue";
import VueI18n from 'vue-i18n'
import merge from 'deepmerge'

import baseMessages from '../modules/base/i18n/messages'
import devopsMessages from '../modules/devops/i18n'
import registryMessages from '../modules/registry/i18n'
import nodesMessages from '../modules/nodes/i18n'
import networkMessages from '../modules/networks/i18n'
import menuMessages from '../menu-config/menu-i18n'
import {i18nMessages as i18nMessagesCommon} from '@dracul/common-frontend'
import {i18nMessages as i18nMessagesUser} from '@dracul/user-frontend'
import {i18nMessages as i18nMessagesCustom} from '@dracul/customize-frontend'
import {i18nMessages as i18nMessagesNotification} from '@dracul/notification-frontend'
import {i18nMessages as i18nMessagesSettings} from '@dracul/settings-frontend'
import {i18nMessages as i18nMessagesAudit} from '@dracul/audit-frontend'

const messages = merge.all([
    baseMessages,
    menuMessages,
    i18nMessagesCommon,
    i18nMessagesUser,
    i18nMessagesCustom,
    i18nMessagesNotification,
    i18nMessagesSettings,
    devopsMessages,
    registryMessages,
    i18nMessagesAudit,
    nodesMessages,
    networkMessages,
])

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: 'en',
    messages,
})

export default i18n
