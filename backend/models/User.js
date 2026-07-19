const bcrypt = require('bcryptjs');
const models = require('../config/modelCompatibility');

module.exports = models.users;
module.exports.hashPassword = (pw) => bcrypt.hashSync(pw, 10);
module.exports.comparePassword = async (candidate, hash) => bcrypt.compare(candidate, hash);
