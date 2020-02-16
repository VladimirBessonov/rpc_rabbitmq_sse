let server = require('./mq/serverRPC')
let setting = require('./settings')
const queue = 'webmessages';

let channel;

    server.createConnection(setting, queue).then(ch => {
        channel = ch
        return ch
    }).then( channel => {

        server.consumeRpcMessage(channel, queue)
        }
    )



