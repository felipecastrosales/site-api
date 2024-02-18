const { SESClient, CreateTemplateCommand } = require("@aws-sdk/client-ses");

require('dotenv').config();

const SESConfig = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
};

const sesClient = new SESClient(SESConfig);

const run = async (templateName) => {
    const createTemplateCommand = new CreateTemplateCommand({
        Template: {
            TemplateName: templateName,
            SubjectPart: 'Hello hey, {{name}}!',
            HtmlPart: `
                <h1>Hello, {{name}}!</h1>
                <p>This is the message body in HTML format, {{name}}.</p>
            `,
            TextPart: `
                This is the message body in text format, {{name}}.
            `,
        },
    });

    try {
        const result = await sesClient.send(createTemplateCommand);
        console.log('Template created: \n', result);
    } catch (error) {
        console.error('Error creating template: \n', error);
    }
};

run('test-template');
