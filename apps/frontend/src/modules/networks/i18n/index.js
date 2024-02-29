import merge from 'deepmerge';
import NetworkMessages from './messages/NetworkMessages';
const messages = merge.all([
    NetworkMessages,
])

export default messages;
