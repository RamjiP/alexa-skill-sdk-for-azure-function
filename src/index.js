var event = require('./event');
var context = require('./context');
var verifier = require('./verifier');

var avsWrapper = {
    options: {
        azureCtx: null,
        azureReq: null,
        handlers: null,
        trackInvokedIntents: false,
        enforceVerifier: true,
        alexaAppId: process.env.ALEXA_APP_ID,
        i18nSettings: i18nSettings,
        version: '1.0.0',
        name: 'alexa-azure-function'
    },
    setup: function(opts){

        for (var k in this.options) {
            if (opts[k]) {
                this.options[k] = opts[k];
            }
        }
        this.e = event(this.options.azureReq);
        this.c = context(this.options.azureCtx, this.options.version, this.options.name);
        this.r = azureReq;
        this.handlers = this.options.handlers;
    },

    lambdaStyleHandler: function(event, ctx, callback) {
        var Alexa = require('alexa-sdk');

        var alexa = Alexa.handler(event, ctx, callback);
        alexa.i18n.init({
            interpolation: this.options.i18nSettings.interpolation
        });
        alexa.appId = this.options.alexaAppId;
        alexa.resources = this.options.i18nSettings.languageStrings;
        this.handlers.push({':responseReady' : responseReady(this)});
        alexa.registerHandlers.apply(null, this.handlers);
        alexa.execute();
    },

    execute: function(callback){
        var current = this;
        verifier.verify(current.r, options.verifier, function(err) {
            if (err) {
                callback(err);
                return;
            }
            
            current.lambdaStyleHandler(current.e, current.c, callback);
        });
    }
};

var responseReady = function (wrapper) {

    return function () {
        var res = this.handler.response;
        var req = wrapper.r.body.request;

        if (wrapper.options.trackInvokedIntents) {
            if (req.intent) {
                res.sessionAttributes.lastIntent = req.intent;

                if (!res.sessionAttributes.invokedIntents) {
                    res.sessionAttributes.invokedIntents = [];
                }

                if (res.sessionAttributes.invokedIntents.indexOf(req.intent.name) === -1) {
                    res.sessionAttributes.invokedIntents.push(req.intent.name);
                }
            }

            res.sessionAttributes.lastResponse = res.response;
        }

        // DONOT EDIT THIS............ IT IS A COPY OF THE UNDERLYING LIBRARY alexa-sdk
        if(this.handler.state) {
            this.handler.response.sessionAttributes.STATE = this.handler.state;
        }

        if (this.handler.dynamoDBTableName) {
            return this.emit(':saveState');
        }

        if(typeof this.callback === 'undefined') {
            this.context.succeed(this.handler.response);
        } else {
            this.callback(null, this.handler.response);
        }
    };

};

module.exports = avsWrapper;
