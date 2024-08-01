const express = require('express');
const joi = require('joi');
const app = express();
const path = require('path');
const fs = require('fs/promises');
const port = 3000;
const localhost = '127.0.0.1';
const userRouter = require('./routes/userRouter');



app.use(express.json());

app.use(express.static('public'));

app.get(['/', '/home'], async (req, res)=>{
    const home = path.join(__dirname, 'public', 'home.html')
    const html = await fs.readFile(home,'utf8'); 
    res.send(html);
})

app.use(['/todos', '/todo'], userRouter);

app.use((err, req, res, next)=>{
    if (err && err.error && err.error.isJoi) {
        res.status(400).json({
            type: err.type,
            message: err.error.toString()
        });
    } else {
        res.status(err.status || 500).json({ error: err.message });
    }
})






app.listen(port, localhost, ()=> console.log(`server running at http://localhost:${port}`));