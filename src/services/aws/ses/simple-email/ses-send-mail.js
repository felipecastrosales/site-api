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
// const sendMail = async ({
//     receiver,
//     subject,
//     body,
// }) => {
const sendMail = async () => {
    const params = {
        Source: process.env.AWS_SES_EMAIL_SENDER,
        // Source: 'Felipe <process.env.AWS_SES_EMAIL_SENDER>',
        // ReplyToAddresses: [process.env.AWS_SES_EMAIL_SENDER],
        Destination: {
            // ToAddresses: [to],
            ToAddresses: [
                process.env.AWS_SES_EMAIL_RECEIVER,
                // 'Felipe <process.env.AWS_SES_EMAIL_SENDER>',
            ],
        },
        Message: {
            Subject: {
                // Data: subject,
                Charset: 'UTF-8',
                // Data: 'Test email',
                Data: 'Meeting Invitation: Product Launch Discussion',
            },
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    // Data: body,
                    Data: '<h1>You are invited to a product launch discussion!</h1><p>Join us on...</p>',
                },
                Text: {
                    Charset: 'UTF-8',
                    // Data: body,
                    Data: 'Meeting Invitation: Product Launch Discussion. Join us on...',
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