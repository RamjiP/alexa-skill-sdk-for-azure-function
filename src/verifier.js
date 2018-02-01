var verifier = {
    verify: function (req, enforceVerifier, callback) {
        var environment = process.env.APPSETTING_NODE_ENV || process.env.NODE_ENV;
        if (environment === 'development' || !enforceVerifier) {
            callback();
            return;
        }

        var alexaVerifier = require('alexa-verifier');
        alexaVerifier(req.headers.signaturecertchainurl,
            req.headers.signature,
            req.rawBody,
            callback   
        );
    }
};

module.exports = verifier;
