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

const sendMail = async ({
    senderEmail,
    senderName,
    receivers,
    subject,
    body,
}) => {
    const date = new Date();
    const source = `${senderName} <${senderEmail}>`;

    const params = {
        Source: source,
        Destination: {
            ToAddresses: receivers,
        },
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<p>${body}</p> <p>Sent at ${date}</p>`,
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: body,
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

sendMail({
    senderName: 'Felipe',
    senderEmail: process.env.AWS_SES_EMAIL_SENDER,
    subject: 'More one email',
    body: 'This is a test email, sent from AWS SES.',
    receivers: [
        process.env.AWS_SES_EMAIL_RECEIVER,
    ],
});
