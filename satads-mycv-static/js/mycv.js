(function () {
    var config = {
        // apiUrl: (window.location.host.match(/localhost/))?'http://localhost:2000':'https://services.hagatus.com.br/satads/'
        apiUrl: (window.location.host.match(/localhost/)) ? 'https://oocm64ibk5.execute-api.sa-east-1.amazonaws.com/production/' : 'https://services.hagatus.com.br/satads/'
    }

    var defaultPerson = {
        "uuid": "",
        "firstName": "",
        "lastName": "",
        "email": "",
        "active": 1,
        "deleted": 0,
        "createdAt": new Date().toISOString(),
        "updatedAt": null,
        "deletedAt": null
    }

    var mycvApp = new Vue({
        el: '#mycv',
        data: {
            person: defaultPerson,
            welcome: false
        },
        created: function() {
            console.log('created')

            if (sessionStorage.getItem('person')) {
                try {
                    this.person = JSON.parse(sessionStorage.getItem('person'))
                } catch (e) {
                    console.error(e)
                    this.person = defaultPerson
                }

            }

            if (this.welcome || sessionStorage.getItem('welcome')) {
                console.log('welcome true')
                this.showWelcomeModal()
            } else {
                console.log('welcome false')
            }


            document.title = 'SATADS - MyCv - ' +  this.getPersonFullName();
        },
        methods: {
            showWelcomeModal: function() {
                var self = this
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Welcome '+ self.getPersonFullName(),
                    text: "Thank you to join us!",
                    showConfirmButton: false,
                    timer: 2500
                }).then(function () {

                    sessionStorage.removeItem('welcome')
                    this.welcome = false
                })
            },
            getPersonFullName: function() {
                var fullName = ""
                if (this.person != null) {
                    fullName = this.person.firstName + ' ' + this.person.lastName
                }
                return fullName;
            }
        }
    })
})()
