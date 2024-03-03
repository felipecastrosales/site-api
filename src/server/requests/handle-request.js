const { handleRequestSendTemplateMail } = require('./mail/request-send-template_mail');

async function handleRequest(req, res) {
    if (req.method === 'POST' && req.url === '/send-template-email') {
        await handleRequestSendTemplateMail(req, res);
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
}

module.exports = { handleRequest };
