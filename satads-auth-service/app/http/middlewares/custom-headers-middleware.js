// custom-headers-middleware

if (typeof (process.env.VERSION) === 'undefined') {
  process.env.VERSION = '1.0.0'
}

if (typeof (process.env.ARCH_VERSION) === 'undefined') {
  process.env.ARCH_VERSION = 'v1'
}

class CustomHeadersMiddleware {
  static apply (request, response, next) {
    console.log('CustomHeadersMiddleware.apply ... ')

    // cors headers
 		response.setHeader('Custom-Service-Version', process.env.VERSION)
 		response.setHeader('Custom-Service-Arch-Version', process.env.ARCH_VERSION)

    // something to do here

    // next middleware
    next()
  }
}

module.exports = CustomHeadersMiddleware
