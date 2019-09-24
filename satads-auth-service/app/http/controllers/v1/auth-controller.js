const ApiResponse = require('./../../api-response')
const AuthService = require('./../../../services/auth-service')

const authService = new AuthService()

class AuthController {
  /**
   * SignIn method
   * @param request
   * @param response
   */
  static signIn (request, response) {
    const apiResponse = new ApiResponse(request, response)
    const authPayload = authService.factoryAuthPayloadObject(request.body)
    if (authService.validate(authPayload)) {
      const signIn = authService.signIn(authPayload)
      signIn.then((result) => {
        // filter result
        result.password = null
        apiResponse.body = {
          result: true,
          message: 'SignIn success',
          data: result
        }

        apiResponse.json()
      }).catch((err) => {
        console.error(err)
        apiResponse.status(400)
        apiResponse.body = {
          result: false,
          message: authService.getErrorMessage()
        }
        apiResponse.json()
      })
    } else {
      apiResponse.status(400)
      apiResponse.body = {
        result: false,
        message: authService.getErrorMessage()
      }
      apiResponse.json()
    }
  }

  /**
   *
   */
  static signUp (request, response) {
    const apiResponse = new ApiResponse(request, response)

    const authPayload = authService.factoryAuthPayloadObject(request.body)

    if (authService.validate(authPayload)) {
      const creation = authService.signUp(authPayload)
      creation.then((result) => {
        // filter data
        result.password = null

        apiResponse.body = {
          result: true,
          message: 'SignUp with success',
          data: result
        }
        apiResponse.status(201)
        apiResponse.json()
      }).catch((err) => {
        console.error(err)

        apiResponse.body = {
          result: false,
          message: authService.getErrorMessage()
        }
        apiResponse.json()
      })
    } else {
      apiResponse.status(400)
      apiResponse.body = {
        result: false,
        message: authService.getErrorMessage()
      }
      apiResponse.json()
    }
  }

  /**
   *
   */
  static recover (request, response) {
    const apiResponse = new ApiResponse(request, response)
    const authPayload = authService.factoryAuthPayloadObject(request.body)
    if (authService.validateEmail(authPayload)) {
      const recover = authService.recover(authPayload)
      recover.then((result) => {
        // filter result
        result.password = null
        apiResponse.body = {
          result: true,
          message: 'Recover success',
          data: result
        }

        apiResponse.json()
      }).catch((err) => {
        console.error(err)
        apiResponse.status(400)
        apiResponse.body = {
          result: false,
          message: authService.getErrorMessage()
        }
        apiResponse.json()
      })
    } else {
      apiResponse.status(400)
      apiResponse.body = {
        result: false,
        message: authService.getErrorMessage()
      }
      apiResponse.json()
    }
  }

  static recoverCallback (request, response) {
    const apiResponse = new ApiResponse(request, response)

    apiResponse.status(400)
    apiResponse.body = {
      result: false,
      message: 'not implemented'
    }

    apiResponse.json()
  }
}

module.exports = AuthController
