const PersonController = require('./../../controllers/v1/person-controller')

module.exports = {
  map: (router) => {
    const version = 'v1'
    const versionPath = '/' + version

    router.get(process.env.ROOT_PATH + versionPath + '/person/:uuid', (request, response) => PersonController.get(request, response))
    router.get(process.env.ROOT_PATH + versionPath + '/person', (request, response) => PersonController.list(request, response))
    router.post(process.env.ROOT_PATH + versionPath + '/person', (request, response) => PersonController.create(request, response))

    return router
  }
}
