const AWS = require('aws-sdk');

require('dotenv').config();
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const SESConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
};

const AWS_SES = new AWS.SES(SESConfig);

// const sendMail = async (to, subject, body) => {
const sendMail = async () => {
    const params = {
        Source: process.env.AWS_SES_EMAIL_SENDER,
        // ReplyToAddresses: [process.env.AWS_SES_EMAIL_SENDER],
        Destination: {
            // ToAddresses: [to],
            ToAddresses: [
                process.env.AWS_SES_EMAIL_SENDER,
            ],
        },
        Message: {
            Subject: {
                // Data: subject,
                Charset: 'UTF-8',
                Data: 'Test email',
            },
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    // Data: body,
                    Data: '<h1>Test, test, test</h1>',
                },
                Text: {
                    Charset: 'UTF-8',
                    // Data: body,
                    Data: 'This is the message body in text format, Felipe.',
                },
            },
        },
    };

    try {
        const result = await AWS_SES.sendEmail(params).promise();
        console.log('Email sent: \n', result);
    } catch (error) {
        console.error('Error sending email: \n', error);
    }
};

sendMail();
