'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountModel = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: false},
    acctype: {type: String, required: false},
    doctype: { type: String, required: false},
    docnumber: {type: String, required: false},
    msisdn: {type: String, required: true},
    email: {type: String, required: false},
    province: {type: String, required: false}
    },{timestamps: true});

accountModel.virtual('fullname').get(function() {
    return this.name + ' ' + this.surname;
});

accountModel.set('toObject', { getters: true });

module.exports = mongoose.model('Account', accountModel, 'accounts');