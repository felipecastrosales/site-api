const { SESClient, CreateTemplateCommand, UpdateTemplateCommand } = require('@aws-sdk/client-ses');

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
    // const createTemplateCommand = new CreateTemplateCommand({
    //     Template: {
    //         TemplateName: templateName,
    //         SubjectPart: `Solicitação enviada com sucesso`,
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

    // request-site-simple-mail
    const updateTemplateCommand = new UpdateTemplateCommand({
        Template: {
            TemplateName: `request-site-simple-mail`,
            SubjectPart: `Solicitação enviada com sucesso`,
            HtmlPart: `
                <p>Olá {{ username }}, tudo bem?</p>
                <p>Recebi sua solicitação e em breve retornarei com uma resposta.</p>
                <p>Atenciosamente,</p>
                <p>Felipe Sales</p>
                <p>Sent at {{ date }}</p>
            `,
            TextPart: `
                Olá {{ username }}, tudo bem?
                Recebi sua solicitação com sucesso e em breve retornarei com uma resposta.
                Atenciosamente,
                Felipe Sales
                Sent at {{ date }}
            `,
        },
    });

    // site-simple-mail
    // const updateTemplateCommand = new UpdateTemplateCommand({
    //     Template: {
    //         TemplateName: `site-simple-mail`,
    //         SubjectPart: `{{ subject }}`,
    //         HtmlPart: `
    //             <p>User name: {{ username }} | User email: {{ userEmail }}</p>
    //             <p>{{ body }}</p>
    //             <p>Sent at {{ date }}</p>
    //         `,
    //         TextPart: `
    //             User name: {{ username }} | User email: {{ userEmail }}
    //             {{ body }}
    //             Sent at {{ date }}
    //         `,
    //     },
    // });

    try {
        // const result = await sesClient.send(createTemplateCommand);
        const result = await sesClient.send(updateTemplateCommand);
        console.log('Template created: \n', result);
    } catch (error) {
        console.error('Error creating template: \n', error);
    }
};

run();
