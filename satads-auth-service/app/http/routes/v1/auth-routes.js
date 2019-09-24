const AuthController = require('../../controllers/v1/auth-controller')

module.exports = {
  map: (router) => {
    const version = 'v1'
    const versionPath = '/' + version

    router.post(process.env.ROOT_PATH + versionPath + '/signin', (request, response) => AuthController.signIn(request, response))
    router.post(process.env.ROOT_PATH + versionPath + '/signup', (request, response) => AuthController.signUp(request, response))
    router.post(process.env.ROOT_PATH + versionPath + '/recover', (request, response) => AuthController.recover(request, response))
    router.post(process.env.ROOT_PATH + versionPath + '/recover/callback', (request, response) => AuthController.recoverCallback(request, response))

    return router
  }
}
