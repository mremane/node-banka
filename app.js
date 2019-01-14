'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const AccountController = require('./controllers/account');
const MongoDBUrl = '' // MongoDB URL

const server = new Hapi.Server({
    port: 3000,
    routes: {cors: true}
});

server.route({
    method: 'GET',
    path: '/accounts',
    handler: AccountController.list
});

server.route({
    method: 'GET',
    path: '/accounts/{id}',
    handler: AccountController.get
});

server.route({
    method: 'POST',
    path: '/accounts',
    handler: AccountController.create
});

server.route({
    method: 'DELETE',
    path: '/accounts/{id}',
    handler: AccountController.remove
});

server.route({
    method: 'PUT',
    path: '/accounts/{id}',
    handler: AccountController.edit
});

// async function start ()
const start = async () => {
    // start your server
    try {
        await server.start();
        mongoose.connect(MongoDBUrl).then(res => console.log('Connected to Mongo DB'), err => console.log(err.errmsg));
    } catch (err) {
        console.error(err);
        process.exit(1);
    };
    console.log('Server running at: ', server.info.uri);
}

start();