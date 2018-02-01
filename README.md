# alexa-skill-sdk-for-azure-function
Alexa skill sdk for Node.js for azure function.  It's a wrapper of [Alexa skills kit sdk for Node js][0] for [Azure Function][1]


## Installation

``` bash
  $ npm install alexa-skill-sdk-for-azure-function
```

## Usage
In index.js of azure function
``` js

    module.exports = function (context, req) {
        var alexa = require('alexa-skill-sdk-for-azure-function');
        alexa.setup({
            azureCtx: context,
            azureReq: req,
            handlers: null,
            trackInvokedIntents: true,
            enforceVerifier: false,
            i18nSettings: i18nSettings
        });
        
        alexa.execute(avsCallback(context, req));
    }

    var avsCallback = function (azureCtx, req) {
        return function (err, obj) {

            if (err) {
                azureCtx.res = {
                    status: 400,
                    body: err
                };
            } else {
                azureCtx.res = {
                    body: obj
                };
            }
            azureCtx.done();
        };
    };

```

Options to setup alexa sdk for azure function:
* __azureCtx:__  The context of azure function
* __azureReq:__  The request object of azure function (http trigger)
* __handlers:__  Array of [Handlers][2] for alexa skill
* __trackInvokedIntents__ If you want to track invoked intents, then this would be stored in session attributes as invokedIntents: string[] and lastIntent: string.  Default value: false
* __enforceVerifier__ If you want to enforce certificate verification for alexa, then pass the "true" boolean flag.  Default value: true
* __alexaAppId__ This would be app id of your alexa skill.  You can either pass this through this property or set the app settings of "ALEXA_APP_ID"
* __i18nSettings__ This is the setting for [i18next][3].  It should be an object of two properties 

```json
    {
        "interpolation": object,
        "languageStrings": object
    }
```
* __version__ Version of the application 
* __name__ Name of the application

[0]:https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs
[1]:https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node
[2]:https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs#implement-handler-functions 
[3]:https://www.i18next.com
