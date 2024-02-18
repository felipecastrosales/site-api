const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");

require('dotenv').config();

const SESConfig = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
};

const sesClient = new SESClient(SESConfig);

const sendMail = async (templateName, receiver, name) => {
    const sendMailCommand = new SendTemplatedEmailCommand({
        Source: process.env.AWS_SES_EMAIL_SENDER,
        Destination: {
            ToAddresses: [receiver],
        },
        Template: templateName,
        TemplateData: JSON.stringify({ name }),
    });

    try {
        const result = await sesClient.send(sendMailCommand);
        console.log('Email sent: \n', result);
    } catch (error) {
        console.error('Error sending email: \n', error);
    }
}

sendMail('test-template', process.env.AWS_SES_EMAIL_SENDER, 'Felipe');