import merge from 'deepmerge';
import PlatformMessages from './messages/PlatformMessages';
import ServiceTemplateMessages from './messages/ServiceTemplateMessages';
import StackMessages from './messages/StackMessages';
import EnvironmentMessages from './messages/EnvironmentMessages';
import ServiceMessages from './messages/ServiceMessages';
import PermissionMessages from './messages/PermissionsMessages';
import DiscoveryMessages from './messages/DiscoveryMessages.js';
import DeployHistoryMessages from './messages/DeployHistoryMessages.js'
const messages = merge.all([
    PlatformMessages,
    ServiceTemplateMessages,
    StackMessages,
    EnvironmentMessages,
    ServiceMessages,
    PermissionMessages,
    DiscoveryMessages,
    DeployHistoryMessages,
])

export default messages;
