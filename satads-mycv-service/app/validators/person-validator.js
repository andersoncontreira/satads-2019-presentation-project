const EmailValidator = require('./email-validator')
const ObjectUtils = require("./../utils/object-utils")

let emailValidator = new EmailValidator()

class PersonValidator {

  constructor() {
    this.error = false;
    this.errorMessage = null;
  }

  validate(person) {
    let result = true

    if (ObjectUtils.isEmpty(person)) {
      result = false
      this.errorMessage = "Object empty"
    }

    if (result && !emailValidator.validate(person.email)) {
      result = false
      this.error = true;
      this.errorMessage = emailValidator.errorMessage
    }

    if (result && ObjectUtils.stringIsEmpty(person.firstName)) {
      result = false
      this.errorMessage = "firstName empty"
    }

    if (result && ObjectUtils.stringIsEmpty(person.lastName)) {
      result = false
      this.errorMessage = "lastName empty"
    }

    this.error = result

    return result
  }

}

module.exports = PersonValidator