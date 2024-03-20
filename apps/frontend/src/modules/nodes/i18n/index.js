import merge from 'deepmerge';
import NodesMessages from './messages/NodesMessages';
const messages = merge.all([
    NodesMessages,
])

export default messages;
