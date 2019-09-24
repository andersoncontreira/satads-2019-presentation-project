/**
 * Class Context
 *
 * Description
 *
 */
class Context {
  constructor () {

    this.callbackWaitsForEmptyEventLoop = true
    this.logGroupName = '/aws/lambda/name'
    this.logStreamName = '2018/07/05/[$LATEST]2a0e75e4c6844e94a436fac49f781cba'
    this.functionName = 'name'
    this.memoryLimitInMB = '128'
    this.functionVersion = '$LATEST'
    this.invokeid = 'c26693f4-80ad-11e8-a3ea-5581275c7475'
    this.awsRequestId = 'c26693f4-80ad-11e8-a3ea-5581275c7475'
    this.invokedFunctionArn = 'arn =aws =lambda =sa-east-1 =240167814999 =function =name-stage'

  }

  succeed() {

  }

  fail() {

  }
}

module.exports = Context