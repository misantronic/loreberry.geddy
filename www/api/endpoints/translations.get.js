const api = require('../api');
const getTranslations = require('../../wp/getTranslations');

module.exports = function (req, res) {
    const postId = req.query.post_id;

    if (!postId) {
        return api.write(res, { error: 'Missing parameter "post_id"' }, 500);
    }

    getTranslations(postId)
        .then(data => api.write(res, data, 200))
        .catch(err => api.write(res, err, 500));
};