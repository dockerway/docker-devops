import merge from 'deepmerge';
import PlatformMessages from './messages/PlatformMessages';
import ServiceTemplateMessages from './messages/ServiceTemplateMessages';
import StackMessages from './messages/StackMessages';
import EnvironmentMessages from './messages/EnvironmentMessages';
import ServiceMessages from './messages/ServiceMessages';
import PermissionMessages from './messages/PermissionsMessages';

const messages = merge.all([
    PlatformMessages,
    ServiceTemplateMessages,
    StackMessages,
    EnvironmentMessages,
    ServiceMessages,
    PermissionMessages,
])

export default messages;
