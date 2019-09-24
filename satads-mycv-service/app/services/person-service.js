const uuidService = require('uuid')
const AWS = require('aws-sdk')
const storage = new AWS.DynamoDB({ region: process.env.REGION })

const DbUtils = require('./../utils/db-utils')
const ObjectUtils = require('./../utils/object-utils')
const PersonValidator = require('./../validators/person-validator')

const personValidator = new PersonValidator()
let attributes = require('./../schemas/person')

class Person {
  /**
     * @param {Object} data
     */
  constructor (data) {
    this.uuid = (data.hasOwnProperty('uuid')) ? data.uuid : ''
    this.firstName = (data.hasOwnProperty('firstName')) ? data.firstName : ''
    this.lastName = (data.hasOwnProperty('lastName')) ? data.lastName : ''
    this.email = (data.hasOwnProperty('email')) ? data.email : ''
    this.photo = (data.hasOwnProperty('photo')) ? data.photo : ''
    this.deleted = (data.hasOwnProperty('deleted')) ? data.deleted : ''
    this.active = (data.hasOwnProperty('active')) ? data.active : ''
    this.createdAt = (data.hasOwnProperty('createdAt')) ? data.createdAt : null
    this.updatedAt = (data.hasOwnProperty('updatedAt')) ? data.updatedAt : null
    this.deletedAt = (data.hasOwnProperty('deletedAt')) ? data.deletedAt : null
  }

  getFullName () {
    return this.firstName + ' ' + this.lastName
  }
}

/**
 *
 * @param result
 */
const factoryObjectFromDb = function (result) {
  const list = []
  if (result.hasOwnProperty('Items')) {
    if (Array.isArray(result.Items)) {
      if (result.Items.length !== 0) {
        result.Items.forEach((item) => {
          list.push(new Person(DbUtils.filter(item)))
        })
      } else {
        console.log('Items not found')
      }
    } else {
      console.error('Some error occurs')
    }
  } else {
    if (result.hasOwnProperty('Item')) {
      list.push(DbUtils.filter(result.Item))
    } else {
      console.log('Item not found')
    }
  }

  return list
}

class PersonService {
  constructor () {
    this.tableName = process.env.PERSON_DYNAMODB_TABLE
    this.errorMessage = ''
  }

  getErrorMessage () {
    return this.errorMessage
  }

  factoryPersonObject (body) {
    return new Person(body)
  }

  /**
     *
     * @param person
     * @returns {boolean}
     */
  validate (person) {
    const result = personValidator.validate(person)
    this.errorMessage = personValidator.errorMessage
    return result
  }

  /**
     *
     * @param {Person} person
     */
  create (person) {
    person.uuid = uuidService.v1()
    person.active = 1
    person.deleted = 0
    person.createdAt = new Date().toISOString()
    person.updatedAt = null
    person.deletedAt = null

    const self = this

    return new Promise(function (resolve, reject) {
      if (self.validate(person)) {
        const getPromise = self.search('email', 'S', person.email)

        getPromise.then(function (response) {
          // If not exists
          if (ObjectUtils.isEmpty(response)) {
            attributes.uuid.S = person.uuid
            attributes.firstName.S = person.firstName
            attributes.lastName.S = person.lastName
            attributes.email.S = person.email
            attributes.createdAt.S = person.createdAt

            attributes = DbUtils.removeNullAndEmptyValues(attributes)

            const params = {
              TableName: self.tableName,
              Item: attributes
            }

            console.log('Item to be created', params)

            storage.putItem(params, (error) => {
              if (error) {
                console.error(error.message)

                self.errorMessage = 'Unable to create the register'
                reject(new Error(self.errorMessage))
              } else {
                console.error('Success')
                resolve(person)
              }
            })
          } else {
            self.errorMessage = `Person (${person.getFullName()}) already registered`
            reject(new Error(self.errorMessage))
          }
        }).catch(function (error) {
          console.error(error.message)
          self.errorMessage = 'Unable to verify with the register is already registered'
          reject(new Error(self.errorMessage))
        })
      } else {
        self.errorMessage = 'Unable to register the person'
        reject(new Error(self.errorMessage))
      }
    })
  }

  update () {

  }

  /**
     *
     * @param uuid
     * @returns {Promise<Person>}
     */
  get (uuid) {
    let person = null
    const self = this

    return new Promise(function (resolve, reject) {
      const params = {
        TableName: self.tableName,
        Key: {
          uuid: { S: uuid }
        }
      }

      storage.getItem(params, (error, result) => {
        if (error) {
          console.error(error.message)
          self.errorMessage = 'Unable to find the register'
          reject(new Error(self.errorMessage))
        } else {
          console.log('Success')
          const list = factoryObjectFromDb(result)
          if (list.length > 0) {
            person = list[0]
            resolve(person)
          } else {
            self.errorMessage = `Person not found for this uuid ${uuid}`
            const err = new Error(self.errorMessage)
            console.error(err.message)
            reject(err)
          }
        }
      })
    })
  }

  search (key, type, value) {
    let person = null
    const self = this

    return new Promise(function (resolve, reject) {
      const params = {
        TableName: self.tableName,
        FilterExpression: '#key = :value',
        ExpressionAttributeNames: {
          '#key': key
        },
        ExpressionAttributeValues: {
          ':value': {}
        }
      }

      params.ExpressionAttributeValues[':value'][type] = value

      storage.scan(params, (error, result) => {
        if (error) {
          console.error(error.message)
          self.errorMessage = 'Unable to find the register'
          reject(new Error(self.errorMessage))
        } else {
          console.log('Success')
          const list = factoryObjectFromDb(result)
          if (list.length > 0) {
            person = list[0]
          } else {
            self.errorMessage = `Register not found for this ${key} and ${value}`
            const err = new Error(self.errorMessage)
            console.error(err.message)
          }

          resolve(person)
        }
      })
    })
  }

  list (filters) {
    const self = this

    const params = {
      TableName: self.tableName
    }

    return new Promise(function (resolve, reject) {
      storage.scan(params, (error, result) => {
        if (error) {
          console.error(error.message)
          self.errorMessage = 'Unable to list the registers'
          reject(new Error(self.errorMessage))
        } else {
          console.log('Success')
          const list = factoryObjectFromDb(result)
          resolve(list)
        }
      })
    })
  }
}

module.exports = PersonService
