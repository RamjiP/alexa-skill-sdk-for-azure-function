// Ref: http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html

var MAX_EXECUTION_TIME = 5000; // 5 seconds in ms
var context = function(azureCtx, version, name) {
    return {
        started: new Date(),
        getRemainingTimeInMillis: function() {
            return MAX_EXECUTION_TIME - (new Date()).getTime().diff(this.started.getTime());
        },
        callbackWaitsForEmptyEventLoop: true,
        functionName: azureCtx.executionContext.functionName,
        functionVersion: version,
        invokedFunctionArn: version,
        memoryLimitInMB: 50,
        awsRequestId: azureCtx.executionContext.invocationId,
        logGroupName: name,
        logStreamName: name,
        identity: null,
        clientContext: null
    };
};

module.exports = context;
