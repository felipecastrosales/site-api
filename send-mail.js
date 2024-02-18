import AWS from 'aws-sdk';

require('dotenv').config();

class EmailService {
  constructor(private readonly awsSES: AWS.SES) {}

  async sendMail(): Promise<void> {
    const params: AWS.SES.SendEmailRequest = {
      Source: process.env.AWS_SES_EMAIL_SENDER,
      Destination: {
        ToAddresses: [process.env.AWS_SES_EMAIL_SENDER],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: 'Test email',
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: '<h1>Test, test, test</h1>',
          },
          Text: {
            Charset: 'UTF-8',
            Data: 'This is the message body in text format, Felipe.',
          },
        },
      },
    };

    try {
      const result = await this.awsSES.sendEmail(params).promise();
      console.log('Email sent: \n', result);
    } catch (error) {
      console.error('Error sending email: \n', error);
    }
  }
}

const sesConfig: AWS.SES.ClientConfiguration = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

const awsSES = new AWS.SES(sesConfig);
const emailService = new EmailService(awsSES);

emailService.sendMail();
