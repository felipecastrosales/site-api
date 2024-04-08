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

    // const createTemplateCommand = new CreateTemplateCommand({
    //     Template: {
    //         TemplateName: templateName,
    //         SubjectPart: `Soliciatação enviada com sucesso`,
    //         HtmlPart: `
    //             Olá, {{ username }}! <br>
    //             <p>Recebi sua solicitação com sucesso e em breve retornarei com uma resposta.</p>
    //             <p>Atenciosamente,</p>
    //             <p>Felipe Sales</p>
    //             <p>Sent at ${date}</p>  
    //         `,
    //         TextPart: `
    //             Olá, {{ username }}!
    //             Recebi sua solicitação com sucesso e em breve retornarei com uma resposta.
    //             Atenciosamente,
    //             Felipe Sales
    //             Sent at ${date}
    //         `,
    //     },
    // });

    const updateTemplateCommand = new UpdateTemplateCommand({
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

    try {
        const result = await sesClient.send(createTemplateCommand);
        console.log('Template created: \n', result);
    } catch (error) {
        console.error('Error creating template: \n', error);
    }
};

// run('request-site-simple-mail');
run('site-simple-mail');
