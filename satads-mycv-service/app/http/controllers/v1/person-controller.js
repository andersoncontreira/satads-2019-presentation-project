const ApiResponse = require('./../../api-response')
const PersonService = require('../../../services/person-service')

let personService = new PersonService()
/**
 *
 */
class PersonController {

    /**
     *
     */
    static get(request, response) {

        let apiResponse = new ApiResponse(request, response)
        let uuid = request.params.uuid
        let promise = personService.get(uuid)
        promise.then((person) => {

            apiResponse.body = {
                result: true,
                message: 'Person found with success',
                data: person
            }

            apiResponse.json()

        }).catch((err) => {
            console.error(err)

            apiResponse.status(400)
            apiResponse.body = {
                result: false,
                message: personService.getErrorMessage()
            }
            apiResponse.json()
        })

    }

    /**
     *
     */
    static list(request, response) {

        let apiResponse = new ApiResponse(request, response)

        //TODO implementar RESTful filters etc
        let promise = personService.list()
        promise.then((resultList) => {
            apiResponse.body = {
                result: true,
                message: 'Person list success',
                data: resultList
            }

            apiResponse.json()
        }).catch((err) => {

            console.error(err)

            apiResponse.status(400)
            apiResponse.body = {
                result: false,
                message: personService.getErrorMessage()
            }
            apiResponse.json()
        })

    }

    /**
     *
     */
    static create(request, response) {

        let apiResponse = new ApiResponse(request, response)

        let person = personService.factoryPersonObject(request.body)

        if (personService.validate(person)) {

            let promise = personService.create(person)
            promise.then((res) => {
                // filter data
                // res.

                apiResponse.body = {
                    result: true,
                    message: 'Person registered with success',
                    data: res
                }
                apiResponse.status(201)
                apiResponse.json()

            }).catch((err) => {
                console.error(err)

                apiResponse.status(400)
                apiResponse.body = {
                    result: false,
                    message: personService.getErrorMessage()
                }
                apiResponse.json()
            })


        } else {

            apiResponse.status(400)
            apiResponse.body = {
                result: false,
                message: personService.getErrorMessage()
            }
            apiResponse.json()
        }


    }


}


module.exports = PersonController

