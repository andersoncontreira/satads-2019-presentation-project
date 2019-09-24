const app = require('./app/app')
const Context = require('./helpers/aws/mocks/context')
const Event = require('./helpers/aws/mocks/event')

const isInLambda = !!process.env.LAMBDA_TASK_ROOT
if (!isInLambda) {
  // eslint-disable-next-line handle-callback-err
  const callback = function (error, response) {
    console.log('call callback')
    response.end()
  }

  app.execute(Event, Context, callback)
}
