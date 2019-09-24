(function () {
    var config = {
        apiUrl: (window.location.host.match(/localhost/))?'http://localhost:2000/satads':'https://services.hagatus.com.br/satads'
        //apiUrl: (window.location.host.match(/localhost/)) ? 'https://services.hagatus.com.br/satads' : 'https://services.hagatus.com.br/satads'
    }

    var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,3})?$/

    var loginApp = new Vue({
        el: '#login',
        data: {
            email: null,
            password: null,
            repeatPassword: null,
            firstName: null,
            lastName: null,
            errorMessage: '',
            showSignInClass: true,
            showSignUpClass: false
        },
        created: function() {
            console.log('created')
            sessionStorage.clear()
        },
        methods: {
            validateSignIn: function () {
                var result = true

                if (!emailRegex.exec(this.email)) {
                    result = false
                    this.errorMessage = "Invalid Email Address"
                }

                return result
            },
            validateSignUp: function () {
                var result = true

                if (this.firstName === "" || this.firstName === null) {
                    result = false
                    this.errorMessage = "First name empty"
                }

                if (result && (this.lastName === "" || this.lastName === null)) {
                    result = false
                    this.errorMessage = "Last name empty"
                }

                if (result && !emailRegex.exec(this.email)) {
                    result = false
                    this.errorMessage = "Invalid Email Address"
                }

                if (result && this.password !== this.repeatPassword) {
                    result = false
                    this.errorMessage = "Passwords not match"
                }


                return result
            },
            showSignInForm: function () {
                console.log('show Sign In')
                this.showSignInClass = true
                this.showSignUpClass = false
            },
            showSignUpForm: function () {
                console.log('show Sign Up')
                this.showSignInClass = false
                this.showSignUpClass = true
            },
            validateResponseData: function(response, responseData) {
                 return ([200,201].indexOf(response.status) > -1) && responseData.hasOwnProperty('data') && responseData.data !== {}
            },
            signIn: function (event) {
                if (event) event.preventDefault()
                var self = this
                var requestOptions = {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({"email": this.email, "password": this.password})
                }

                if (this.validateSignIn()) {
                    fetch(config.apiUrl + '/auth/v1/signin', requestOptions)
                        .then(function (response) {
                            // console.log(response)

                            response.text().then(function (text) {
                                var responseData = text && JSON.parse(text)
                                var error = (responseData && responseData.message) || response.statusText;

                                if (response.ok) {

                                    if (self.validateResponseData(response, responseData)) {
                                        console.log('success', responseData.data)

                                        sessionStorage.setItem('person', JSON.stringify(responseData.data))

                                        Swal.fire({
                                            type: 'success',
                                            title: 'SignIn Success',
                                            text: "Redirecting...",
                                            showConfirmButton: false,
                                            timer: 2000
                                        }).then(function () {
                                            // define a sessão
                                            window.location.href = '/mycv.html'
                                        })

                                    } else {
                                        console.log('error', error)
                                        console.log('data', responseData)

                                        Swal.fire({
                                            type: 'error',
                                            title: 'SignIn Error',
                                            text: error
                                        })
                                    }
                                } else {
                                    console.log('error', responseData)

                                    Swal.fire({
                                        type: 'error',
                                        title: 'SignIn Error',
                                        text: error
                                    })
                                }

                            })
                        }).catch(function (err) {
                        console.error(err)
                        var error = "Service Unavailable"
                        Swal.fire({
                            type: 'error',
                            title: 'SignIn Error',
                            text: error
                        })
                    })
                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'SignIn Error',
                        text: this.errorMessage
                    })
                }

            },
            signUp: function (event) {
                if (event) event.preventDefault()
                var self = this
                if (this.validateSignUp()) {
                    var data = {
                        "firstName": this.firstName,
                        "lastName": this.lastName,
                        "email": this.email,
                        "password": this.password,
                        "gid": null,
                        "imageUrl": null
                    }

                    var requestOptions = {
                        method: 'POST',
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify(data)
                    }

                    fetch(config.apiUrl + '/auth/v1/signup', requestOptions)
                        .then(function (response) {
                            console.log(response)

                            response.text().then(function (text) {
                                var responseData = text && JSON.parse(text)
                                var error = (responseData && responseData.message) || response.statusText;

                                console.log(responseData)

                                if (response.ok) {

                                    if (self.validateResponseData(response, responseData)) {
                                        console.log('success', responseData.data)

                                        sessionStorage.setItem('person', JSON.stringify(responseData.data))
                                        sessionStorage.setItem('welcome', true)

                                        Swal.fire({
                                            type: 'success',
                                            title: 'SignUp Success',
                                            text: "Redirecting...",
                                            showConfirmButton: false,
                                            timer: 2000
                                        }).then(function () {
                                            // define a sessão
                                            window.location.href = '/mycv.html'
                                        })

                                    } else {
                                        console.log('error', error)
                                        console.log('data', responseData)

                                        Swal.fire({
                                            type: 'error',
                                            title: 'SignIn Error',
                                            text: error
                                        })
                                    }
                                } else {
                                    console.log('error', responseData)

                                    Swal.fire({
                                        type: 'error',
                                        title: 'SignIn Error',
                                        text: error
                                    })
                                }

                            })
                        }).catch(function (err) {
                        console.error(err)
                        var error = "Service Unavailable"
                        Swal.fire({
                            type: 'error',
                            title: 'SignIn Error',
                            text: error
                        })
                    })
                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'SignUp Error',
                        text: this.errorMessage
                    })
                }


            }
        }
    })
})()
