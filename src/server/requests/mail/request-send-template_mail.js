const { sendTemplateMail } = require('./template-mailer');

async function handleRequestSendTemplateMail(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const response = await sendTemplateMail(body);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(response);
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });
}

module.exports = { handleRequestSendTemplateMail };
