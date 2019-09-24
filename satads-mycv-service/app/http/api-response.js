class ApiResponse {

    /**
     *
     * @param request
     * @param response
     * @param callback
     */
    constructor (request, response, callback) {
        this.request = request
        this.response = response
        this.body = ''
        this.callback = callback
        this.statusCode = 200
    }

    status (statusCode) {

        if (statusCode) {
            this.statusCode = statusCode;
            this.response.status(statusCode)
        } else {
            this.statusCode = this.response.status()
        }

        return this.statusCode
    }

    json () {

        this.response.setHeader('Content-type', 'application/json')
        this.response.end(JSON.stringify(this.body))
    }

    html () {

        this.response.setHeader('Content-type', 'text/html')
        this.response.end(this.body)
    }

}

module.exports = ApiResponse