const uuidService = require('uuid')
const AWS = require('aws-sdk')
const storage = new AWS.DynamoDB({'region': process.env.REGION})
const slugify = require('slugify')
const md5 = require('md5')

const DbUtils = require('./../utils/db-utils')
const ObjectUtils = require('./../utils/object-utils')
const AuthValidator = require('./../validators/auth-validator')
const EmailValidator = require('./../validators/email-validator')

let authValidator = new AuthValidator()
let attributes = require('../schemas/auth')
const salt = 'auth-service-'

class AuthPayload {
  constructor (data) {
    this.uuid = (data.hasOwnProperty('uuid')) ? data.uuid : ''
    this.password = (data.hasOwnProperty('password')) ? data.password : ''
    this.firstName = (data.hasOwnProperty('firstName')) ? data.firstName : ''
    this.lastName = (data.hasOwnProperty('lastName')) ? data.lastName : ''
    this.email = (data.hasOwnProperty('email')) ? data.email : ''
    this.gid = (data.hasOwnProperty('gid')) ? data.gid : ''
    this.imageUrl = (data.hasOwnProperty('imageUrl')) ? data.imageUrl : ''
    this.deleted = (data.hasOwnProperty('deleted')) ? data.deleted : ''
    this.active = (data.hasOwnProperty('active')) ? data.active : ''
    this.createdAt = (data.hasOwnProperty('createdAt')) ? data.createdAt : null
    this.updatedAt = (data.hasOwnProperty('updatedAt')) ? data.updatedAt : null
    this.deletedAt = (data.hasOwnProperty('deletedAt')) ? data.deletedAt : null
  }
}

/**
 *
 * @param result
 */
const factoryObjectFromDb = function (result) {
  let list = []
  if (result.hasOwnProperty('Items')) {
    if (Array.isArray(result.Items)) {
      if (result.Items.length !== 0) {
        result.Items.forEach((item) => {
          list.push(new AuthPayload(DbUtils.filter(item)))
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

function generateHash (password) {
  return md5(salt + password)
}

class AuthService {
  constructor () {
    this.tableName = process.env.DYNAMODB_TABLE
    this.errorMessage = ''
  }

  getErrorMessage () {
    return this.errorMessage
  }

  factoryAuthPayloadObject (body) {
    return new AuthPayload(body)
  }

    /**
     *
     * @param {AuthPayload} authPayload
     */
  validate (authPayload) {
    let result = authValidator.validate(authPayload)
    this.errorMessage = authValidator.errorMessage
    return result
  }

  validateEmail (authPayload) {
    let emailValidator = new EmailValidator()
    let result = emailValidator.validate(authPayload.email)
    this.errorMessage = emailValidator.errorMessage
    return result
  }

    /**
     *
     * @param {AuthPayload} authPayload
     */
  signUp (authPayload) {
    authPayload.uuid = uuidService.v1()
    authPayload.active = 1
    authPayload.deleted = 0
    authPayload.createdAt = new Date().toISOString()
    authPayload.updatedAt = null
    authPayload.deletedAt = null

    let self = this

    return new Promise(function (resolve, reject) {
      if (self.validate(authPayload)) {
        let getPromise = self.search('email', 'S', authPayload.email)

        getPromise.then(function (response) {
          // If not exists
          if (ObjectUtils.isEmpty(response)) {
            attributes.uuid.S = authPayload.uuid
            attributes.firstName.S = authPayload.firstName
            attributes.lastName.S = authPayload.lastName
            attributes.password.S = generateHash(authPayload.password)
            attributes.email.S = authPayload.email
            attributes.createdAt.S = authPayload.createdAt

            attributes = DbUtils.removeNullAndEmptyValues(attributes)

            let params = {
              TableName: self.tableName,
              Item: attributes
            }

            console.log('Item to be created', params)

            storage.putItem(params, (error) => {
              if (error) {
                console.error(error.message)
                reject(error)
              } else {
                console.error('Success')
                resolve(authPayload)
              }
            })
          } else {
            self.errorMessage = `The email (${authPayload.email}) already registered`
            reject(new Error(self.errorMessage))
          }
        }).catch(function (error) {
          console.error(error.message)
          self.errorMessage = 'Unable to register the login'
          reject(new Error(self.errorMessage))
        })
      } else {
        self.errorMessage = 'Unable to register the login'
        reject(new Error(self.errorMessage))
      }
    })
  }

  update () {

  }

  signIn (authPayload) {
    let signInData = null
    let self = this

    return new Promise(function (resolve, reject) {
      let params = {
        TableName: self.tableName,
        FilterExpression: '#email = :email and #password = :password',
        ExpressionAttributeNames: {
          '#email': 'email',
          '#password': 'password'
        },
        ExpressionAttributeValues: {
          ':email': {S: authPayload.email},
          ':password': {S: generateHash(authPayload.password)}
        }
      }

      storage.scan(params, (error, result) => {
        if (error) {
          console.error(error.message)
          self.errorMessage = 'Unable to signIn'
          reject(new Error(self.errorMessage))
        } else {
          console.log('Success')
          let list = factoryObjectFromDb(result)
          if (list.length > 0) {
            signInData = list[0]
          } else {
            self.errorMessage = `Unable to signIn`
            let err = new Error(self.errorMessage)
            console.error(err.message)
          }

          resolve(signInData)
        }
      })
    })
  }

  recover (authPayload) {
    let recoverData = null
    let self = null
    return new Promise(function (resolve, reject) {
      let getPromise = self.search('email', 'S', authPayload.email)
      getPromise.then(function (response) {
        // If not exists
        if (!ObjectUtils.isEmpty(response)) {

        } else {
          self.errorMessage = `The email (${authPayload.email}) already registered`
          reject(new Error(self.errorMessage))
        }
      }).catch(function (error) {

      })
    })
  }

  search (key, type, value) {
    let authPayload = null
    let self = this

    return new Promise(function (resolve, reject) {
      let params = {
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
          let list = factoryObjectFromDb(result)
          if (list.length > 0) {
            authPayload = list[0]
          } else {
            self.errorMessage = `Register not found for this ${key} and ${value}`
            let err = new Error(self.errorMessage)
            console.error(err.message)
          }

          resolve(authPayload)
        }
      })
    })
  }
}

module.exports = AuthService
