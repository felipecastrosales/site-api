const AWS = require('../../../config/aws-config');

async function sendTemplateMail(body) {
    const lambda = new AWS.Lambda();
    const response = await lambda.invoke({
        FunctionName: 'serverless-dev-send_template_mail',
        Payload: body
    }).promise();

    return response.Payload;
}

module.exports = { sendTemplateMail };
