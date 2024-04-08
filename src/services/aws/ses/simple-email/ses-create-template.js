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
    const date = new Date();

    const createTemplateCommand = new CreateTemplateCommand({
        Template: {
            TemplateName: templateName,
            SubjectPart: `{{ subject }}`,
            HtmlPart: `
                <p>User name: {{ username }} | User email: {{ userEmail }}</p>
                <p>{{ body }}</p>
                <p>Sent at ${date}</p>  
            `,
            TextPart: `
                User name: {{ username }} | User email: {{ userEmail }}
                {{ body }}
                Sent at ${date}
            `,
        },
    });

    // const updateTemplateCommand = new UpdateTemplateCommand({
    //     Template: {
    //         TemplateName: templateName,
    //         SubjectPart: `{{ subject }}`,
    //         HtmlPart: `
    //             <p>User name: {{ username }} | User email: {{ userEmail }}</p>
    //             <p>{{ body }}</p>
    //             <p>Sent at ${date}</p>  
    //         `,
    //         TextPart: `
    //             User name: {{ username }} | User email: {{ userEmail }}
    //             {{ body }}
    //             Sent at ${date}
    //         `,
    //     },
    // });

    try {
        const result = await sesClient.send(createTemplateCommand);
        console.log('Template created: \n', result);
    } catch (error) {
        console.error('Error creating template: \n', error);
    }
};

run('site-simple-mail');
