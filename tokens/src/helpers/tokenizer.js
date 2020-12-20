const jwt = require('jsonwebtoken');
const { config: { ACCESS_KEY, REFRESH_KEY } } = require('../configs');

module.exports = () => {
    const access_token = jwt.sign({}, ACCESS_KEY, { expiresIn: '15m' });
    const refresh_token = jwt.sign({}, REFRESH_KEY, { expiresIn: '30d' });

    return {
        access_token,
        refresh_token
    };
};
