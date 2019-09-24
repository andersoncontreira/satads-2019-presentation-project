const EmailValidator = require('./email-validator')
const ObjectUtils = require('./../utils/object-utils')

const emailValidator = new EmailValidator()

class AuthValidator {
  constructor () {
    this.error = false
    this.errorMessage = null
  }

  validate (authPayload) {
    let result = true

    if (ObjectUtils.isEmpty(authPayload)) {
      result = false
      this.errorMessage = 'Object empty'
    }

    if (result && !emailValidator.validate(authPayload.email)) {
      result = false
      this.error = true
      this.errorMessage = emailValidator.errorMessage
    }

    if (result && ObjectUtils.stringIsEmpty(authPayload.password)) {
      result = false
      this.errorMessage = 'password empty'
    }

    this.error = result

    return result
  }
}

module.exports = AuthValidator
