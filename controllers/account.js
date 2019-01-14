var Account = require('../models/account');

const apiKey = ''; // NEXMO API Key
const apiSecret = ''; // NEXMO API Secret
const Nexmo = require('nexmo');

const SmsClient = new Nexmo({
    apiKey: apiKey,
    apiSecret: apiSecret,
});

exports.list = (req, h) => {
    return Account.find({}).exec().then((accounts) => {
        return { accounts: accounts };
    }).catch((err) => {
        return { err: err };
    });
};

exports.create = (req, h) => {
    const data = {
        name: req.payload.name,
        surname: req.payload.surname,
        doctype: req.payload.doctype,
        docnumber: req.payload.docnumber,
        msisdn: req.payload.msisdn,
        email: req.payload.email,
        province: req.payload.province,
        acctype: req.payload.acctype
    };

    return Account.create(data).then((account) => {
        SmsClient.message.sendSms(
            'NEXSMS',
            account.msisdn,
            'Os seus detalhes foram captados com sucesso - ' + account.name + '. MOZA.',
            (err, response) => {if (response) {console.log(response)}}
        );
        return {sucess: true, statusCode: 'OK', message: 'Account created.', account: account };
    }).catch((err) => {
        const response = h.response({success: false, statusCode: 'NOK', message: err}).code(400);
        return response;
        //return {success: false, statusCode: 'NOK', message: err};
    });
};

exports.get = (req, h) => {
    return Account.findById(req.params.id).exec().then((account) => {
        if (!account)
            return Promise.reject('Account not found.');
        return {sucess: true, statusCode: 'OK', account : account};
    }).catch((err) => {
        return {success: false, statusCode: 'NOK', message: err};
    });
};

exports.remove = (req, h) => {
    return Account.findByIdAndRemove(req.params.id).exec().then( (account) => {
        if (!account)
            return Promise.reject('Account not found.');
        return {sucess: true, statusCode: 'OK', account: account, message: 'Account deleted.'};
    }).catch((err) => {
        return {success: false, statusCode: 'NOK', message: err};
    });
};

exports.edit = (req, h) => {
    return Account.findByIdAndUpdate(req.params.id, req.payload, {new: true}).exec().then( (account) => {
            if (!account)
                return Promise.reject('Account not found.');
            SmsClient.message.sendSms(
                'NEXSMS',
                account.msisdn,
                account.fullname + ', os detalhes da sua conta MOZA foram atualizados. Para mais detalhes contacte a linha de cliente.',
                (err, response) => {if (response) {console.log(response)}}
            );
            return {sucess: true, statusCode: 'OK', account: account, message: 'Account updated.'};
        }).catch((err) => {
            return {success: false, statusCode: 'NOK', message: err};
        });
};