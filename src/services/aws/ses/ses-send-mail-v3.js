const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

require('dotenv').config();

const SESConfig = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
};

const sesClient = new SESClient(SESConfig);

// const sendMail = async (receiver, subject, body) => {
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
        const sendMailCommand = new SendEmailCommand(params);
        const result = await sesClient.send(sendMailCommand);
        console.log('Email sent: \n', result);
    } catch (error) {
        console.error('Error sending email: \n', error);
    }
};

sendMail();
