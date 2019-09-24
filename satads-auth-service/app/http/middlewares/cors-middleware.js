// cors-middleware
class CorsMiddleware {
  static filter (request, response, next) {
    console.log('CorsMiddleware.filter ... ')
    // cors headers
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Credentials', 'true')
    response.setHeader('Access-Control-Allow-Headers', '*')
    // next middleware
    next()
  }
}

module.exports = CorsMiddleware
