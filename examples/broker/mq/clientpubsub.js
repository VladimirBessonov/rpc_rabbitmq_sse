'use strict';
const amqp = require('amqplib');
// const queue = 'webmessages';


const createClient = (setting, exchange) => amqp.connect(setting.url)
    .then(conn => conn.createChannel()) // create channel
    .then(channel => {

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        return channel;
    });


const publishMessage = (channel, exchange, msg) => new Promise(resolve => {

    channel.publish(exchange, '', Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
});


module.exports.createClient = createClient;
module.exports.publishMessage = publishMessage;