var Promise = require('promise');
var Mailchimp = require('mailchimp-api-v3');

var mailchimp = new Mailchimp(process.env.MAILCHIMP_API);

module.exports = {
    list: {
        subscribe: function (email, firstname, lastname) {
            return new Promise(function (resolve, reject) {
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
                                LNAME: lastname
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
            })
        }
    }
};