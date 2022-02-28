
import merge from 'deepmerge'
import RegistryMessages from './messages/RegistryMessages'
import ImageMessages from './messages/ImageMessages'

const messages = merge.all([
    RegistryMessages,
    ImageMessages
])

export default messages;
