// import { Router } from 'express';

// const routes = Router();

// routes.get('/messages', (req, res) => {
//     const sendMessage = new SendMessageService();
// });

const express = require('express');
const app = express();

app.get('/', (req, res) => {

});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
