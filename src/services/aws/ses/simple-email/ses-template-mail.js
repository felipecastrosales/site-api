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

const sendMail = async ({
    senderEmail,
    senderName,
    subject,
    body,
}) => {
    const source = `${senderName} <${senderEmail}>`;
    const username = `${senderName}`;
    const userEmail = `${senderEmail}`;

    const sendMailCommand = new SendTemplatedEmailCommand({
        Template: 'site-simple-mail',
        Source: source,
        TemplateData: JSON.stringify({ 
            subject,
            body,
            username,
            userEmail,
        }),
        Destination: {
            ToAddresses: [
                process.env.AWS_SES_EMAIL_RECEIVER,
            ],
        },
    });

    try {
        const result = await sesClient.send(sendMailCommand);
        console.log('Email sent: \n', result);
    } catch (error) {
        console.error('Error sending email: \n', error);
    }
}

sendMail({
    senderName: 'Felipe',
    senderEmail: process.env.AWS_SES_EMAIL_SENDER,
    subject: 'More one email',
    body: 'This is a simple email',
});
