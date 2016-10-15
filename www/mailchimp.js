const Promise = require('promise');
const Mailchimp = require('mailchimp-api-v3');
const setToken = require('./db/methods/setToken');

var mailchimp = new Mailchimp(process.env.MAILCHIMP_API);

module.exports = {
    list: {
        subscribe: function (email, firstname, lastname) {
            return new Promise(function (resolve, reject) {
                setToken().then(function (token) {
                    mailchimp.post({
                        path: '/lists/' + process.env.MAILCHIMP_LIST
                    }, {
                        update_existing: true,
                        members: [
                            {
                                email_address: email,
                                status: 'pending',
                                merge_fields: {
                                    FNAME: firstname,
                                    LNAME: lastname,
                                    TOKEN: token
                                }
                            }
                        ]
                    }, function (err, result) {
                        if (err) {
                            return reject(err)
                        }

                        if (result.error_count === 0) {
                            resolve(result);
                        }
                    })
                });
            })
        }
    }
};