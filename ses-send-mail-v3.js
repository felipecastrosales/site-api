import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const sesConfig = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
};

const sesClient = new SESClient(sesConfig);

const sendMail = async () => {
    const emailParams = {
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
        const sendMailCommand = new SendEmailCommand(emailParams);
        const result = await sesClient.send(sendMailCommand);
        console.log('Email sent:', result);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

sendMail();
