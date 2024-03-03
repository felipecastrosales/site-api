const http = require('http');
const AWS = require('aws-sdk');

require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const lambda = new AWS.Lambda();

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                console.log('body', body);

                const response = await lambda.invoke({
                    FunctionName: 'serverless-dev-send_template_mail',
                    Payload: body
                }).promise();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(response.Payload);
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
});

const PORT = 3232;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
