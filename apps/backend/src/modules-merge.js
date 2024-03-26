import {mergeTypes, mergeResolvers} from 'merge-graphql-schemas';
import {securityResolvers,securityTypes} from '@dracul/user-backend'

import {commonTypes, commonResolvers} from '@dracul/common-backend'
import {types as customTypes,resolvers as customResolvers} from '@dracul/customize-backend'
import {types as notificationTypes,resolvers as notificationResolvers} from '@dracul/notification-backend'
import {types as settingsTypes,resolvers as settingsResolvers} from '@dracul/settings-backend'
import {types as auditTypes, resolvers as auditResolvers} from '@dracul/audit-backend'

//BASE RESOLVERS
import {resolvers as baseResolvers } from './modules/base/graphql'
import {resolvers as devopsResolvers } from './modules/devops/graphql'
import {resolvers as registryResolvers } from './modules/registry/graphql'
import {resolvers as nodesResolvers} from './modules/nodes/graphql'
import {resolvers as networksResolvers} from './modules/networks/graphql'

//BASE TYPEDEFS
import {types as baseTypes} from './modules/base/graphql'
import {types as devopsTypes} from './modules/devops/graphql'
import {types as registryTypes} from './modules/registry/graphql'
import {types as nodesTypes} from './modules/nodes/graphql'
import {types as networksTypes} from './modules/networks/graphql'


export const resolvers = mergeResolvers([
    commonResolvers,
    baseResolvers,
    securityResolvers,
    notificationResolvers,
    customResolvers,
    settingsResolvers,
    devopsResolvers,
    registryResolvers,
    auditResolvers,
    nodesResolvers,
    networksResolvers,
])

export const typeDefs = mergeTypes([
    commonTypes,
    baseTypes,
    securityTypes,
    notificationTypes,
    customTypes,
    settingsTypes,
    devopsTypes,
    registryTypes,
    auditTypes,
    nodesTypes,
    networksTypes,
])
