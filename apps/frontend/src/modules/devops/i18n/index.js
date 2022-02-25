import merge from 'deepmerge'
import PlatformMessages from './messages/PlatformMessages'
import ServiceMessages from './messages/ServiceMessages'
import StackMessages from './messages/StackMessages'
import EnvironmentMessages from './messages/EnvironmentMessages'
import EnvironmentServiceMessages from './messages/EnvironmentServiceMessages'

const messages = merge.all([
    PlatformMessages,
    ServiceMessages,
    StackMessages,
    EnvironmentMessages,
    EnvironmentServiceMessages
])

export default messages;
