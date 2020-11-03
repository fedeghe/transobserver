const users = require('./users.json')
const checkCredentials = ({
    req, res, verb, ep, delay
}) => {
    res.send(202, users);
}

module.exports = {
    checkCredentials
}

