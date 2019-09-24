const app = require('./app/app')

module.exports.handler = function (event, context, callback) {
  const customCallback = function (error, response) {
    console.log('custom callback')

    if (error) {
      context.fail(error)
    } else {
      context.succeed(response)
    }

    callback(error, response)
  }
  app.execute(event, context, customCallback)
}
