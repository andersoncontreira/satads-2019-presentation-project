const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,3})?$/

class EmailValidator {
  constructor () {
    this.error = false
    this.errorMessage = null
  }

  validate (email) {
    let result = true
    if (!emailRegex.exec(email)) {
      this.error = true
      this.errorMessage = 'Invalid email address'
      result = false
    }

    return result
  }
}

module.exports = EmailValidator
