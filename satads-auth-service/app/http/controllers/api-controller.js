const ApiResponse = require('./../api-response')

if (typeof (process.env.VERSION) === 'undefined') {
  process.env.VERSION = '0.0.1'
}

/**
 *
 */
class ApiController {
  /**
     *
     */
  static index (request, response) {
    const apiResponse = new ApiResponse(request, response)

    apiResponse.body = {
      ApiVersion: process.env.VERSION
    }

    apiResponse.json()
  }

  /**
     *
     */
  static ping (request, response) {
    const apiResponse = new ApiResponse(request, response)

    apiResponse.body = 'PONG'

    apiResponse.json()
  }

  /**
     *
     */
  static html (request, response) {
    const apiResponse = new ApiResponse(request, response)

    apiResponse.body = '<html><head><title>test</title></head><body>test</body></html>'

    apiResponse.html()
  }
}

module.exports = ApiController
