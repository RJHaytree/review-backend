const security = require('../utilities/security');
const utility = require('../utilities/utility');

module.exports = async (req, res, next) => {
    let token = req.header('Auth-Token');
    console.log('Token:' + token);

    try {
        if (!token) {
            throw new Error('Access Denied');
        }
    
        let verifiedToken = await security.verify(token);
    
        if (verifiedToken) {
            res.locals.id = verifiedToken._id;
            next();
        }
        else {
            throw new Error('Accessed Denied')
        }
    }
    catch (e) {
        utility.formatErrorResponse(res, 401, e.message);
    }
}