const AWS = require('aws-sdk')
const sns = new AWS.SNS({ region: process.env.REGION })
// const sns = new AWS.SNS({apiVersion: '2010-03-31', 'region': process.env.REGION})

class NotificationService {
  constructor () {
    this.errorMessage = ''
  }

  notify (payload) {
    const params = {
      Message: 'MESSAGE_TEXT', /* required */
      TopicArn: process.env.NOTIFICATON_TOPIC_ARN
    }

    // Create promise and SNS service object
    return sns.publish(params).promise()
  }
}

module.exports = NotificationService
