const api = require('../api');
const mailchimp = require('../../mailchimp');
const getPrice = require('../../db/methods/getPrice');
const setPrice = require('../../db/methods/setPrice');

module.exports = function (req, res) {
    const body = req.body;

    if (!body) {
        return api.write(res, { error: 'Missing payload' }, 500);
    }

    console.log('POST /api/subscribe', body);

    const email = body.email;
    const firstname = body.firstname || '';
    const lastname = body.lastname || '';

    mailchimp.list.subscribe(email, firstname, lastname)
        .then(result => {
            // Only succeed when there are new members in the list...
            if (result.new_members.length === 0) {
                return api.write(res, { error: 'You are already registered.' }, 500);
            }

            api.write(res, { success: true }, 200);
        })
        .catch(err => api.write(res, err, 500));
};