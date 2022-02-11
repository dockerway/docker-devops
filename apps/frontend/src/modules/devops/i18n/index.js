import merge from 'deepmerge'
import PlatformMessages from './messages/PlatformMessages'
import ServiceMessages from './messages/ServiceMessages'
import EnvironmentMessages from './messages/EnvironmentMessages'
import EnvironmentServiceMessages from './messages/EnvironmentServiceMessages'

const messages = merge.all([
    PlatformMessages,
    ServiceMessages,
    EnvironmentMessages,
    EnvironmentServiceMessages
])

export default messages;
